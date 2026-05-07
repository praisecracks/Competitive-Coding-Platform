package controllers

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"codingplatform/database"
	"codingplatform/models"
	"codingplatform/services"

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
	ActiveUsers      int     `json:"activeUsers"`
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

	activeThreshold := time.Now().UTC().Add(-15 * time.Minute)
	activeUsersCount, _ := usersCollection.CountDocuments(ctx, bson.M{"last_active": bson.M{"$gte": activeThreshold}})

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
		ActiveUsers:      int(activeUsersCount),
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
		ID         string    `json:"id"`
		Email      string    `json:"email"`
		Username   string    `json:"username"`
		Role       string    `json:"role"`
		Rank       string    `json:"rank"`
		CreatedAt  time.Time `json:"createdAt"`
		LastActive time.Time `json:"lastActive"`
	}

	var response []UserRegistryResponse
	for _, user := range users {
		response = append(response, UserRegistryResponse{
			ID:         user.ID.Hex(),
			Email:      user.Email,
			Username:   user.Username,
			Role:       user.Role,
			Rank:       user.Rank,
			CreatedAt:  user.CreatedAt,
			LastActive: user.LastActive,
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
		Email:              input.Email,
		Username:           input.Username,
		Password:           string(hashedPassword),
		Role:               input.Role,
		CreatedAt:          now,
		UpdatedAt:          now,
		Rank:               "Admin",
		Source:             "admin_creation",
		EmailNotifications: true,
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

// BroadcastNotificationRequest represents the request to send a broadcast notification
type BroadcastNotificationRequest struct {
	Title     string `json:"title" binding:"required"`
	Message   string `json:"message" binding:"required"`
	ActionURL string `json:"actionUrl"`
	SendToAll bool   `json:"sendToAll"`
	DryRun    bool   `json:"dryRun"` // Set to true to simulate broadcast without sending emails
}

// SendBroadcastNotification sends a notification to all users (email + in-app)
func SendBroadcastNotification(c *gin.Context) {
	var input BroadcastNotificationRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_INPUT"})
		return
	}

	input.Title = strings.TrimSpace(input.Title)
	input.Message = strings.TrimSpace(input.Message)

	if input.Title == "" || input.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "TITLE_AND_MESSAGE_REQUIRED"})
		return
	}

	// Build HTML email content
	config := services.GetEmailConfig()
	fromName := strings.TrimSpace(config.FromName)
	if fromName == "" {
		fromName = "CODEMASTER"
	}

	logoHTML := fromName
	if strings.TrimSpace(config.AppLogoURL) != "" {
		logoHTML = fmt.Sprintf(`<img src="%s" alt="%s" style="display:block;margin:0 auto;max-width:140px;height:auto;">`,
			config.AppLogoURL, fromName)
	}

	actionButton := ""
	if input.ActionURL != "" {
		actionButton = fmt.Sprintf(`
		<div style="text-align: center; margin: 24px 0;">
			<a href="%s" style="display: inline-block; background-color: #d946ef; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Announcement</a>
		</div>`, input.ActionURL)
	}

	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 40px auto; padding: 40px; background: #ffffff; border-radius: 12px; border: 1px solid #e1e4e8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { margin-bottom: 32px; text-align: center; }
        .content { margin-bottom: 32px; }
        h1 { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 16px; }
        p { margin-bottom: 16px; color: #4b5563; }
        .footer { font-size: 13px; color: #9ca3af; text-align: center; border-top: 1px solid #f1f1f1; padding-top: 24px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            %s
        </div>
        <div class="content">
            <h1>%s</h1>
            <p>%s</p>
            %s
        </div>
        <div class="footer">
            &copy; 2026 CODEMASTER. All rights reserved.<br>
            Level up your coding skills.
        </div>
    </div>
</body>
</html>
`, input.Title, logoHTML, input.Title, input.Message, actionButton)

	// Handle dry run - create notifications only, no emails
	if input.DryRun {
		fmt.Printf(">>> BROADCAST DRY RUN: Creating notifications only for %s users\n", map[bool]string{true: "all", false: "opted-in"}[input.SendToAll])
		
		usersCollection := database.GetCollection("users")
		ctx := context.Background()
		filter := bson.M{}
		if !input.SendToAll {
			filter = bson.M{"email_notifications": true}
		}
		
		cursor, err := usersCollection.Find(ctx, filter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "FAILED_TO_FETCH_USERS"})
			return
		}
		defer cursor.Close(ctx)
		
		var users []models.User
		if err := cursor.All(ctx, &users); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "FAILED_TO_DECODE_USERS"})
			return
		}
		
		// Create notifications using shared service
		notificationsCreated := services.CreateBroadcastNotifications(users, input.Title, input.Message)
		
		c.JSON(http.StatusOK, gin.H{
			"message":            "Dry run completed - notifications created only",
			"title":              input.Title,
			"recipients":         len(users),
			"notifications_created": notificationsCreated,
			"emails_sent":        0,
			"mode":               "dry_run",
		})
		return
	}

	// Normal broadcast: send emails + create notifications
	stats, err := services.SendBroadcastEmail(input.Title, input.Message, htmlBody, input.ActionURL, input.SendToAll)
	if err != nil {
		fmt.Printf(">>> BROADCAST FAILED: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "BROADCAST_FAILED", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":              "Broadcast sent successfully",
		"title":                input.Title,
		"recipients":           map[bool]string{true: "all_users", false: "opted_in_users"}[input.SendToAll],
		"mode":                 "production",
		"stats":                stats,
	})
}
