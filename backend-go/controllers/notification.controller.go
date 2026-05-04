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

// SystemUserID is the fixed user ID for system notifications
const SystemUserID = "admin"

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

// GetSystemNotifications returns system notifications for admin users
func GetSystemNotifications(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	notificationsCollection := database.GetCollection("notifications")

	opts := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}).
		SetLimit(20)

	// Get notifications with user_id = SystemUserID (system notifications)
	cursor, err := notificationsCollection.Find(ctx, bson.M{"user_id": SystemUserID}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FETCH_FAILED"})
		return
	}
	defer cursor.Close(ctx)

	notifications := make([]models.Notification, 0)
	if err := cursor.All(ctx, &notifications); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PARSE_FAILED"})
		return
	}

	// Mark all fetched system notifications as read — REMOVED per UX fix
	// for _, n := range notifications {
	// 	notificationsCollection.UpdateOne(ctx, bson.M{"_id": n.ID}, bson.M{"$set": bson.M{"read": true}})
	// }

	c.JSON(http.StatusOK, notifications)
}

// NotificationDismissal represents a user's dismissal of a notification
type NotificationDismissal struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserID         string             `json:"user_id" bson:"user_id"`
	NotificationID string             `json:"notification_id" bson:"notification_id"`
	DismissedAt    time.Time          `json:"dismissed_at" bson:"dismissed_at"`
}

// GetDismissedNotifications returns list of dismissed notification IDs for the authenticated user
func GetDismissedNotifications(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

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

	cursor, err := database.NotificationDismissalsCollection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FETCH_FAILED"})
		return
	}
	defer cursor.Close(ctx)

	var dismissals []NotificationDismissal
	if err := cursor.All(ctx, &dismissals); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PARSE_FAILED"})
		return
	}

	ids := make([]string, len(dismissals))
	for i, d := range dismissals {
		ids[i] = d.NotificationID
	}

	c.JSON(http.StatusOK, ids)
}

// DismissNotification records that a user dismissed a notification (idempotent)
func DismissNotification(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

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

	notificationID := c.Param("id")
	if notificationID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "MISSING_NOTIFICATION_ID"})
		return
	}

	// Upsert: create dismissal if not exists; no-op if already exists
	_, err := database.NotificationDismissalsCollection.UpdateOne(
		ctx,
		bson.M{
			"user_id":         userID,
			"notification_id": notificationID,
		},
		bson.M{
			"$set": bson.M{
				"dismissed_at": time.Now().UTC(),
			},
		},
		options.Update().SetUpsert(true),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DISMISS_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notification dismissed"})
}
