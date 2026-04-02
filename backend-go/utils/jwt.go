package utils

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

// GenerateToken now handles optional userIDs and ensures compatibility with the controller
func GenerateToken(userID interface{}, identifier string, role string) (string, error) {
	var idStr string

	// 1. Convert userID to string if it exists
	if userID != nil {
		if oid, ok := userID.(primitive.ObjectID); ok {
			idStr = oid.Hex()
		} else if s, ok := userID.(string); ok {
			idStr = s
		}
	}

	// 2. Create claims
	claims := jwt.MapClaims{
		"user_id":  idStr,
		"username": identifier, // We use 'username' for frontend compatibility
		"email":    identifier, // Duplicate for safety across different middleware
		"role":     role,
		"exp":      time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(getJWTSecret())
}
