package controllers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type RunRequest struct {
	ChallengeID int    `json:"challenge_id"`
	Language    string `json:"language"`
	Code        string `json:"code"`
}

type RunResponse struct {
	Success       bool     `json:"success"`
	Status        string   `json:"status"`
	Output        []string `json:"output"`
	ExecutionTime string   `json:"executionTime,omitempty"`
	Error         string   `json:"error,omitempty"`
}

// RunCode handles code execution request
func RunCode(c *gin.Context) {
	var req RunRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, RunResponse{
			Success: false,
			Status:  "failed",
			Output:  []string{},
			Error:   "Invalid run request payload.",
		})
		return
	}

	req.Language = strings.ToLower(strings.TrimSpace(req.Language))
	req.Code = strings.TrimSpace(req.Code)

	if req.Code == "" {
		c.JSON(http.StatusBadRequest, RunResponse{
			Success: false,
			Status:  "failed",
			Output:  []string{},
			Error:   "Code cannot be empty.",
		})
		return
	}

	started := time.Now()

	output, err := executeUserCode(req.Language, req.Code)
	if err != nil {
		c.JSON(http.StatusOK, RunResponse{
			Success:       false,
			Status:        "failed",
			Output:        splitOutput(err.Error()),
			ExecutionTime: time.Since(started).String(),
			Error:         "Execution failed.",
		})
		return
	}

	c.JSON(http.StatusOK, RunResponse{
		Success:       true,
		Status:        "completed",
		Output:        splitOutput(output),
		ExecutionTime: time.Since(started).String(),
	})
}

func executeUserCode(language string, code string) (string, error) {
	tempDir, err := os.MkdirTemp("", "codemaster-run-*")
	if err != nil {
		return "", fmt.Errorf("failed to create temp directory: %w", err)
	}
	defer os.RemoveAll(tempDir)

	var (
		filename string
		command  *exec.Cmd
	)

	switch language {
	case "javascript", "js":
		filename = "solution.js"
		if err := os.WriteFile(filepath.Join(tempDir, filename), []byte(code), 0644); err != nil {
			return "", err
		}
		command = exec.Command("node", filename)
	case "python", "py":
		filename = "solution.py"
		if err := os.WriteFile(filepath.Join(tempDir, filename), []byte(code), 0644); err != nil {
			return "", err
		}
		command = exec.Command("python", filename)
	case "go", "golang":
		filename = "solution.go"
		// Wrap code in package main if needed
		goCode := code
		if !strings.Contains(code, "package main") {
			goCode = "package main\n\nimport \"fmt\"\n\nfunc main() {\n" + code + "\n}"
		}
		if err := os.WriteFile(filepath.Join(tempDir, filename), []byte(goCode), 0644); err != nil {
			return "", err
		}
		command = exec.Command("go", "run", filename)
	default:
		return "", fmt.Errorf("unsupported language: %s", language)
	}

	command.Dir = tempDir
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	output, err := command.CombinedOutput()
	if ctx.Err() == context.DeadlineExceeded {
		return "", fmt.Errorf("Execution timed out (5s limit)")
	}

	return string(output), err
}

func splitOutput(output string) []string {
	lines := strings.Split(strings.TrimSpace(output), "\n")
	result := []string{}
	for _, line := range lines {
		if strings.TrimSpace(line) != "" {
			result = append(result, line)
		}
	}
	return result
}
