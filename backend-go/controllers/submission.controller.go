package controllers

import (
	"context"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"codingplatform/database"
	"codingplatform/models"
	"codingplatform/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SubmitRequest struct {
	ChallengeID int                   `json:"challenge_id"`
	Language    string                `json:"language"`
	Code        string                `json:"code"`
	History     []models.HistoryEntry `json:"history"`
}

type EnrichedSubmission struct {
	ID            string    `json:"id"`
	Username      string    `json:"username"`
	ChallengeID   int       `json:"challenge_id"`
	ChallengeName string    `json:"challenge_name"`
	Language      string    `json:"language"`
	Status        string    `json:"status"`
	Score         int       `json:"score"`
	SubmittedAt   time.Time `json:"submitted_at"`
}

type SubmissionMetrics struct {
	TotalSubmissions int     `json:"total_submissions"`
	Accepted         int     `json:"accepted"`
	Passed           int     `json:"passed"`
	Partial          int     `json:"partial"`
	Rejected         int     `json:"rejected"`
	Pending          int     `json:"pending"`
	Errors           int     `json:"errors"`
	AverageScore     float64 `json:"average_score"`
}

type SubmissionsAuditResponse struct {
	Submissions []EnrichedSubmission `json:"submissions"`
	Metrics     SubmissionMetrics    `json:"metrics"`
}

func normalizeSubmissionInput(req *SubmitRequest) {
	req.Language = strings.ToLower(strings.TrimSpace(req.Language))
	req.Code = strings.TrimSpace(req.Code)

	for i := range req.History {
		req.History[i].Time = strings.TrimSpace(req.History[i].Time)
		req.History[i].Line = strings.TrimSpace(req.History[i].Line)
	}
}

func normalizeSubmissionStatus(status string, score int) string {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "accepted":
		return "accepted"
	case "passed":
		return "passed"
	case "partial":
		if score >= 50 {
			return "passed"
		}
		return "partial"
	case "rejected":
		return "rejected"
	case "pending":
		return "pending"
	case "runtime_error":
		return "runtime_error"
	case "compilation_error":
		return "compilation_error"
	case "internal_error":
		return "internal_error"
	default:
		if score == 100 {
			return "accepted"
		}
		if score >= 50 {
			return "passed"
		}
		if score > 0 {
			return "partial"
		}
		return "rejected"
	}
}

// SubmitCode handles code submission
func SubmitCode(c *gin.Context) {
	userIDValue, userIDExists := c.Get("user_id")
	usernameValue, usernameExists := c.Get("username")
	if !userIDExists || !usernameExists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UNAUTHORIZED"})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok || strings.TrimSpace(userID) == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "INVALID_USER_CONTEXT"})
		return
	}

	username, ok := usernameValue.(string)
	if !ok || strings.TrimSpace(username) == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "INVALID_USERNAME_CONTEXT"})
		return
	}

	var req SubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_PAYLOAD"})
		return
	}

	normalizeSubmissionInput(&req)

	if req.ChallengeID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_CHALLENGE_ID"})
		return
	}
	if req.Language == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "LANGUAGE_REQUIRED"})
		return
	}
	if req.Code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CODE_REQUIRED"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second)
	defer cancel()

	challengesCollection := database.GetCollection("challenges")
	var challenge models.Challenge
	err := challengesCollection.FindOne(ctx, bson.M{"id": req.ChallengeID}).Decode(&challenge)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{"error": "CHALLENGE_NOT_FOUND"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "CHALLENGE_FETCH_FAILED"})
		return
	}

	result := services.ExecuteSubmissionAgainstChallenge(req.Language, req.Code, challenge, 5*time.Second)

	score := 0
	if result.TotalTests > 0 {
		score = (result.PassedTests * 100) / result.TotalTests
	}

	normalizedStatus := normalizeSubmissionStatus(result.Status, score)

	submission := models.SubmissionRecord{
		UserID:        userID,
		Username:      username,
		ChallengeID:   req.ChallengeID,
		Language:      req.Language,
		Code:          req.Code,
		Score:         score,
		Status:        normalizedStatus,
		PassedTests:   result.PassedTests,
		TotalTests:    result.TotalTests,
		Output:        result.Output,
		Error:         result.Error,
		ExecutionTime: result.ExecutionTime,
		History:       req.History,
		JudgeVersion:  "v2",
		CreatedAt:     time.Now().UTC(),
	}

	submissionsCollection := database.GetCollection("submissions")
	_, err = submissionsCollection.InsertOne(ctx, submission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SUBMISSION_SAVE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":        normalizedStatus,
		"output":        result.Output,
		"error":         result.Error,
		"passedTests":   result.PassedTests,
		"totalTests":    result.TotalTests,
		"executionTime": result.ExecutionTime,
		"score":         score,
	})
}

// GetSubmissionsAudit returns submissions for admin review
func GetSubmissionsAudit(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	submissionsCollection := database.GetCollection("submissions")
	challengesCollection := database.GetCollection("challenges")

	var submissions []models.SubmissionRecord
	cursor, err := submissionsCollection.Find(
		ctx,
		bson.M{},
		options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(200),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FETCH_SUBMISSIONS_FAILED"})
		return
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &submissions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SUBMISSIONS_PARSE_FAILED"})
		return
	}

	var challenges []models.Challenge
	challengeCursor, err := challengesCollection.Find(ctx, bson.M{})
	if err == nil {
		defer challengeCursor.Close(ctx)
		_ = challengeCursor.All(ctx, &challenges)
	}

	challengeMap := make(map[int]string)
	for _, ch := range challenges {
		challengeMap[ch.ID] = ch.Title
	}

	enrichedSubmissions := make([]EnrichedSubmission, 0, len(submissions))
	metrics := SubmissionMetrics{
		TotalSubmissions: len(submissions),
	}

	totalScore := 0

	for _, sub := range submissions {
		normalizedStatus := normalizeSubmissionStatus(sub.Status, sub.Score)

		enrichedSub := EnrichedSubmission{
			ID:            sub.UserID + "_" + strconv.Itoa(sub.ChallengeID),
			Username:      sub.Username,
			ChallengeID:   sub.ChallengeID,
			ChallengeName: challengeMap[sub.ChallengeID],
			Language:      sub.Language,
			Status:        normalizedStatus,
			Score:         sub.Score,
			SubmittedAt:   sub.CreatedAt,
		}
		enrichedSubmissions = append(enrichedSubmissions, enrichedSub)

		switch normalizedStatus {
		case "accepted":
			metrics.Accepted++
		case "passed":
			metrics.Passed++
		case "partial":
			metrics.Partial++
		case "rejected":
			metrics.Rejected++
		case "pending":
			metrics.Pending++
		case "runtime_error", "compilation_error", "internal_error":
			metrics.Errors++
		}

		totalScore += sub.Score
	}

	if metrics.TotalSubmissions > 0 {
		metrics.AverageScore = float64(totalScore) / float64(metrics.TotalSubmissions)
	}

	c.JSON(http.StatusOK, SubmissionsAuditResponse{
		Submissions: enrichedSubmissions,
		Metrics:     metrics,
	})
}