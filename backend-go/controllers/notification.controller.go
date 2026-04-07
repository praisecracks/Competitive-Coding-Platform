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

// GetNotifications returns all notifications for the authenticated user
func GetNotifications(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	// ✅ SAFE USER EXTRACTION (NO PANIC)
	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "AUTH_REQUIRED"})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "INVALID_USER_CONTEXT"})
		return
	}

	notificationsCollection := database.GetCollection("notifications")

	opts := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}).
		SetLimit(50)

	cursor, err := notificationsCollection.Find(ctx, bson.M{"user_id": userID}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FETCH_FAILED"})
		return
	}
	defer cursor.Close(ctx)

	notifications := make([]models.Notification, 0)

	// ✅ HANDLE ERROR PROPERLY (THIS WAS MISSING)
	if err := cursor.All(ctx, &notifications); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PARSE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

// MarkNotificationRead marks a notification as read
func MarkNotificationRead(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	// ✅ SAFE USER EXTRACTION
	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "AUTH_REQUIRED"})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "INVALID_USER_CONTEXT"})
		return
	}

	notificationIDStr := c.Param("id")

	notificationID, err := primitive.ObjectIDFromHex(notificationIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_NOTIFICATION_ID"})
		return
	}

	notificationsCollection := database.GetCollection("notifications")

	res, err := notificationsCollection.UpdateOne(
		ctx,
		bson.M{
			"_id":     notificationID,
			"user_id": userID,
		},
		bson.M{
			"$set": bson.M{"read": true},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UPDATE_FAILED"})
		return
	}

	// ✅ OPTIONAL: check if anything was actually updated
	if res.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "NOTIFICATION_NOT_FOUND"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification marked as read"})
}
