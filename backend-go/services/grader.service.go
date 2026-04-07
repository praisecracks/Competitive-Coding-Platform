package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"codingplatform/models"
)

type CodeExecutionResult struct {
	Output        []string
	Status        string
	Error         string
	ExecutionTime string
}

type SubmissionExecutionResult struct {
	Output        []string
	Status        string
	Error         string
	PassedTests   int
	TotalTests    int
	ExecutionTime string
}

type graderSummary struct {
	PassedTests int      `json:"passedTests"`
	TotalTests  int      `json:"totalTests"`
	Status      string   `json:"status"`
	Output      []string `json:"output"`
	Error       string   `json:"error,omitempty"`
}

type genericTestCase struct {
	InputJSON          string `json:"inputJson"`
	ExpectedOutputJSON string `json:"expectedOutputJson"`
	IsHidden           bool   `json:"isHidden,omitempty"`
}

func ExecuteCode(language string, code string, timeout time.Duration) ([]string, string, string) {
	result := executeUserCode(language, code, timeout)
	return result.Output, result.Status, result.Error
}

func ExecuteSubmissionAgainstChallenge(
	language string,
	code string,
	challenge models.Challenge,
	timeout time.Duration,
) SubmissionExecutionResult {
	return executeSubmissionAgainstChallenge(language, code, challenge, timeout)
}

func executeUserCode(language string, code string, timeout time.Duration) CodeExecutionResult {
	tempDir, err := os.MkdirTemp("", "codemaster-run-*")
	if err != nil {
		return CodeExecutionResult{
			Output: []string{"Failed to create temporary execution directory."},
			Status: "failed",
			Error:  "TEMP_DIR_CREATION_FAILED",
		}
	}
	defer os.RemoveAll(tempDir)

	var (
		filename string
		command  *exec.Cmd
	)

	switch strings.ToLower(strings.TrimSpace(language)) {
	case "javascript":
		filename = filepath.Join(tempDir, "main.js")
		if err := os.WriteFile(filename, []byte(code), 0644); err != nil {
			return CodeExecutionResult{
				Output: []string{"Failed to write JavaScript file."},
				Status: "failed",
				Error:  "WRITE_FILE_FAILED",
			}
		}
		command = exec.Command("node", filename)

	case "python":
		filename = filepath.Join(tempDir, "main.py")
		if err := os.WriteFile(filename, []byte(code), 0644); err != nil {
			return CodeExecutionResult{
				Output: []string{"Failed to write Python file."},
				Status: "failed",
				Error:  "WRITE_FILE_FAILED",
			}
		}
		command = exec.Command(detectPythonCommand(), filename)

	case "go":
		filename = filepath.Join(tempDir, "main.go")
		if err := os.WriteFile(filename, []byte(code), 0644); err != nil {
			return CodeExecutionResult{
				Output: []string{"Failed to write Go file."},
				Status: "failed",
				Error:  "WRITE_FILE_FAILED",
			}
		}
		command = exec.Command("go", "run", filename)

	default:
		return CodeExecutionResult{
			Output: []string{"Unsupported language."},
			Status: "failed",
			Error:  "UNSUPPORTED_LANGUAGE",
		}
	}

	start := time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	cmd := exec.CommandContext(ctx, command.Path, command.Args[1:]...)
	cmd.Dir = tempDir

	rawOutput, err := cmd.CombinedOutput()
	execTime := formatExecutionTime(time.Since(start))

	if ctx.Err() == context.DeadlineExceeded {
		return CodeExecutionResult{
			Output:        []string{"Execution timed out after 5 seconds."},
			Status:        "failed",
			Error:         "EXECUTION_TIMEOUT",
			ExecutionTime: execTime,
		}
	}

	outputLines := cleanOutputLines(string(rawOutput))

	if err != nil {
		if len(outputLines) == 0 {
			outputLines = []string{"Execution failed with no additional output."}
		}
		return CodeExecutionResult{
			Output:        outputLines,
			Status:        "failed",
			Error:         "EXECUTION_FAILED",
			ExecutionTime: execTime,
		}
	}

	if len(outputLines) == 0 {
		outputLines = []string{"Execution completed successfully.", "No output returned."}
	}

	return CodeExecutionResult{
		Output:        outputLines,
		Status:        "completed",
		ExecutionTime: execTime,
	}
}

func executeSubmissionAgainstChallenge(
	language string,
	code string,
	challenge models.Challenge,
	timeout time.Duration,
) SubmissionExecutionResult {
	testCases := parseGenericTestCases(challenge.TestCases)
	if len(testCases) == 0 {
		return SubmissionExecutionResult{
			Output:      []string{"This challenge has no test cases configured yet."},
			Status:      "rejected",
			Error:       "MISSING_TEST_CASES",
			PassedTests: 0,
			TotalTests:  0,
		}
	}

	program, err := buildSubmissionProgram(language, challenge, code, testCases)
	if err != nil {
		return SubmissionExecutionResult{
			Output:      []string{"Failed to prepare grading program."},
			Status:      "internal_error",
			Error:       err.Error(),
			PassedTests: 0,
			TotalTests:  len(testCases),
		}
	}

	tempDir, err := os.MkdirTemp("", "codemaster-submit-*")
	if err != nil {
		return SubmissionExecutionResult{
			Output:      []string{"Failed to create temporary grading directory."},
			Status:      "internal_error",
			Error:       "TEMP_DIR_CREATION_FAILED",
			PassedTests: 0,
			TotalTests:  len(testCases),
		}
	}
	defer os.RemoveAll(tempDir)

	var (
		filename string
		command  *exec.Cmd
	)

	switch strings.ToLower(strings.TrimSpace(language)) {
	case "javascript":
		filename = filepath.Join(tempDir, "grade.js")
		if err := os.WriteFile(filename, []byte(program), 0644); err != nil {
			return SubmissionExecutionResult{
				Output:      []string{"Failed to write JavaScript grader file."},
				Status:      "internal_error",
				Error:       "WRITE_FILE_FAILED",
				PassedTests: 0,
				TotalTests:  len(testCases),
			}
		}
		command = exec.Command("node", filename)

	case "python":
		filename = filepath.Join(tempDir, "grade.py")
		if err := os.WriteFile(filename, []byte(program), 0644); err != nil {
			return SubmissionExecutionResult{
				Output:      []string{"Failed to write Python grader file."},
				Status:      "internal_error",
				Error:       "WRITE_FILE_FAILED",
				PassedTests: 0,
				TotalTests:  len(testCases),
			}
		}
		command = exec.Command(detectPythonCommand(), filename)

	case "go":
		filename = filepath.Join(tempDir, "grade.go")
		if err := os.WriteFile(filename, []byte(program), 0644); err != nil {
			return SubmissionExecutionResult{
				Output:      []string{"Failed to write Go grader file."},
				Status:      "internal_error",
				Error:       "WRITE_FILE_FAILED",
				PassedTests: 0,
				TotalTests:  len(testCases),
			}
		}
		command = exec.Command("go", "run", filename)

	default:
		return SubmissionExecutionResult{
			Output:      []string{"Unsupported language for submission grading."},
			Status:      "rejected",
			Error:       "UNSUPPORTED_LANGUAGE",
			PassedTests: 0,
			TotalTests:  len(testCases),
		}
	}

	start := time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	cmd := exec.CommandContext(ctx, command.Path, command.Args[1:]...)
	cmd.Dir = tempDir

	rawOutput, execErr := cmd.CombinedOutput()
	execTime := formatExecutionTime(time.Since(start))

	if ctx.Err() == context.DeadlineExceeded {
		return SubmissionExecutionResult{
			Output:        []string{"Submission grading timed out."},
			Status:        "runtime_error",
			Error:         "EXECUTION_TIMEOUT",
			PassedTests:   0,
			TotalTests:    len(testCases),
			ExecutionTime: execTime,
		}
	}

	rawText := strings.TrimSpace(string(rawOutput))
	if rawText == "" && execErr != nil {
		return SubmissionExecutionResult{
			Output:        []string{"Submission execution failed with no output."},
			Status:        "runtime_error",
			Error:         "EXECUTION_FAILED",
			PassedTests:   0,
			TotalTests:    len(testCases),
			ExecutionTime: execTime,
		}
	}

	var summary graderSummary
	if err := json.Unmarshal([]byte(rawText), &summary); err != nil {
		lines := cleanOutputLines(rawText)
		if len(lines) == 0 {
			lines = []string{"Failed to parse grading output."}
		}
		return SubmissionExecutionResult{
			Output:        lines,
			Status:        "runtime_error",
			Error:         "GRADING_PARSE_FAILED",
			PassedTests:   0,
			TotalTests:    len(testCases),
			ExecutionTime: execTime,
		}
	}

	status := normalizeSubmissionStatus(summary.Status, summary.PassedTests, summary.TotalTests, strings.TrimSpace(summary.Error))
	if len(summary.Output) == 0 {
		summary.Output = []string{
			fmt.Sprintf("Passed %d/%d test cases.", summary.PassedTests, summary.TotalTests),
		}
	}

	if strings.TrimSpace(summary.Error) != "" && status == "accepted" {
		status = "runtime_error"
	}

	return SubmissionExecutionResult{
		Output:        summary.Output,
		Status:        status,
		Error:         strings.TrimSpace(summary.Error),
		PassedTests:   summary.PassedTests,
		TotalTests:    summary.TotalTests,
		ExecutionTime: execTime,
	}
}

func normalizeSubmissionStatus(status string, passed int, total int, errorCode string) string {
	normalized := strings.ToLower(strings.TrimSpace(status))
	trimmedError := strings.TrimSpace(errorCode)

	if trimmedError != "" {
		switch trimmedError {
		case "FUNCTION_NOT_FOUND":
			return "runtime_error"
		case "EXECUTION_TIMEOUT":
			return "runtime_error"
		case "EXECUTION_FAILED":
			return "runtime_error"
		case "GRADING_PARSE_FAILED":
			return "runtime_error"
		}
	}

	switch normalized {
	case "accepted":
		return "accepted"
	case "partial":
		return "partial"
	case "rejected":
		if total > 0 && passed > 0 && passed < total {
			return "partial"
		}
		return "rejected"
	case "runtime_error":
		return "runtime_error"
	case "compilation_error":
		return "compilation_error"
	case "internal_error":
		return "internal_error"
	}

	if total > 0 && passed == total {
		return "accepted"
	}

	if total > 0 && passed > 0 && passed < total {
		return "partial"
	}

	return "rejected"
}

func parseGenericTestCases(testCases []models.ChallengeTestCase) []genericTestCase {
	result := make([]genericTestCase, 0, len(testCases))

	for _, tc := range testCases {
		input := strings.TrimSpace(tc.InputJSON)
		if input == "" {
			input = strings.TrimSpace(tc.Input)
		}

		expected := strings.TrimSpace(tc.ExpectedOutputJSON)
		if expected == "" {
			expected = strings.TrimSpace(tc.ExpectedOutput)
		}

		if input == "" || expected == "" {
			continue
		}

		result = append(result, genericTestCase{
			InputJSON:          input,
			ExpectedOutputJSON: expected,
			IsHidden:           tc.IsHidden,
		})
	}

	return result
}

func buildSubmissionProgram(
	language string,
	challenge models.Challenge,
	code string,
	testCases []genericTestCase,
) (string, error) {
	functionName := strings.TrimSpace(challenge.FunctionName)
	if functionName == "" {
		functionName = "solve"
	}

	validatorType := strings.ToLower(strings.TrimSpace(challenge.ValidatorType))
	if validatorType == "" {
		validatorType = "exact"
	}

	inputType := strings.ToLower(strings.TrimSpace(challenge.InputType))
	if inputType == "" {
		inputType = "single_string"
	}

	returnType := strings.ToLower(strings.TrimSpace(challenge.ReturnType))
	if returnType == "" {
		returnType = "string"
	}

	switch strings.ToLower(strings.TrimSpace(language)) {
	case "javascript":
		return buildJavaScriptGenericProgram(code, testCases, functionName, validatorType, inputType)
	case "python":
		return buildPythonGenericProgram(code, testCases, functionName, validatorType, inputType)
	case "go":
		return buildGoGenericProgram(code, testCases, functionName, validatorType, inputType, returnType)
	default:
		return "", errors.New("UNSUPPORTED_CHALLENGE_OR_LANGUAGE")
	}
}

func buildJavaScriptGenericProgram(
	code string,
	cases []genericTestCase,
	functionName string,
	validatorType string,
	inputType string,
) (string, error) {
	sanitized := sanitizeJavaScriptForSubmission(code)
	casesJSON, err := json.Marshal(cases)
	if err != nil {
		return "", err
	}

	program := fmt.Sprintf(`%s

const __TEST_CASES = %s;
const __FUNCTION_NAME = %q;
const __VALIDATOR_TYPE = %q;
const __INPUT_TYPE = %q;

function __parseJSON(raw) {
  return JSON.parse(raw);
}

function __callTarget(fn, rawInput) {
  const parsed = __parseJSON(rawInput);

  switch (__INPUT_TYPE) {
    case "json_args":
      if (!Array.isArray(parsed)) {
        throw new Error("json_args input must be a JSON array");
      }
      return fn(...parsed);
    case "single_string":
    case "single_integer":
    case "single_number":
    case "single_boolean":
    case "single_value":
    default:
      return fn(parsed);
  }
}

function __isNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}

function __compareIntArraysExact(expected, actual) {
  if (!Array.isArray(actual) || expected.length !== actual.length) return false;
  for (let i = 0; i < expected.length; i += 1) {
    if (Number(expected[i]) !== Number(actual[i])) return false;
  }
  return true;
}

function __compareIntArraysAnyOrder(expected, actual) {
  if (!Array.isArray(actual) || expected.length !== actual.length) return false;
  const a = [...expected].map(Number).sort((x, y) => x - y);
  const b = [...actual].map(Number).sort((x, y) => x - y);
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function __normalizeForMessage(value) {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function __compare(expectedRaw, actual) {
  const expected = __parseJSON(expectedRaw);

  switch (__VALIDATOR_TYPE) {
    case "boolean":
      return String(Boolean(actual)) === String(Boolean(expected));

    case "integer":
      return Number(actual) === Number(expected);

    case "float_tolerance":
      if (!__isNumber(Number(actual)) || !__isNumber(Number(expected))) return false;
      return Math.abs(Number(actual) - Number(expected)) < 0.000001;

    case "string":
      return String(actual).trim() === String(expected).trim();

    case "int_array_exact":
      return __compareIntArraysExact(expected, actual);

    case "int_array_any_order":
      return __compareIntArraysAnyOrder(expected, actual);

    case "exact":
    default:
      if (typeof expected === "number") {
        return Number(actual) === Number(expected);
      }

      if (typeof expected === "string") {
        return String(actual).trim() === String(expected).trim();
      }

      return JSON.stringify(actual) === JSON.stringify(expected);
  }
}

function __resolveFunction(name) {
  if (typeof globalThis[name] === "function") {
    return globalThis[name];
  }

  try {
    const candidate = eval(name);
    if (typeof candidate === "function") {
      return candidate;
    }
  } catch {
    //
  }

  return undefined;
}

const __fn = __resolveFunction(__FUNCTION_NAME);
const __results = [];
let __passed = 0;

if (typeof __fn !== "function") {
  process.stdout.write(JSON.stringify({
    passedTests: 0,
    totalTests: __TEST_CASES.length,
    status: "runtime_error",
    output: ["Required function '" + __FUNCTION_NAME + "' was not found."],
    error: "FUNCTION_NOT_FOUND"
  }));
} else {
  for (const tc of __TEST_CASES) {
    try {
      const actual = __callTarget(__fn, tc.inputJson);
      const passed = __compare(tc.expectedOutputJson, actual);
      const expectedForMessage = __normalizeForMessage(__parseJSON(tc.expectedOutputJson));
      const actualForMessage = __normalizeForMessage(actual);

      if (passed) {
        __passed += 1;
        __results.push("Test passed");
      } else {
        __results.push("Expected " + expectedForMessage + " but received " + actualForMessage);
      }
    } catch (error) {
      __results.push("Runtime error: " + String(error));
    }
  }

  let __status = "rejected";
  if (__passed === __TEST_CASES.length) {
    __status = "accepted";
  } else if (__passed > 0) {
    __status = "partial";
  }

  process.stdout.write(JSON.stringify({
    passedTests: __passed,
    totalTests: __TEST_CASES.length,
    status: __status,
    output: __results
  }));
}
`, sanitized, string(casesJSON), functionName, validatorType, inputType)

	return program, nil
}

func buildPythonGenericProgram(
	code string,
	cases []genericTestCase,
	functionName string,
	validatorType string,
	inputType string,
) (string, error) {
	sanitized := sanitizePythonForSubmission(code)
	casesJSON, err := json.Marshal(cases)
	if err != nil {
		return "", err
	}

	program := fmt.Sprintf(`import json
import io
import math
import contextlib

%s

__TEST_CASES = json.loads(r'''%s''')
__FUNCTION_NAME = %q
__VALIDATOR_TYPE = %q
__INPUT_TYPE = %q

def __call_target(fn, raw_input):
    parsed = json.loads(raw_input)

    if __INPUT_TYPE == "json_args":
        if not isinstance(parsed, list):
            raise ValueError("json_args input must be a JSON array")
        return fn(*parsed)

    return fn(parsed)

def __compare_int_arrays_exact(expected, actual):
    if not isinstance(actual, list) or len(expected) != len(actual):
        return False
    return [int(x) for x in expected] == [int(x) for x in actual]

def __compare_int_arrays_any_order(expected, actual):
    if not isinstance(actual, list) or len(expected) != len(actual):
        return False
    return sorted([int(x) for x in expected]) == sorted([int(x) for x in actual])

def __compare(expected_raw, actual):
    expected = json.loads(expected_raw)

    if __VALIDATOR_TYPE == "boolean":
        return bool(actual) == bool(expected)

    if __VALIDATOR_TYPE == "integer":
        return int(actual) == int(expected)

    if __VALIDATOR_TYPE == "float_tolerance":
        return math.fabs(float(actual) - float(expected)) < 0.000001

    if __VALIDATOR_TYPE == "string":
        return str(actual).strip() == str(expected).strip()

    if __VALIDATOR_TYPE == "int_array_exact":
        return __compare_int_arrays_exact(expected, actual)

    if __VALIDATOR_TYPE == "int_array_any_order":
        return __compare_int_arrays_any_order(expected, actual)

    return json.dumps(actual, separators=(",", ":")) == json.dumps(expected, separators=(",", ":"))

def __normalize_for_message(value):
    if isinstance(value, str):
        return value
    return json.dumps(value, separators=(",", ":"))

__results = []
__passed = 0
__fn = globals().get(__FUNCTION_NAME)

if not callable(__fn):
    summary = {
        "passedTests": 0,
        "totalTests": len(__TEST_CASES),
        "status": "runtime_error",
        "output": [f"Required function '{__FUNCTION_NAME}' was not found."],
        "error": "FUNCTION_NOT_FOUND",
    }
    print(json.dumps(summary))
else:
    for tc in __TEST_CASES:
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                actual = __call_target(__fn, tc["inputJson"])

            passed = __compare(tc["expectedOutputJson"], actual)
            expected_for_message = __normalize_for_message(json.loads(tc["expectedOutputJson"]))
            actual_for_message = __normalize_for_message(actual)

            if passed:
                __passed += 1
                __results.append("Test passed")
            else:
                __results.append(f"Expected {expected_for_message} but received {actual_for_message}")
        except Exception as error:
            __results.append(f"Runtime error: {error}")

    summary = {
        "passedTests": __passed,
        "totalTests": len(__TEST_CASES),
        "status": "accepted" if __passed == len(__TEST_CASES) else ("partial" if __passed > 0 else "rejected"),
        "output": __results,
    }
    print(json.dumps(summary))
`, sanitized, string(casesJSON), functionName, validatorType, inputType)

	return program, nil
}

func buildGoGenericProgram(
	code string,
	cases []genericTestCase,
	functionName string,
	validatorType string,
	inputType string,
	returnType string,
) (string, error) {
	sanitized := sanitizeGoForSubmission(code)
	casesJSON, err := json.Marshal(cases)
	if err != nil {
		return "", err
	}

	callSnippet, err := buildGoCallSnippet(functionName, inputType)
	if err != nil {
		return "", err
	}

	program := fmt.Sprintf(`package main

import (
	"encoding/json"
	"errors"
	"math"
	"os"
	"sort"
	"strings"
)

%s

type __Case struct {
	InputJSON          string `+"`json:\"inputJson\"`"+`
	ExpectedOutputJSON string `+"`json:\"expectedOutputJson\"`"+`
	IsHidden           bool   `+"`json:\"isHidden,omitempty\"`"+`
}

type __Summary struct {
	PassedTests int      `+"`json:\"passedTests\"`"+`
	TotalTests  int      `+"`json:\"totalTests\"`"+`
	Status      string   `+"`json:\"status\"`"+`
	Output      []string `+"`json:\"output\"`"+`
	Error       string   `+"`json:\"error,omitempty\"`"+`
}

const __VALIDATOR_TYPE = %q
const __INPUT_TYPE = %q
const __RETURN_TYPE = %q

func __normalizeForMessage(value any) string {
	bytes, err := json.Marshal(value)
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(bytes))
}

func __compareIntArraysExact(expected []int, actual []int) bool {
	if len(expected) != len(actual) {
		return false
	}
	for i := range expected {
		if expected[i] != actual[i] {
			return false
		}
	}
	return true
}

func __compareIntArraysAnyOrder(expected []int, actual []int) bool {
	if len(expected) != len(actual) {
		return false
	}
	a := append([]int(nil), expected...)
	b := append([]int(nil), actual...)
	sort.Ints(a)
	sort.Ints(b)
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func __compare(expectedRaw string, actual any) (bool, string, string) {
	expectedMessage := strings.TrimSpace(expectedRaw)
	actualMessage := __normalizeForMessage(actual)

	switch __VALIDATOR_TYPE {
	case "boolean":
		var expected bool
		if err := json.Unmarshal([]byte(expectedRaw), &expected); err != nil {
			return false, expectedMessage, actualMessage
		}
		actualValue, ok := actual.(bool)
		if !ok {
			return false, expectedMessage, actualMessage
		}
		return actualValue == expected, expectedMessage, actualMessage

	case "integer":
		var expected int
		if err := json.Unmarshal([]byte(expectedRaw), &expected); err != nil {
			return false, expectedMessage, actualMessage
		}

		switch v := actual.(type) {
		case int:
			return v == expected, expectedMessage, actualMessage
		case int32:
			return int(v) == expected, expectedMessage, actualMessage
		case int64:
			return int(v) == expected, expectedMessage, actualMessage
		default:
			return false, expectedMessage, actualMessage
		}

	case "float_tolerance":
		var expected float64
		if err := json.Unmarshal([]byte(expectedRaw), &expected); err != nil {
			return false, expectedMessage, actualMessage
		}

		switch v := actual.(type) {
		case float32:
			return math.Abs(float64(v)-expected) < 0.000001, expectedMessage, actualMessage
		case float64:
			return math.Abs(v-expected) < 0.000001, expectedMessage, actualMessage
		case int:
			return math.Abs(float64(v)-expected) < 0.000001, expectedMessage, actualMessage
		default:
			return false, expectedMessage, actualMessage
		}

	case "string":
		var expected string
		if err := json.Unmarshal([]byte(expectedRaw), &expected); err != nil {
			return false, expectedMessage, actualMessage
		}
		actualValue, ok := actual.(string)
		if !ok {
			return false, expectedMessage, actualMessage
		}
		return strings.TrimSpace(actualValue) == strings.TrimSpace(expected), expectedMessage, actualMessage

	case "int_array_exact":
		var expected []int
		if err := json.Unmarshal([]byte(expectedRaw), &expected); err != nil {
			return false, expectedMessage, actualMessage
		}
		actualValue, ok := actual.([]int)
		if !ok {
			return false, expectedMessage, actualMessage
		}
		return __compareIntArraysExact(expected, actualValue), expectedMessage, actualMessage

	case "int_array_any_order":
		var expected []int
		if err := json.Unmarshal([]byte(expectedRaw), &expected); err != nil {
			return false, expectedMessage, actualMessage
		}
		actualValue, ok := actual.([]int)
		if !ok {
			return false, expectedMessage, actualMessage
		}
		return __compareIntArraysAnyOrder(expected, actualValue), expectedMessage, actualMessage

	case "exact":
		fallthrough
	default:
		var expected any
		if err := json.Unmarshal([]byte(expectedRaw), &expected); err != nil {
			return false, expectedMessage, actualMessage
		}
		expectedBytes, _ := json.Marshal(expected)
		actualBytes, _ := json.Marshal(actual)
		return strings.TrimSpace(string(expectedBytes)) == strings.TrimSpace(string(actualBytes)), string(expectedBytes), string(actualBytes)
	}
}

func main() {
	var cases []__Case
	if err := json.Unmarshal([]byte(%q), &cases); err != nil {
		summary := __Summary{
			PassedTests: 0,
			TotalTests:  0,
			Status:      "internal_error",
			Output:      []string{"Failed to parse embedded test cases."},
			Error:       "TEST_CASE_PARSE_FAILED",
		}
		_ = json.NewEncoder(os.Stdout).Encode(summary)
		return
	}

	results := make([]string, 0, len(cases))
	passed := 0

	for _, tc := range cases {
		actual, callErr := func() (any, error) {
%s
		}()

		if callErr != nil {
			results = append(results, "Runtime error: "+callErr.Error())
			continue
		}

		ok, expectedForMessage, actualForMessage := __compare(tc.ExpectedOutputJSON, actual)
		if ok {
			passed++
			results = append(results, "Test passed")
		} else {
			results = append(results, "Expected "+expectedForMessage+" but received "+actualForMessage)
		}
	}

	status := "rejected"
	if passed == len(cases) {
		status = "accepted"
	} else if passed > 0 {
		status = "partial"
	}

	summary := __Summary{
		PassedTests: passed,
		TotalTests:  len(cases),
		Status:      status,
		Output:      results,
	}

	encoder := json.NewEncoder(os.Stdout)
	encoder.SetEscapeHTML(false)
	_ = encoder.Encode(summary)
}
`, sanitized, validatorType, inputType, returnType, string(casesJSON), callSnippet)

	return program, nil
}

func buildGoCallSnippet(functionName string, inputType string) (string, error) {
	fn := strings.TrimSpace(functionName)
	if fn == "" {
		fn = "solve"
	}

	switch strings.ToLower(strings.TrimSpace(inputType)) {
	case "json_args":
		return fmt.Sprintf(`
			var args []json.RawMessage
			if err := json.Unmarshal([]byte(tc.InputJSON), &args); err != nil {
				return nil, err
			}

			if len(args) != 2 {
				return nil, errors.New("json_args currently expects exactly 2 arguments for Go challenges")
			}

			var first []int
			if err := json.Unmarshal(args[0], &first); err != nil {
				return nil, err
			}

			var second int
			if err := json.Unmarshal(args[1], &second); err != nil {
				return nil, err
			}

			result := %s(first, second)
			return any(result), nil
`, fn), nil

	case "single_string":
		return fmt.Sprintf(`
			var input string
			if err := json.Unmarshal([]byte(tc.InputJSON), &input); err != nil {
				return nil, err
			}

			result := %s(input)
			return any(result), nil
`, fn), nil

	case "single_integer":
		return fmt.Sprintf(`
			var input int
			if err := json.Unmarshal([]byte(tc.InputJSON), &input); err != nil {
				return nil, err
			}

			result := %s(input)
			return any(result), nil
`, fn), nil

	case "single_number":
		return fmt.Sprintf(`
			var input float64
			if err := json.Unmarshal([]byte(tc.InputJSON), &input); err != nil {
				return nil, err
			}

			result := %s(input)
			return any(result), nil
`, fn), nil

	case "single_boolean":
		return fmt.Sprintf(`
			var input bool
			if err := json.Unmarshal([]byte(tc.InputJSON), &input); err != nil {
				return nil, err
			}

			result := %s(input)
			return any(result), nil
`, fn), nil

	case "single_value":
		fallthrough
	default:
		return "", errors.New("UNSUPPORTED_GO_INPUT_TYPE")
	}
}

func sanitizeJavaScriptForSubmission(code string) string {
	lines := strings.Split(code, "\n")
	filtered := make([]string, 0, len(lines))

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "console.log(") {
			continue
		}
		filtered = append(filtered, line)
	}

	return strings.TrimSpace(strings.Join(filtered, "\n"))
}

func sanitizePythonForSubmission(code string) string {
	lines := strings.Split(code, "\n")
	filtered := make([]string, 0, len(lines))

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "print(") {
			continue
		}
		filtered = append(filtered, line)
	}

	return strings.TrimSpace(strings.Join(filtered, "\n"))
}

func sanitizeGoForSubmission(code string) string {
	lines := strings.Split(code, "\n")
	filtered := make([]string, 0, len(lines))

	skippingImportBlock := false
	skippingMainFunc := false
	mainBraceBalance := 0

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)

		if strings.HasPrefix(trimmed, "package ") {
			continue
		}

		if skippingImportBlock {
			if strings.Contains(trimmed, ")") {
				skippingImportBlock = false
			}
			continue
		}

		if trimmed == "import (" {
			skippingImportBlock = true
			continue
		}

		if strings.HasPrefix(trimmed, "import ") {
			continue
		}

		if !skippingMainFunc && strings.HasPrefix(trimmed, "func main(") {
			skippingMainFunc = true
			mainBraceBalance += strings.Count(line, "{")
			mainBraceBalance -= strings.Count(line, "}")
			if mainBraceBalance <= 0 {
				skippingMainFunc = false
				mainBraceBalance = 0
			}
			continue
		}

		if skippingMainFunc {
			mainBraceBalance += strings.Count(line, "{")
			mainBraceBalance -= strings.Count(line, "}")
			if mainBraceBalance <= 0 {
				skippingMainFunc = false
				mainBraceBalance = 0
			}
			continue
		}

		filtered = append(filtered, line)
	}

	return strings.TrimSpace(strings.Join(filtered, "\n"))
}

func detectPythonCommand() string {
	if runtime.GOOS == "windows" {
		if _, err := exec.LookPath("python"); err == nil {
			return "python"
		}
		if _, err := exec.LookPath("py"); err == nil {
			return "py"
		}
		return "python"
	}

	if _, err := exec.LookPath("python3"); err == nil {
		return "python3"
	}
	if _, err := exec.LookPath("python"); err == nil {
		return "python"
	}

	return "python3"
}

func cleanOutputLines(output string) []string {
	trimmed := strings.TrimSpace(output)
	if trimmed == "" {
		return []string{}
	}

	lines := strings.Split(trimmed, "\n")
	result := make([]string, 0, len(lines))

	for _, line := range lines {
		clean := strings.TrimSpace(line)
		if clean != "" {
			result = append(result, clean)
		}
	}

	return result
}

func formatExecutionTime(duration time.Duration) string {
	if duration < time.Millisecond {
		return fmt.Sprintf("%dµs", duration.Microseconds())
	}
	if duration < time.Second {
		return fmt.Sprintf("%dms", duration.Milliseconds())
	}
	return duration.Round(time.Millisecond).String()
}