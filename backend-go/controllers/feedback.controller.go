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
	"go.mongodb.org/mongo-driver/mongo/options"
)

func SubmitFeedback(c *gin.Context) {
	var feedback models.Feedback

	if err := c.ShouldBindJSON(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, err := primitive.ObjectIDFromHex(c.GetString("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Get user info for username and profile pic
	var user models.User
	err = database.UserCollection.FindOne(context.Background(), bson.M{"_id": userID}).Decode(&user)
	if err == nil {
		feedback.Username = user.Username
		feedback.ProfilePic = user.ProfilePic
	}

	feedback.UserID = userID
	feedback.ID = primitive.NewObjectID()
	feedback.CreatedAt = time.Now()

	_, err = database.FeedbackCollection.InsertOne(context.Background(), feedback)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit feedback"})
		return
	}

	// Create notification for admin users
	notificationsCollection := database.GetCollection("notifications")
	notification := models.Notification{
		ID:        primitive.NewObjectID(),
		UserID:    "admin",
		Type:      models.NotificationSystem,
		Title:     "New Feedback Received",
		Message:   "User " + feedback.Username + " submitted new feedback",
		Read:      false,
		CreatedAt: time.Now(),
	}
	_, _ = notificationsCollection.InsertOne(context.Background(), notification)

	c.JSON(http.StatusOK, gin.H{"message": "Feedback submitted successfully"})
}

func GetFeedback(c *gin.Context) {
	feedbackList := []models.Feedback{}

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := database.FeedbackCollection.Find(context.Background(), bson.M{}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch feedback"})
		return
	}

	if err := cursor.All(context.Background(), &feedbackList); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode feedback"})
		return
	}

	c.JSON(http.StatusOK, feedbackList)
}

func DeleteFeedback(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	_, err = database.FeedbackCollection.DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete feedback"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Feedback deleted successfully"})
}
