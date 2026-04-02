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
	"strconv"
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

type twoSumCase struct {
	Nums           []int  `json:"nums"`
	Target         int    `json:"target"`
	ExpectedOutput string `json:"expectedOutput"`
}

type stringCase struct {
	Input          string `json:"input"`
	ExpectedOutput string `json:"expectedOutput"`
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

	switch language {
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
	if len(challenge.TestCases) == 0 {
		return SubmissionExecutionResult{
			Output:      []string{"This challenge has no test cases configured yet."},
			Status:      "failed",
			Error:       "MISSING_TEST_CASES",
			PassedTests: 0,
			TotalTests:  0,
		}
	}

	program, err := buildSubmissionProgram(language, challenge, code)
	if err != nil {
		return SubmissionExecutionResult{
			Output:      []string{"Failed to prepare grading program."},
			Status:      "failed",
			Error:       err.Error(),
			PassedTests: 0,
			TotalTests:  len(challenge.TestCases),
		}
	}

	tempDir, err := os.MkdirTemp("", "codemaster-submit-*")
	if err != nil {
		return SubmissionExecutionResult{
			Output:      []string{"Failed to create temporary grading directory."},
			Status:      "failed",
			Error:       "TEMP_DIR_CREATION_FAILED",
			PassedTests: 0,
			TotalTests:  len(challenge.TestCases),
		}
	}
	defer os.RemoveAll(tempDir)

	var (
		filename string
		command  *exec.Cmd
	)

	switch language {
	case "javascript":
		filename = filepath.Join(tempDir, "grade.js")
		if err := os.WriteFile(filename, []byte(program), 0644); err != nil {
			return SubmissionExecutionResult{
				Output:      []string{"Failed to write JavaScript grader file."},
				Status:      "failed",
				Error:       "WRITE_FILE_FAILED",
				PassedTests: 0,
				TotalTests:  len(challenge.TestCases),
			}
		}
		command = exec.Command("node", filename)

	case "python":
		filename = filepath.Join(tempDir, "grade.py")
		if err := os.WriteFile(filename, []byte(program), 0644); err != nil {
			return SubmissionExecutionResult{
				Output:      []string{"Failed to write Python grader file."},
				Status:      "failed",
				Error:       "WRITE_FILE_FAILED",
				PassedTests: 0,
				TotalTests:  len(challenge.TestCases),
			}
		}
		command = exec.Command(detectPythonCommand(), filename)

	case "go":
		filename = filepath.Join(tempDir, "grade.go")
		if err := os.WriteFile(filename, []byte(program), 0644); err != nil {
			return SubmissionExecutionResult{
				Output:      []string{"Failed to write Go grader file."},
				Status:      "failed",
				Error:       "WRITE_FILE_FAILED",
				PassedTests: 0,
				TotalTests:  len(challenge.TestCases),
			}
		}
		command = exec.Command("go", "run", filename)

	default:
		return SubmissionExecutionResult{
			Output:      []string{"Unsupported language for submission grading."},
			Status:      "failed",
			Error:       "UNSUPPORTED_LANGUAGE",
			PassedTests: 0,
			TotalTests:  len(challenge.TestCases),
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
			Status:        "failed",
			Error:         "EXECUTION_TIMEOUT",
			PassedTests:   0,
			TotalTests:    len(challenge.TestCases),
			ExecutionTime: execTime,
		}
	}

	rawText := strings.TrimSpace(string(rawOutput))
	if rawText == "" && execErr != nil {
		return SubmissionExecutionResult{
			Output:        []string{"Submission execution failed with no output."},
			Status:        "failed",
			Error:         "EXECUTION_FAILED",
			PassedTests:   0,
			TotalTests:    len(challenge.TestCases),
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
			Status:        "failed",
			Error:         "GRADING_PARSE_FAILED",
			PassedTests:   0,
			TotalTests:    len(challenge.TestCases),
			ExecutionTime: execTime,
		}
	}

	status := strings.ToLower(strings.TrimSpace(summary.Status))
	if status == "" {
		status = "failed"
	}

	if len(summary.Output) == 0 {
		summary.Output = []string{
			fmt.Sprintf("Passed %d/%d test cases.", summary.PassedTests, summary.TotalTests),
		}
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

func buildSubmissionProgram(language string, challenge models.Challenge, code string) (string, error) {
	switch challenge.ID {
	case 1:
		cases, err := parseTwoSumCases(challenge.TestCases)
		if err != nil {
			return "", err
		}
		switch language {
		case "javascript":
			return buildJavaScriptTwoSumProgram(code, cases)
		case "python":
			return buildPythonTwoSumProgram(code, cases)
		case "go":
			return buildGoTwoSumProgram(code, cases)
		}

	case 2:
		cases := parseStringCases(challenge.TestCases)
		switch language {
		case "javascript":
			return buildJavaScriptStringChallengeProgram(code, cases, "solve")
		case "python":
			return buildPythonStringChallengeProgram(code, cases)
		case "go":
			return buildGoValidParenthesesProgram(code, cases)
		}

	case 3:
		cases := parseStringCases(challenge.TestCases)
		switch language {
		case "javascript":
			return buildJavaScriptStringChallengeProgram(code, cases, "solve")
		case "python":
			return buildPythonStringChallengeProgram(code, cases)
		case "go":
			return buildGoLongestSubstringProgram(code, cases)
		}
	}

	return "", errors.New("UNSUPPORTED_CHALLENGE_OR_LANGUAGE")
}

func parseTwoSumCases(testCases []models.ChallengeTestCase) ([]twoSumCase, error) {
	result := make([]twoSumCase, 0, len(testCases))

	for _, tc := range testCases {
		parts := strings.Split(strings.TrimSpace(tc.Input), "\n")
		if len(parts) < 2 {
			return nil, fmt.Errorf("invalid two sum test input: %s", tc.Input)
		}

		var nums []int
		if err := json.Unmarshal([]byte(strings.TrimSpace(parts[0])), &nums); err != nil {
			return nil, fmt.Errorf("invalid two sum nums input: %w", err)
		}

		target, err := strconv.Atoi(strings.TrimSpace(parts[1]))
		if err != nil {
			return nil, fmt.Errorf("invalid two sum target input: %w", err)
		}

		result = append(result, twoSumCase{
			Nums:           nums,
			Target:         target,
			ExpectedOutput: strings.TrimSpace(tc.ExpectedOutput),
		})
	}

	return result, nil
}

func parseStringCases(testCases []models.ChallengeTestCase) []stringCase {
	result := make([]stringCase, 0, len(testCases))
	for _, tc := range testCases {
		result = append(result, stringCase{
			Input:          tc.Input,
			ExpectedOutput: strings.TrimSpace(tc.ExpectedOutput),
		})
	}
	return result
}

func buildJavaScriptTwoSumProgram(code string, cases []twoSumCase) (string, error) {
	sanitized := sanitizeJavaScriptForSubmission(code)
	casesJSON, err := json.Marshal(cases)
	if err != nil {
		return "", err
	}

	program := fmt.Sprintf(`%s

const __TEST_CASES = %s;

function __normalize(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === null || value === undefined) return String(value).trim();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).trim();
}

const __results = [];
let __passed = 0;

for (const tc of __TEST_CASES) {
  try {
    const result = solve(tc.nums, tc.target);
    const normalized = __normalize(result);
    const passed = normalized === tc.expectedOutput;

    if (passed) __passed += 1;

    __results.push(
      passed
        ? "Test passed"
        : "Expected " + tc.expectedOutput + " but received " + normalized
    );
  } catch (error) {
    __results.push("Runtime error: " + String(error));
  }
}

const __summary = {
  passedTests: __passed,
  totalTests: __TEST_CASES.length,
  status: __passed === __TEST_CASES.length ? "accepted" : "failed",
  output: __results
};

process.stdout.write(JSON.stringify(__summary));
`, sanitized, string(casesJSON))

	return program, nil
}

func buildPythonTwoSumProgram(code string, cases []twoSumCase) (string, error) {
	sanitized := sanitizePythonForSubmission(code)
	casesJSON, err := json.Marshal(cases)
	if err != nil {
		return "", err
	}

	program := fmt.Sprintf(`import json
import io
import contextlib

%s

__TEST_CASES = json.loads(r'''%s''')

def __normalize(value):
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (list, dict)):
        return json.dumps(value, separators=(",", ":"))
    if value is None:
        return "null"
    return str(value).strip()

__results = []
__passed = 0

for tc in __TEST_CASES:
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            result = solve(tc["nums"], tc["target"])
        normalized = __normalize(result)
        passed = normalized == tc["expectedOutput"]
        if passed:
            __passed += 1
            __results.append("Test passed")
        else:
            __results.append(f'Expected {tc["expectedOutput"]} but received {normalized}')
    except Exception as error:
        __results.append(f"Runtime error: {error}")

summary = {
    "passedTests": __passed,
    "totalTests": len(__TEST_CASES),
    "status": "accepted" if __passed == len(__TEST_CASES) else "failed",
    "output": __results,
}

print(json.dumps(summary))
`, sanitized, string(casesJSON))

	return program, nil
}

func buildGoTwoSumProgram(code string, cases []twoSumCase) (string, error) {
	sanitized := sanitizeGoForSubmission(code)
	casesJSON, err := json.Marshal(cases)
	if err != nil {
		return "", err
	}

	program := fmt.Sprintf(`package main

import (
	"encoding/json"
	"os"
	"strings"
)

%s

type __Case struct {
	Nums           []int  `+"`json:\"nums\"`"+`
	Target         int    `+"`json:\"target\"`"+`
	ExpectedOutput string `+"`json:\"expectedOutput\"`"+`
}

type __Summary struct {
	PassedTests int      `+"`json:\"passedTests\"`"+`
	TotalTests  int      `+"`json:\"totalTests\"`"+`
	Status      string   `+"`json:\"status\"`"+`
	Output      []string `+"`json:\"output\"`"+`
}

func __normalizeIntSlice(value []int) string {
	bytes, _ := json.Marshal(value)
	return strings.TrimSpace(string(bytes))
}

func main() {
	var cases []__Case
	_ = json.Unmarshal([]byte(%q), &cases)

	results := make([]string, 0, len(cases))
	passed := 0

	for _, tc := range cases {
		result := solve(tc.Nums, tc.Target)
		normalized := __normalizeIntSlice(result)
		if normalized == tc.ExpectedOutput {
			passed++
			results = append(results, "Test passed")
		} else {
			results = append(results, "Expected "+tc.ExpectedOutput+" but received "+normalized)
		}
	}

	summary := __Summary{
		PassedTests: passed,
		TotalTests:  len(cases),
		Status:      "failed",
		Output:      results,
	}

	if passed == len(cases) {
		summary.Status = "accepted"
	}

	encoder := json.NewEncoder(os.Stdout)
	encoder.SetEscapeHTML(false)
	_ = encoder.Encode(summary)
}
`, sanitized, string(casesJSON))

	return program, nil
}

func buildJavaScriptStringChallengeProgram(code string, cases []stringCase, functionName string) (string, error) {
	sanitized := sanitizeJavaScriptForSubmission(code)
	casesJSON, err := json.Marshal(cases)
	if err != nil {
		return "", err
	}

	program := fmt.Sprintf(`%s

const __TEST_CASES = %s;

function __normalize(value) {
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === null || value === undefined) return String(value).trim();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).trim();
}

const __results = [];
let __passed = 0;

for (const tc of __TEST_CASES) {
  try {
    const result = %s(tc.input);
    const normalized = __normalize(result);
    const passed = normalized === tc.expectedOutput;

    if (passed) __passed += 1;

    __results.push(
      passed
        ? "Test passed"
        : "Expected " + tc.expectedOutput + " but received " + normalized
    );
  } catch (error) {
    __results.push("Runtime error: " + String(error));
  }
}

const __summary = {
  passedTests: __passed,
  totalTests: __TEST_CASES.length,
  status: __passed === __TEST_CASES.length ? "accepted" : "failed",
  output: __results
};

process.stdout.write(JSON.stringify(__summary));
`, sanitized, string(casesJSON), functionName)

	return program, nil
}

func buildPythonStringChallengeProgram(code string, cases []stringCase) (string, error) {
	sanitized := sanitizePythonForSubmission(code)
	casesJSON, err := json.Marshal(cases)
	if err != nil {
		return "", err
	}

	program := fmt.Sprintf(`import json
import io
import contextlib

%s

__TEST_CASES = json.loads(r'''%s''')

def __normalize(value):
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (list, dict)):
        return json.dumps(value, separators=(",", ":"))
    if value is None:
        return "null"
    return str(value).strip()

__results = []
__passed = 0

for tc in __TEST_CASES:
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            result = solve(tc["input"])
        normalized = __normalize(result)
        passed = normalized == tc["expectedOutput"]
        if passed:
            __passed += 1
            __results.append("Test passed")
        else:
            __results.append(f'Expected {tc["expectedOutput"]} but received {normalized}')
    except Exception as error:
        __results.append(f"Runtime error: {error}")

summary = {
    "passedTests": __passed,
    "totalTests": len(__TEST_CASES),
    "status": "accepted" if __passed == len(__TEST_CASES) else "failed",
    "output": __results,
}

print(json.dumps(summary))
`, sanitized, string(casesJSON))

	return program, nil
}

func buildGoValidParenthesesProgram(code string, cases []stringCase) (string, error) {
	sanitized := sanitizeGoForSubmission(code)
	casesJSON, err := json.Marshal(cases)
	if err != nil {
		return "", err
	}

	program := fmt.Sprintf(`package main

import (
	"encoding/json"
	"os"
	"strings"
)

%s

type __Case struct {
	Input          string `+"`json:\"input\"`"+`
	ExpectedOutput string `+"`json:\"expectedOutput\"`"+`
}

type __Summary struct {
	PassedTests int      `+"`json:\"passedTests\"`"+`
	TotalTests  int      `+"`json:\"totalTests\"`"+`
	Status      string   `+"`json:\"status\"`"+`
	Output      []string `+"`json:\"output\"`"+`
}

func __normalizeBool(value bool) string {
	if value {
		return "true"
	}
	return "false"
}

func main() {
	var cases []__Case
	_ = json.Unmarshal([]byte(%q), &cases)

	results := make([]string, 0, len(cases))
	passed := 0

	for _, tc := range cases {
		result := solve(tc.Input)
		normalized := strings.TrimSpace(__normalizeBool(result))
		if normalized == tc.ExpectedOutput {
			passed++
			results = append(results, "Test passed")
		} else {
			results = append(results, "Expected "+tc.ExpectedOutput+" but received "+normalized)
		}
	}

	summary := __Summary{
		PassedTests: passed,
		TotalTests:  len(cases),
		Status:      "failed",
		Output:      results,
	}

	if passed == len(cases) {
		summary.Status = "accepted"
	}

	encoder := json.NewEncoder(os.Stdout)
	encoder.SetEscapeHTML(false)
	_ = encoder.Encode(summary)
}
`, sanitized, string(casesJSON))

	return program, nil
}

func buildGoLongestSubstringProgram(code string, cases []stringCase) (string, error) {
	sanitized := sanitizeGoForSubmission(code)
	casesJSON, err := json.Marshal(cases)
	if err != nil {
		return "", err
	}

	program := fmt.Sprintf(`package main

import (
	"encoding/json"
	"os"
	"strconv"
	"strings"
)

%s

type __Case struct {
	Input          string `+"`json:\"input\"`"+`
	ExpectedOutput string `+"`json:\"expectedOutput\"`"+`
}

type __Summary struct {
	PassedTests int      `+"`json:\"passedTests\"`"+`
	TotalTests  int      `+"`json:\"totalTests\"`"+`
	Status      string   `+"`json:\"status\"`"+`
	Output      []string `+"`json:\"output\"`"+`
}

func main() {
	var cases []__Case
	_ = json.Unmarshal([]byte(%q), &cases)

	results := make([]string, 0, len(cases))
	passed := 0

	for _, tc := range cases {
		result := solve(tc.Input)
		normalized := strings.TrimSpace(strconv.Itoa(result))
		if normalized == tc.ExpectedOutput {
			passed++
			results = append(results, "Test passed")
		} else {
			results = append(results, "Expected "+tc.ExpectedOutput+" but received "+normalized)
		}
	}

	summary := __Summary{
		PassedTests: passed,
		TotalTests:  len(cases),
		Status:      "failed",
		Output:      results,
	}

	if passed == len(cases) {
		summary.Status = "accepted"
	}

	encoder := json.NewEncoder(os.Stdout)
	encoder.SetEscapeHTML(false)
	_ = encoder.Encode(summary)
}
`, sanitized, string(casesJSON))

	return program, nil
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