package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"codingplatform/database"
	"codingplatform/models"
	"codingplatform/routes"
	"codingplatform/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func init() {
	_ = godotenv.Load()
}

func main() {
	database.ConnectDB()
	appCtx := context.Background()

	services.StartCleanupRoutine()

	challengesCollection := database.GetCollection("challenges")
	err := seedChallengesFromJSON(appCtx, challengesCollection)
	if err != nil {
		fmt.Println(">>> CHALLENGE_SEED_ERROR:", err)
	} else {
		fmt.Println(">>> CHALLENGE_SEED_CHECK_COMPLETE")
	}

	environment := strings.ToLower(strings.TrimSpace(os.Getenv("ENVIRONMENT")))
	if environment == "production" || os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()
	r.SetTrustedProxies(nil)

	allowOrigins := buildAllowedOrigins()

	fmt.Println(">>> ALLOWED_CORS_ORIGINS:", allowOrigins)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Static("/uploads", "./uploads")

	routes.RegisterRoutes(r)

	port := strings.TrimSpace(os.Getenv("PORT"))
	if port == "" {
		port = "8080"
	}

	fmt.Printf(">>> SERVER_STARTED: Listening on port %s\n", port)

	if err := r.Run("0.0.0.0:" + port); err != nil {
		fmt.Println(">>> SERVER_START_ERROR:", err)
	}
}

func buildAllowedOrigins() []string {
	originMap := map[string]bool{}

	defaultOrigins := []string{
		"http://localhost:3000",
		"http://localhost:3001",
		"http://127.0.0.1:3000",
		"http://127.0.0.1:3001",
		"http://10.185.182.174:3000",
		"http://10.104.207.174:3000",
		"http://10.16.0.0/16:3000",
		"http://10.0.0.0/8:3000",
		"https://codemasterx.com.ng",
		"https://www.codemasterx.com.ng",
		"https://codemasterx.netlify.app",
	}

	for _, origin := range defaultOrigins {
		origin = strings.TrimSpace(origin)
		if origin != "" {
			originMap[origin] = true
		}
	}

	envOrigins := []string{
		os.Getenv("FRONTEND_URL"),
		os.Getenv("FRONTEND_BASE_URL"),
		os.Getenv("FRONTEND_FALLBACK_URL"),
	}

	for _, origin := range envOrigins {
		origin = strings.TrimSpace(origin)
		if origin != "" {
			originMap[origin] = true

			if strings.HasPrefix(origin, "https://") {
				host := strings.TrimPrefix(origin, "https://")
				if !strings.HasPrefix(host, "www.") {
					originMap["https://www."+host] = true
				}
			}
		}
	}

	allowOrigins := make([]string, 0, len(originMap))
	for origin := range originMap {
		allowOrigins = append(allowOrigins, origin)
	}

	return allowOrigins
}

func seedChallengesFromJSON(ctx context.Context, collection *mongo.Collection) error {
	filePath := "data/challenges.json"
	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read challenges.json: %w", err)
	}

	var challenges []models.Challenge
	if err := json.Unmarshal(data, &challenges); err != nil {
		return fmt.Errorf("failed to unmarshal challenges: %w", err)
	}

	for _, challenge := range challenges {
		filter := bson.M{"id": challenge.ID}
		update := bson.M{"$set": challenge}
		opts := options.Update().SetUpsert(true)

		_, err := collection.UpdateOne(ctx, filter, update, opts)
		if err != nil {
			return fmt.Errorf("failed to upsert challenge %d: %w", challenge.ID, err)
		}
	}

	fmt.Printf(">>> CHALLENGES_SYNCED_SUCCESSFULLY: %d\n", len(challenges))
	return nil
}