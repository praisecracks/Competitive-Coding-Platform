package controllers

import (
	"context"
	"net/http"
	"time"

	"codingplatform/database"
	"codingplatform/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func SubmitReport(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UNAUTHORIZED"})
		return
	}

	var input struct {
		Type           string `json:"type" bson:"type"`
		TargetID       int64  `json:"targetId" bson:"target_id"`
		TargetUsername string `json:"targetUsername" bson:"target_username"`
		Reason         string `json:"reason" bson:"reason"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_PAYLOAD"})
		return
	}

	if input.Type == "" || (input.TargetID == 0 && input.TargetUsername == "") || input.Reason == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "MISSING_REQUIRED_FIELDS"})
		return
	}

	validTypes := map[string]bool{
		"challenge":  true,
		"user":       true,
		"submission": true,
	}

	if !validTypes[input.Type] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_REPORT_TYPE"})
		return
	}

	report := models.Report{
		ID:             primitive.NewObjectID(),
		UserID:         userID,
		Type:           input.Type,
		TargetID:       input.TargetID,
		TargetUsername: input.TargetUsername,
		Reason:         input.Reason,
		Status:         "pending",
		CreatedAt:      time.Now().UTC(),
	}

	reportsCollection := database.GetCollection("reports")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := reportsCollection.InsertOne(ctx, report)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "REPORT_SUBMISSION_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "REPORT_SUBMITTED"})
}

func GetReports(c *gin.Context) {
	status := c.Query("status")

	filter := bson.M{}
	if status != "" && status != "all" {
		filter["status"] = status
	}

	reportsCollection := database.GetCollection("reports")
	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := reportsCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FETCH_FAILED"})
		return
	}
	defer cursor.Close(ctx)

	var reports []models.Report
	if err := cursor.All(ctx, &reports); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PARSE_FAILED"})
		return
	}

	for i := range reports {
		var reporter models.User
		err := usersCollection.FindOne(ctx, bson.M{"_id": reports[i].UserID}).Decode(&reporter)
		if err == nil {
			reports[i].ReporterUsername = reporter.Username
			reports[i].ReporterProfilePic = reporter.ProfilePic
		}

		if reports[i].Type == "user" && reports[i].TargetUsername != "" {
			var target models.User
			err := usersCollection.FindOne(ctx, bson.M{"username": reports[i].TargetUsername}).Decode(&target)
			if err == nil {
				reports[i].TargetProfilePic = target.ProfilePic
			}
		}
	}

	c.JSON(http.StatusOK, reports)
}

func ResolveReport(c *gin.Context) {
	_, ok := getUserID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "UNAUTHORIZED"})
		return
	}

	reportID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(reportID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_REPORT_ID"})
		return
	}

	var input struct {
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_PAYLOAD"})
		return
	}

	if input.Status != "resolved" && input.Status != "dismissed" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_STATUS"})
		return
	}

	reportsCollection := database.GetCollection("reports")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"status":      input.Status,
			"resolved_at": time.Now().UTC(),
		},
	}

	_, err = reportsCollection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UPDATE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "REPORT_UPDATED"})
}
