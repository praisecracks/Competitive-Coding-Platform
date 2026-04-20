// backend-go/controllers/learning.controller.go
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

// GetLearningProgress - GET /learning/progress
func GetLearningProgress(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_USER_ID"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	var progress models.LearningProgress
	err = database.LearningProgressCollection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&progress)
	if err != nil {
		// If not found, return empty progress
		if err.Error() == "mongo: no documents in result" {
			c.JSON(http.StatusOK, models.LearningProgress{
				UserID:         userID,
				TrackProgress:  make(map[string]models.TrackProgress),
				LegacyProgress: make(map[string]models.LegacyPathProgress),
				Streak:         models.StreakData{},
				Journal:        []models.JournalEntry{},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DATABASE_ERROR"})
		return
	}

	c.JSON(http.StatusOK, progress)
}

// UpdateTrackProgress - PUT /learning/track-progress
func UpdateTrackProgress(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_USER_ID"})
		return
	}

	var request struct {
		TrackID  string               `json:"trackId"`
		Progress models.TrackProgress `json:"progress"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_REQUEST_BODY"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	// Update only the specific track progress
	update := bson.M{
		"$set": bson.M{
			"track_progress." + request.TrackID: request.Progress,
			"updated_at":                        time.Now().UTC(),
		},
		"$setOnInsert": bson.M{
			"user_id":         userID,
			"created_at":      time.Now().UTC(),
			"streak":          models.StreakData{},
			"journal":         []models.JournalEntry{},
			"legacy_progress": map[string]models.LegacyPathProgress{},
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err = database.LearningProgressCollection.UpdateOne(ctx, bson.M{"user_id": userID}, update, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UPDATE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// UpdateStreak - POST /learning/streak
func UpdateStreak(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_USER_ID"})
		return
	}

	var request struct {
		CompletedLesson bool `json:"completedLesson"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_REQUEST_BODY"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	// Get current progress
	var progress models.LearningProgress
	err = database.LearningProgressCollection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&progress)
	if err != nil && err.Error() != "mongo: no documents in result" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DATABASE_ERROR"})
		return
	}

	now := time.Now().UTC()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)

	streak := progress.Streak
	if streak.CurrentStreak == 0 {
		streak.CurrentStreak = 1
		streak.LongestStreak = 1
		streak.LastLearningDate = today
	} else {
		lastDate := time.Date(streak.LastLearningDate.Year(), streak.LastLearningDate.Month(), streak.LastLearningDate.Day(), 0, 0, 0, 0, time.UTC)
		daysSinceLastLearning := int(today.Sub(lastDate).Hours() / 24)

		if daysSinceLastLearning == 0 {
			// Same day, don't update streak
		} else if daysSinceLastLearning == 1 {
			// Consecutive day
			streak.CurrentStreak++
			if streak.CurrentStreak > streak.LongestStreak {
				streak.LongestStreak = streak.CurrentStreak
			}
			streak.LastLearningDate = today
		} else {
			// Streak broken, start new
			streak.CurrentStreak = 1
			streak.LastLearningDate = today
		}
	}

	// Update streak in database
	update := bson.M{
		"$set": bson.M{
			"streak":     streak,
			"updated_at": time.Now().UTC(),
		},
		"$setOnInsert": bson.M{
			"user_id":         userID,
			"created_at":      time.Now().UTC(),
			"track_progress":  map[string]models.TrackProgress{},
			"journal":         []models.JournalEntry{},
			"legacy_progress": map[string]models.LegacyPathProgress{},
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err = database.LearningProgressCollection.UpdateOne(ctx, bson.M{"user_id": userID}, update, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UPDATE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, streak)
}

// AddJournalEntry - POST /learning/journal
func AddJournalEntry(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_USER_ID"})
		return
	}

	var entry models.JournalEntry
	if err := c.ShouldBindJSON(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_REQUEST_BODY"})
		return
	}

	entry.ID = primitive.NewObjectID().Hex()
	entry.CompletedAt = time.Now().UTC()

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	// Add entry to journal array
	update := bson.M{
		"$push": bson.M{
			"journal": entry,
		},
		"$set": bson.M{
			"updated_at": time.Now().UTC(),
		},
		"$setOnInsert": bson.M{
			"user_id":         userID,
			"created_at":      time.Now().UTC(),
			"track_progress":  map[string]models.TrackProgress{},
			"streak":          models.StreakData{},
			"legacy_progress": map[string]models.LegacyPathProgress{},
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err = database.LearningProgressCollection.UpdateOne(ctx, bson.M{"user_id": userID}, update, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UPDATE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, entry)
}

// DeleteJournalEntry - DELETE /learning/journal/:id
func DeleteJournalEntry(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_USER_ID"})
		return
	}

	entryID := c.Param("id")

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	// Remove entry from journal array
	update := bson.M{
		"$pull": bson.M{
			"journal": bson.M{"id": entryID},
		},
		"$set": bson.M{
			"updated_at": time.Now().UTC(),
		},
	}

	_, err = database.LearningProgressCollection.UpdateOne(ctx, bson.M{"user_id": userID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DELETE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// UpdateLegacyProgress - PUT /learning/legacy-progress
func UpdateLegacyProgress(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_USER_ID"})
		return
	}

	var request struct {
		PathID   string                    `json:"pathId"`
		Progress models.LegacyPathProgress `json:"progress"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_REQUEST_BODY"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"legacy_progress." + request.PathID: request.Progress,
			"updated_at":                        time.Now().UTC(),
		},
		"$setOnInsert": bson.M{
			"user_id":        userID,
			"created_at":     time.Now().UTC(),
			"track_progress": map[string]models.TrackProgress{},
			"streak":         models.StreakData{},
			"journal":        []models.JournalEntry{},
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err = database.LearningProgressCollection.UpdateOne(ctx, bson.M{"user_id": userID}, update, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UPDATE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}
