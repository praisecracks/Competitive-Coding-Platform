package middleware

import (
	"errors"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret []byte

func getJWTSecret() []byte {
	if jwtSecret == nil {
		secret := strings.TrimSpace(os.Getenv("JWT_SECRET"))
		if secret == "" {
			log.Fatal("JWT_SECRET environment variable is required")
		}
		jwtSecret = []byte(secret)
	}
	return jwtSecret
}

// JWTSecret exports the secret for use in other packages like utils
func JWTSecret() []byte {
	return getJWTSecret()
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "AUTH_HEADER_MISSING",
			})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "INVALID_TOKEN_FORMAT",
			})
			return
		}

		tokenString := strings.TrimSpace(parts[1])
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "TOKEN_MISSING",
			})
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if token.Method == nil {
				return nil, errors.New("missing signing method")
			}

			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}

			return getJWTSecret(), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "INVALID_OR_EXPIRED_TOKEN",
			})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "INVALID_TOKEN_CLAIMS",
			})
			return
		}

		userID, _ := claims["user_id"].(string)
		username, _ := claims["username"].(string)
		email, _ := claims["email"].(string)
		role, _ := claims["role"].(string)

		userID = strings.TrimSpace(userID)
		username = strings.TrimSpace(username)
		email = strings.TrimSpace(email)

		if userID == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "INVALID_TOKEN_CLAIMS",
			})
			return
		}

		c.Set("user_id", userID)
		c.Set("username", username)
		c.Set("email", email)
		c.Set("role", role)

		// Check if user is suspended
		// This requires a database check, but we'll only do it if absolutely necessary
		// or if we decide to include suspension status in the JWT claims (which requires re-issuing)
		// For now, let's assume suspension status will be checked on critical actions.

		c.Next()
	}
}

func OptionalAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.Next()
			return
		}

		tokenString := strings.TrimSpace(parts[1])
		if tokenString == "" {
			c.Next()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return getJWTSecret(), nil
		})

		if err != nil || !token.Valid {
			c.Next()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.Next()
			return
		}

		userID, _ := claims["user_id"].(string)
		username, _ := claims["username"].(string)
		email, _ := claims["email"].(string)
		role, _ := claims["role"].(string)

		if userID != "" {
			c.Set("user_id", userID)
			c.Set("username", username)
			c.Set("email", email)
			c.Set("role", role)
		}

		c.Next()
	}
}

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || (role != "super_admin" && role != "sub_admin") {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "ADMIN_ACCESS_REQUIRED",
			})
			return
		}
		c.Next()
	}
}

func SuperAdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "super_admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "SUPER_ADMIN_ACCESS_REQUIRED",
			})
			return
		}
		c.Next()
	}
}
