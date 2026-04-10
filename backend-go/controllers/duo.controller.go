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

	_, _ = duelsCollection.UpdateMany(
		ctx,
		bson.M{
			"status":     models.DuelPending,
			"expires_at": bson.M{"$lte": time.Now().UTC()},
		},
		bson.M{
			"$set": bson.M{"status": models.DuelExpired},
		},
	)

	filter := bson.M{
		"opponent_id": userID,
		"status":      models.DuelPending,
		"expires_at":  bson.M{"$gt": time.Now().UTC()},
	}

	cursor, err := duelsCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invitations"})
		return
	}
	defer cursor.Close(ctx)

	var duels []models.Duel
	if err := cursor.All(ctx, &duels); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse invitations", "details": err.Error()})
		return
	}

	type InviteResponse struct {
		ID             string    `json:"id"`
		ChallengerID   string    `json:"challenger_id"`
		ChallengerName string    `json:"challenger_name"`
		ChallengeID    int       `json:"challenge_id"`
		ChallengeTitle string    `json:"challenge_title"`
		CreatedAt      time.Time `json:"created_at"`
		ExpiresAt      time.Time `json:"expires_at"`
	}

	response := []InviteResponse{}
	for _, duel := range duels {
		var challenger models.User

		objID, err := primitive.ObjectIDFromHex(duel.Challenger)
		if err == nil {
			_ = usersCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&challenger)
		} else {
			_ = usersCollection.FindOne(ctx, bson.M{"_id": duel.Challenger}).Decode(&challenger)
		}

		var challenge models.Challenge
		_ = challengesCollection.FindOne(ctx, bson.M{"id": duel.ChallengeID}).Decode(&challenge)

		response = append(response, InviteResponse{
			ID:             duel.ID,
			ChallengerID:   duel.Challenger,
			ChallengerName: challenger.Username,
			ChallengeID:    duel.ChallengeID,
			ChallengeTitle: challenge.Title,
			CreatedAt:      duel.CreatedAt,
			ExpiresAt:      duel.ExpiresAt,
		})
	}

	c.JSON(http.StatusOK, response)
}

// SendDuelInvite sends an invitation to a duel
func SendDuelInvite(c *gin.Context) {
	userIDRaw, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
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

	var existing models.Duel
	err := duelsCollection.FindOne(ctx, bson.M{
		"challenger_id": userID,
		"opponent_id":   req.OpponentID,
		"challenge_id":  req.ChallengeID,
		"status":        models.DuelPending,
		"expires_at":    bson.M{"$gt": time.Now().UTC()},
	}).Decode(&existing)

	if err == nil {
		c.JSON(http.StatusOK, gin.H{
			"id":           existing.ID,
			"duel_id":      existing.ID,
			"challenge_id": existing.ChallengeID,
			"status":       existing.Status,
			"expires_at":   existing.ExpiresAt,
			"created_at":   existing.CreatedAt,
		})
		return
	}

	duel := models.Duel{
		ID:                  uuid.New().String(),
		Challenger:          userID,
		Opponent:            req.OpponentID,
		ChallengeID:         req.ChallengeID,
		Status:              models.DuelPending,
		CreatedAt:           time.Now().UTC(),
		ExpiresAt:           time.Now().UTC().Add(2 * time.Minute),
		ChallengerSubmitted: false,
		OpponentSubmitted:   false,
		ChallengerScore:     0,
		OpponentScore:       0,
	}

	_, err = duelsCollection.InsertOne(ctx, duel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send invitation"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":           duel.ID,
		"duel_id":      duel.ID,
		"challenge_id": duel.ChallengeID,
		"status":       duel.Status,
		"created_at":   duel.CreatedAt,
		"expires_at":   duel.ExpiresAt,
	})
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

	if duel.Status == models.DuelPending && duel.ExpiresAt.Before(time.Now().UTC()) {
		_, _ = duelsCollection.UpdateOne(
			ctx,
			bson.M{"_id": duelID, "status": models.DuelPending},
			bson.M{"$set": bson.M{"status": models.DuelExpired}},
		)
		duel.Status = models.DuelExpired
	}

	c.JSON(http.StatusOK, gin.H{
		"id":                   duel.ID,
		"challenger_id":        duel.Challenger,
		"opponent_id":          duel.Opponent,
		"challenge_id":         duel.ChallengeID,
		"status":               duel.Status,
		"created_at":           duel.CreatedAt,
		"expires_at":           duel.ExpiresAt,
		"accepted_at":          duel.AcceptedAt,
		"completed_at":         duel.CompletedAt,
		"winner_id":            duel.WinnerID,
		"challenger_submitted": duel.ChallengerSubmitted,
		"opponent_submitted":   duel.OpponentSubmitted,
		"challenger_score":     duel.ChallengerScore,
		"opponent_score":       duel.OpponentScore,
	})
}

// AcceptDuelInvite accepts a duel invitation
func AcceptDuelInvite(c *gin.Context) {
	userIDRaw, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDRaw.(string)

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

	if duel.Opponent != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not allowed to accept this invite"})
		return
	}

	if duel.Status != models.DuelPending {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invite is no longer pending"})
		return
	}

	if duel.ExpiresAt.Before(time.Now().UTC()) {
		_, _ = duelsCollection.UpdateOne(
			ctx,
			bson.M{"_id": duelID, "status": models.DuelPending},
			bson.M{"$set": bson.M{"status": models.DuelExpired}},
		)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invite has expired"})
		return
	}

	acceptedAt := time.Now().UTC()

	result, err := duelsCollection.UpdateOne(
		ctx,
		bson.M{
			"_id":    duelID,
			"status": models.DuelPending,
		},
		bson.M{
			"$set": bson.M{
				"status":      models.DuelAccepted,
				"accepted_at": acceptedAt,
			},
		},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to accept invitation"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invite is no longer pending"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Invitation accepted",
		"duel_id":     duelID,
		"accepted_at": acceptedAt,
		"status":      models.DuelAccepted,
	})
}

// DeclineDuelInvite declines a duel invitation
func DeclineDuelInvite(c *gin.Context) {
	userIDRaw, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDRaw.(string)

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

	if duel.Opponent != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not allowed to decline this invite"})
		return
	}

	result, err := duelsCollection.UpdateOne(
		ctx,
		bson.M{
			"_id":    duelID,
			"status": models.DuelPending,
		},
		bson.M{
			"$set": bson.M{"status": models.DuelDeclined},
		},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decline invitation"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invite is no longer pending"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invitation declined"})
}

// SubmitDuel handles submission for a duel
func SubmitDuel(c *gin.Context) {
	duelID := c.Param("duel_id")
	userIDRaw, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
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

	if duel.Status != models.DuelAccepted {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Duel is not active"})
		return
	}

	update := bson.M{}
	if duel.Challenger == userID {
		update["challenger_score"] = req.Score
		update["challenger_submitted"] = true
		duel.ChallengerScore = req.Score
		duel.ChallengerSubmitted = true
	} else if duel.Opponent == userID {
		update["opponent_score"] = req.Score
		update["opponent_submitted"] = true
		duel.OpponentScore = req.Score
		duel.OpponentSubmitted = true
	} else {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not a participant"})
		return
	}

	if duel.ChallengerSubmitted && duel.OpponentSubmitted {
		completedAt := time.Now().UTC()
		update["status"] = models.DuelCompleted
		update["completed_at"] = completedAt

		if duel.ChallengerScore > duel.OpponentScore {
			update["winner_id"] = duel.Challenger
			duel.WinnerID = duel.Challenger
		} else if duel.OpponentScore > duel.ChallengerScore {
			update["winner_id"] = duel.Opponent
			duel.WinnerID = duel.Opponent
		} else {
			update["winner_id"] = "TIE"
			duel.WinnerID = "TIE"
		}
		duel.Status = models.DuelCompleted
		duel.CompletedAt = &completedAt
	}

	_, err = duelsCollection.UpdateOne(
		ctx,
		bson.M{"_id": duelID},
		bson.M{"$set": update},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit score"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":              "Score submitted",
		"status":               duel.Status,
		"winner_id":            duel.WinnerID,
		"challenger_score":     duel.ChallengerScore,
		"opponent_score":       duel.OpponentScore,
		"challenger_submitted": duel.ChallengerSubmitted,
		"opponent_submitted":   duel.OpponentSubmitted,
	})
}