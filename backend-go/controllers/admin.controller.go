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
	"golang.org/x/crypto/bcrypt"
)

type AdminStatsResponse struct {
	TotalUsers       int     `json:"totalUsers"`
	TotalChallenges  int     `json:"totalChallenges"`
	TotalSubmissions int     `json:"totalSubmissions"`
	RecentSignups    []gin.H `json:"recentSignups"`
}

// GetAdminStats returns stats for the admin dashboard
func GetAdminStats(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	usersCollection := database.GetCollection("users")
	challengesCollection := database.GetCollection("challenges")
	submissionsCollection := database.GetCollection("submissions")

	totalUsers, _ := usersCollection.CountDocuments(ctx, bson.M{})
	totalChallenges, _ := challengesCollection.CountDocuments(ctx, bson.M{})
	totalSubmissions, _ := submissionsCollection.CountDocuments(ctx, bson.M{})

	var recentUsers []models.User
	cursor, _ := usersCollection.Find(ctx, bson.M{}, options.Find().SetLimit(5).SetSort(bson.M{"created_at": -1}))
	if cursor != nil {
		defer cursor.Close(ctx)
		_ = cursor.All(ctx, &recentUsers)
	}

	recentSignups := []gin.H{}
	for _, u := range recentUsers {
		recentSignups = append(recentSignups, gin.H{
			"username":   u.Username,
			"email":      u.Email,
			"role":       u.Role,
			"created_at": u.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, AdminStatsResponse{
		TotalUsers:       int(totalUsers),
		TotalChallenges:  int(totalChallenges),
		TotalSubmissions: int(totalSubmissions),
		RecentSignups:    recentSignups,
	})
}

// GetUsers returns all users for admin review
func GetUsers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	usersCollection := database.GetCollection("users")
	var users []models.User
	cursor, err := usersCollection.Find(ctx, bson.M{}, options.Find().SetSort(bson.M{"created_at": -1}))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FETCH_USERS_FAILED"})
		return
	}
	defer cursor.Close(ctx)
	_ = cursor.All(ctx, &users)

	type UserRegistryResponse struct {
		ID        string    `json:"id"`
		Email     string    `json:"email"`
		Username  string    `json:"username"`
		Role      string    `json:"role"`
		Rank      string    `json:"rank"`
		CreatedAt time.Time `json:"createdAt"`
	}

	var response []UserRegistryResponse
	for _, user := range users {
		response = append(response, UserRegistryResponse{
			ID:        user.ID.Hex(),
			Email:     user.Email,
			Username:  user.Username,
			Role:      user.Role,
			Rank:      user.Rank,
			CreatedAt: user.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, response)
}

// PromoteUser promotes a user to sub_admin
func PromoteUser(c *gin.Context) {
	var input struct {
		UserID string `json:"userId" binding:"required"`
		Role   string `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_INPUT"})
		return
	}

	if input.Role != "sub_admin" && input.Role != "user" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_ROLE"})
		return
	}

	objID, _ := primitive.ObjectIDFromHex(input.UserID)
	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	_, err := usersCollection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": bson.M{"role": input.Role}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PROMOTION_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ROLE_UPDATED"})
}

// SuspendUser suspends or unsuspends a user
func SuspendUser(c *gin.Context) {
	var input struct {
		UserID    string `json:"userId" binding:"required"`
		Suspended bool   `json:"suspended"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_INPUT"})
		return
	}

	objID, _ := primitive.ObjectIDFromHex(input.UserID)
	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	_, err := usersCollection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": bson.M{"is_suspended": input.Suspended}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SUSPENSION_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "STATUS_UPDATED"})
}

// CreateAdmin creates a new admin user
func CreateAdmin(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required"`
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required,min=8"`
		Role     string `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_INPUT"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	now := time.Now().UTC()

	user := models.User{
		Email:     input.Email,
		Username:  input.Username,
		Password:  string(hashedPassword),
		Role:      input.Role,
		CreatedAt: now,
		UpdatedAt: now,
		Rank:      "Admin",
		Source:    "admin_creation",
	}

	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	result, err := usersCollection.InsertOne(ctx, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ADMIN_CREATION_FAILED"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "ADMIN_CREATED",
		"admin": gin.H{
			"id":        result.InsertedID.(primitive.ObjectID).Hex(),
			"email":     input.Email,
			"username":  input.Username,
			"role":      input.Role,
			"createdAt": now,
		},
	})
}

// DeleteUser deletes a user account
func DeleteUser(c *gin.Context) {
	targetID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(targetID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_USER_ID"})
		return
	}

	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	_, err = usersCollection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DELETE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "USER_DELETED"})
}
