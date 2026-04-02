package controllers

import (
	"context"
	"net/http"
	"time"
	"fmt"

	"codingplatform/database"
	"codingplatform/services"

	"github.com/gin-gonic/gin"
)

// GetLeaderboard returns the leaderboard entries
func GetLeaderboard(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 15*time.Second)
	defer cancel()

	usersCollection := database.GetCollection("users")
	submissionsCollection := database.GetCollection("submissions")
	challengesCollection := database.GetCollection("challenges")

	entries, err := services.BuildLeaderboard(
		ctx,
		usersCollection,
		submissionsCollection,
		challengesCollection,
	)
	if err != nil {
		fmt.Printf(">>> ERROR: Leaderboard build failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "LEADERBOARD_FETCH_FAILED",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"entries": entries,
		"total":   len(entries),
	})
}
