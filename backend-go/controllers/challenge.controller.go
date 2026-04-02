package controllers

import (
	"context"
	"errors"
	"net/http"
	"sort"
	"strconv"
	"time"

	"codingplatform/database"
	"codingplatform/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// GetChallenges returns all challenges
func GetChallenges(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	challengesCollection := database.GetCollection("challenges")
	challenges := []models.Challenge{}

	cursor, err := challengesCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DATABASE_FETCH_ERROR"})
		return
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &challenges); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "CURSOR_PARSE_ERROR"})
		return
	}

	sort.Slice(challenges, func(i, j int) bool {
		return challenges[i].ID < challenges[j].ID
	})

	c.JSON(http.StatusOK, challenges)
}

// GetChallengeByID returns a single challenge by its ID
func GetChallengeByID(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_CHALLENGE_ID"})
		return
	}

	challengesCollection := database.GetCollection("challenges")
	var challenge models.Challenge
	err = challengesCollection.FindOne(ctx, bson.M{"id": id}).Decode(&challenge)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{"error": "CHALLENGE_NOT_FOUND"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "CHALLENGE_FETCH_FAILED"})
		return
	}

	c.JSON(http.StatusOK, challenge)
}

// GetAdminChallenges returns all challenges for admin (similar to GetChallenges)
func GetAdminChallenges(c *gin.Context) {
	GetChallenges(c)
}

// CreateChallenge creates a new challenge
func CreateChallenge(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	var input models.Challenge
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_INPUT"})
		return
	}

	challengesCollection := database.GetCollection("challenges")
	count, _ := challengesCollection.CountDocuments(ctx, bson.M{})
	input.ID = int(count) + 1

	_, err := challengesCollection.InsertOne(ctx, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "CREATE_CHALLENGE_FAILED"})
		return
	}

	c.JSON(http.StatusCreated, input)
}

// UpdateChallenge updates an existing challenge
func UpdateChallenge(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_CHALLENGE_ID"})
		return
	}

	var input models.Challenge
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_INPUT"})
		return
	}

	input.ID = id
	challengesCollection := database.GetCollection("challenges")
	_, err = challengesCollection.ReplaceOne(ctx, bson.M{"id": id}, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UPDATE_CHALLENGE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, input)
}

// DeleteChallenge deletes a challenge
func DeleteChallenge(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_CHALLENGE_ID"})
		return
	}

	challengesCollection := database.GetCollection("challenges")
	_, err = challengesCollection.DeleteOne(ctx, bson.M{"id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DELETE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "CHALLENGE_DELETED"})
}
