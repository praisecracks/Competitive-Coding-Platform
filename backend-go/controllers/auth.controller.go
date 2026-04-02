package controllers

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"codingplatform/database"
	"codingplatform/models"
	"codingplatform/services"
	"codingplatform/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type SignupRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
	Country  string `json:"country"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required,min=8"`
}

// Register handles user signup
func Register(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	var input SignupRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_PAYLOAD"})
		return
	}

	usersCollection := database.GetCollection("users")

	input.Username = strings.TrimSpace(input.Username)
	input.Email = normalizeEmail(input.Email)

	if input.Username == "" || input.Email == "" || strings.TrimSpace(input.Password) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "MISSING_REQUIRED_FIELDS"})
		return
	}

	if len(input.Password) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "WEAK_PASSWORD"})
		return
	}

	var existingUser models.User
	err := usersCollection.FindOne(ctx, bson.M{
		"$or": []bson.M{
			{"email": input.Email},
			{"username": input.Username},
		},
	}).Decode(&existingUser)

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "USER_EXISTS"})
		return
	}

	if err != nil && !errors.Is(err, mongo.ErrNoDocuments) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "USER_CHECK_FAILED"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PASSWORD_HASH_FAILED"})
		return
	}

	now := time.Now().UTC()

	user := models.User{
		Email:         input.Email,
		Username:      input.Username,
		Password:      string(hashedPassword),
		ProfilePic:    "",
		Source:        "local",
		Country:       input.Country,
		Rank:          "Beginner",
		Bio:           "",
		Role:          "user",
		TotalSolved:   0,
		CurrentStreak: 0,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	result, err := usersCollection.InsertOne(ctx, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SIGNUP_FAILED"})
		return
	}

	insertedID, _ := result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Signup successful",
		"user": gin.H{
			"id":         insertedID.Hex(),
			"email":      user.Email,
			"username":   user.Username,
			"profilePic": user.ProfilePic,
			"country":    user.Country,
			"rank":       user.Rank,
			"bio":        user.Bio,
			"createdAt":  user.CreatedAt,
		},
	})
}

// Login handles user login
func Login(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	var input LoginRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_PAYLOAD"})
		return
	}

	usersCollection := database.GetCollection("users")
	input.Email = normalizeEmail(input.Email)

	if input.Email == "" || strings.TrimSpace(input.Password) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "MISSING_REQUIRED_FIELDS"})
		return
	}

	var user models.User
	err := usersCollection.FindOne(ctx, bson.M{
		"email": input.Email,
	}).Decode(&user)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "INVALID_CREDENTIALS"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "LOGIN_FAILED"})
		return
	}

	if !isPasswordValid(user.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "INVALID_CREDENTIALS"})
		return
	}

	// Token generation
	tokenString, err := utils.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "TOKEN_GENERATION_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Login successful",
		"token":       tokenString,
		"username":    user.Username,
		"email":       user.Email,
		"profile_pic": user.ProfilePic,
		"country":     user.Country,
		"role":        user.Role,
	})
}

// ForgotPassword handles password reset request
func ForgotPassword(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	var input ForgotPasswordRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_PAYLOAD"})
		return
	}

	input.Email = normalizeEmail(input.Email)
	if input.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "MISSING_EMAIL"})
		return
	}

	// Rate limiting by email
	if !services.ForgotPasswordLimiter.Allow(input.Email) {
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "RATE_LIMITED", "message": "Too many reset requests. Please try again later."})
		return
	}

	usersCollection := database.GetCollection("users")
	var user models.User
	err := usersCollection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&user)
	if err != nil {
		// Do NOT reveal user existence
		c.JSON(http.StatusOK, gin.H{"message": "If an account exists for this email, a password reset link has been sent."})
		return
	}

	// Generate secure random reset token
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FORGOT_PASSWORD_FAILED"})
		return
	}
	resetToken := hex.EncodeToString(b)
	resetTokenExpiry := time.Now().UTC().Add(1 * time.Hour)

	// Update user in DB
	_, err = usersCollection.UpdateOne(
		ctx,
		bson.M{"_id": user.ID},
		bson.M{"$set": bson.M{
			"reset_token":        resetToken,
			"reset_token_expiry": resetTokenExpiry,
		}},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FORGOT_PASSWORD_FAILED"})
		return
	}

	// Send password reset email
	frontendURL := os.Getenv("FRONTEND_BASE_URL")
	if frontendURL == "" {
		frontendURL = os.Getenv("FRONTEND_URL")
	}
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}
	resetLink := fmt.Sprintf("%s/reset-password?token=%s", frontendURL, resetToken)

	// Send email (will use mock if SMTP not configured)
	if err := services.SendPasswordResetEmail(user.Email, resetLink); err != nil {
		fmt.Printf(">>> ERROR: FAILED TO SEND RESET EMAIL to %s: %v\n", user.Email, err)
	}

	c.JSON(http.StatusOK, gin.H{"message": "If an account exists for this email, a password reset link has been sent."})
}

// ResetPassword handles password reset
func ResetPassword(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	var input ResetPasswordRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_PAYLOAD"})
		return
	}

	if len(input.NewPassword) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "WEAK_PASSWORD"})
		return
	}

	// Rate limiting by IP
	clientIP := c.ClientIP()
	if !services.ResetPasswordLimiter.Allow(clientIP) {
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "RATE_LIMITED", "message": "Too many reset attempts. Please try again later."})
		return
	}

	usersCollection := database.GetCollection("users")
	var user models.User
	err := usersCollection.FindOne(ctx, bson.M{
		"reset_token":        input.Token,
		"reset_token_expiry": bson.M{"$gt": time.Now().UTC()},
	}).Decode(&user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_OR_EXPIRED_TOKEN"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PASSWORD_HASH_FAILED"})
		return
	}

	_, err = usersCollection.UpdateOne(
		ctx,
		bson.M{"_id": user.ID},
		bson.M{
			"$set": bson.M{
				"password":   string(hashedPassword),
				"updated_at": time.Now().UTC(),
			},
			"$unset": bson.M{
				"reset_token":        "",
				"reset_token_expiry": "",
			},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "PASSWORD_RESET_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password has been successfully reset."})
}

// VerifyResetToken checks if a reset token is valid
func VerifyResetToken(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "MISSING_TOKEN"})
		return
	}

	usersCollection := database.GetCollection("users")
	var user models.User
	err := usersCollection.FindOne(ctx, bson.M{
		"reset_token":        token,
		"reset_token_expiry": bson.M{"$gt": time.Now().UTC()},
	}).Decode(&user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_OR_EXPIRED_TOKEN"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"valid": true})
}

// GitHubLogin redirects to GitHub OAuth
func GitHubLogin(c *gin.Context) {
	clientID := os.Getenv("GITHUB_CLIENT_ID")
	if clientID == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "GITHUB_CLIENT_ID_NOT_SET"})
		return
	}

	redirectURI := os.Getenv("GITHUB_REDIRECT_URI")
	if redirectURI == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "GITHUB_REDIRECT_URI_NOT_SET"})
		return
	}

	githubLoginURL := fmt.Sprintf(
		"https://github.com/login/oauth/authorize?client_id=%s&redirect_uri=%s&scope=user:email",
		clientID,
		url.QueryEscape(redirectURI),
	)

	c.Redirect(http.StatusTemporaryRedirect, githubLoginURL)
}

// GitHubCallback handles GitHub OAuth callback
func GitHubCallback(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	code := c.Query("code")
	if code == "" {
		errorRedirect := fmt.Sprintf("%s/login?error=NO_CODE_PROVIDED", frontendURL)
		c.Redirect(http.StatusTemporaryRedirect, errorRedirect)
		return
	}

	clientID := os.Getenv("GITHUB_CLIENT_ID")
	clientSecret := os.Getenv("GITHUB_CLIENT_SECRET")

	if clientID == "" || clientSecret == "" {
		errorRedirect := fmt.Sprintf("%s/login?error=GITHUB_SECRETS_MISSING", frontendURL)
		c.Redirect(http.StatusTemporaryRedirect, errorRedirect)
		return
	}

	// Exchange code for access token
	tokenReqBody, _ := json.Marshal(map[string]string{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"code":          code,
	})

	req, err := http.NewRequest("POST", "https://github.com/login/oauth/access_token", bytes.NewBuffer(tokenReqBody))
	if err != nil {
		errorRedirect := fmt.Sprintf("%s/login?error=TOKEN_REQUEST_FAILED", frontendURL)
		c.Redirect(http.StatusTemporaryRedirect, errorRedirect)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		errorRedirect := fmt.Sprintf("%s/login?error=TOKEN_EXCHANGE_FAILED", frontendURL)
		c.Redirect(http.StatusTemporaryRedirect, errorRedirect)
		return
	}
	defer resp.Body.Close()

	var tokenResp map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&tokenResp)

	accessToken, ok := tokenResp["access_token"].(string)
	if !ok || accessToken == "" {
		errorRedirect := fmt.Sprintf("%s/login?error=INVALID_TOKEN_RESPONSE", frontendURL)
		c.Redirect(http.StatusTemporaryRedirect, errorRedirect)
		return
	}

	// Fetch User Profile
	userReq, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		errorRedirect := fmt.Sprintf("%s/login?error=USER_REQUEST_FAILED", frontendURL)
		c.Redirect(http.StatusTemporaryRedirect, errorRedirect)
		return
	}
	userReq.Header.Set("Authorization", "Bearer "+accessToken)
	userReq.Header.Set("Accept", "application/json")

	userResp, err := client.Do(userReq)
	if err != nil {
		errorRedirect := fmt.Sprintf("%s/login?error=USER_FETCH_FAILED", frontendURL)
		c.Redirect(http.StatusTemporaryRedirect, errorRedirect)
		return
	}
	defer userResp.Body.Close()

	var githubUser map[string]interface{}
	json.NewDecoder(userResp.Body).Decode(&githubUser)

	githubUsername, _ := githubUser["login"].(string)
	githubProfilePic, _ := githubUser["avatar_url"].(string)
	githubEmail, _ := githubUser["email"].(string)

	if githubEmail == "" {
		// Fetch emails if not in profile
		emailReq, _ := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
		emailReq.Header.Set("Authorization", "Bearer "+accessToken)
		emailResp, err := client.Do(emailReq)
		if err == nil {
			defer emailResp.Body.Close()
			var emails []map[string]interface{}
			json.NewDecoder(emailResp.Body).Decode(&emails)
			for _, e := range emails {
				if primary, _ := e["primary"].(bool); primary {
					githubEmail, _ = e["email"].(string)
					break
				}
			}
		}
	}

	if githubEmail == "" {
		errorRedirect := fmt.Sprintf("%s/login?error=GITHUB_EMAIL_REQUIRED", frontendURL)
		c.Redirect(http.StatusTemporaryRedirect, errorRedirect)
		return
	}

	usersCollection := database.GetCollection("users")
	var user models.User
	err = usersCollection.FindOne(ctx, bson.M{"email": githubEmail}).Decode(&user)

	if err != nil {
		now := time.Now().UTC()
		user = models.User{
			Email:      githubEmail,
			Username:   githubUsername,
			ProfilePic: githubProfilePic,
			Source:     "github",
			Role:       "user",
			CreatedAt:  now,
			UpdatedAt:  now,
		}
		result, _ := usersCollection.InsertOne(ctx, user)
		if result != nil {
			user.ID = result.InsertedID.(primitive.ObjectID)
		}
	}

	tokenString, err := utils.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		errorRedirect := fmt.Sprintf("%s/login?error=AUTH_FAILED", frontendURL)
		c.Redirect(http.StatusTemporaryRedirect, errorRedirect)
		return
	}

	redirectURL := fmt.Sprintf("%s/auth/callback?token=%s&username=%s&email=%s&profile_pic=%s&role=%s",
		frontendURL, tokenString, url.QueryEscape(user.Username), url.QueryEscape(user.Email), url.QueryEscape(user.ProfilePic), url.QueryEscape(user.Role))
	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}
