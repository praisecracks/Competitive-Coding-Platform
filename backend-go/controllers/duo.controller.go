package controllers

import (
	"context"
	"net/http"
	"time"

	"codingplatform/database"
	"codingplatform/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// DuoInviteRequest represents an invitation to a duel
type DuoInviteRequest struct {
	ChallengeID int    `json:"challenge_id" binding:"required"`
	OpponentID  string `json:"opponent_id" binding:"required"`
}

// GetPendingInvites returns all pending duel invitations for the current user
func GetPendingInvites(c *gin.Context) {
	userIDRaw, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDRaw.(string)

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	duelsCollection := database.GetCollection("duels")
	usersCollection := database.GetCollection("users")
	challengesCollection := database.GetCollection("challenges")

	filter := bson.M{
		"opponent_id": userID,
		"status":      models.DuelPending,
		"expires_at":  bson.M{"$gt": time.Now()},
	}

	cursor, err := duelsCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invitations"})
		return
	}
	defer cursor.Close(ctx)

	var duels []models.Duel
	_ = cursor.All(ctx, &duels)

	type InviteResponse struct {
		ID             string    `json:"id"`
		ChallengerID   string    `json:"challenger_id"`
		ChallengerName string    `json:"challenger_name"`
		ChallengeID    int       `json:"challenge_id"`
		ChallengeTitle string    `json:"challenge_title"`
		CreatedAt      time.Time `json:"created_at"`
	}

	response := []InviteResponse{}
	for _, duel := range duels {
		var challenger models.User
		objID, _ := primitive.ObjectIDFromHex(duel.Challenger)
		_ = usersCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&challenger)

		var challenge models.Challenge
		_ = challengesCollection.FindOne(ctx, bson.M{"id": duel.ChallengeID}).Decode(&challenge)

		response = append(response, InviteResponse{
			ID:             duel.ID,
			ChallengerID:   duel.Challenger,
			ChallengerName: challenger.Username,
			ChallengeID:    duel.ChallengeID,
			ChallengeTitle: challenge.Title,
			CreatedAt:      duel.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, response)
}

// SendDuelInvite sends an invitation to a duel
func SendDuelInvite(c *gin.Context) {
	userIDRaw, _ := c.Get("user_id")
	userID := userIDRaw.(string)

	var req DuoInviteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if userID == req.OpponentID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot challenge yourself"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	duelsCollection := database.GetCollection("duels")

	duel := models.Duel{
		ID:          uuid.New().String(),
		Challenger:  userID,
		Opponent:    req.OpponentID,
		ChallengeID: req.ChallengeID,
		Status:      models.DuelPending,
		CreatedAt:   time.Now(),
		ExpiresAt:   time.Now().Add(10 * time.Minute),
	}

	_, err := duelsCollection.InsertOne(ctx, duel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send invitation"})
		return
	}

	c.JSON(http.StatusCreated, duel)
}

// GetDuelStatus returns the status of a duel
func GetDuelStatus(c *gin.Context) {
	duelID := c.Param("duel_id")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	duelsCollection := database.GetCollection("duels")
	var duel models.Duel
	err := duelsCollection.FindOne(ctx, bson.M{"_id": duelID}).Decode(&duel)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Duel not found"})
		return
	}

	c.JSON(http.StatusOK, duel)
}

// AcceptDuelInvite accepts a duel invitation
func AcceptDuelInvite(c *gin.Context) {
	duelID := c.Param("duel_id")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	duelsCollection := database.GetCollection("duels")
	_, err := duelsCollection.UpdateOne(ctx, bson.M{"_id": duelID}, bson.M{
		"$set": bson.M{"status": models.DuelAccepted, "accepted_at": time.Now()},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to accept invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invitation accepted"})
}

// DeclineDuelInvite declines a duel invitation
func DeclineDuelInvite(c *gin.Context) {
	duelID := c.Param("duel_id")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	duelsCollection := database.GetCollection("duels")
	_, err := duelsCollection.UpdateOne(ctx, bson.M{"_id": duelID}, bson.M{
		"$set": bson.M{"status": models.DuelDeclined},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decline invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invitation declined"})
}

// SubmitDuel handles submission for a duel
func SubmitDuel(c *gin.Context) {
	duelID := c.Param("duel_id")
	userIDRaw, _ := c.Get("user_id")
	userID := userIDRaw.(string)

	var req struct {
		Score int `json:"score"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	duelsCollection := database.GetCollection("duels")
	var duel models.Duel
	err := duelsCollection.FindOne(ctx, bson.M{"_id": duelID}).Decode(&duel)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Duel not found"})
		return
	}

	update := bson.M{}
	if duel.Challenger == userID {
		update["challenger_score"] = req.Score
	} else if duel.Opponent == userID {
		update["opponent_score"] = req.Score
	} else {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not a participant"})
		return
	}

	_, err = duelsCollection.UpdateOne(ctx, bson.M{"_id": duelID}, bson.M{"$set": update})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit score"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Score submitted"})
}
