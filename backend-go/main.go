package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
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
	// Load environment variables before other packages are initialized
	_ = godotenv.Load()
}

func main() {
	// Connect to Database
	database.ConnectDB()
	appCtx := context.Background()

	// Start rate limiter cleanup routine
	services.StartCleanupRoutine()

	// Seed challenges if needed
	challengesCollection := database.GetCollection("challenges")
	err := seedChallengesFromJSON(appCtx, challengesCollection)
	if err != nil {
		fmt.Println(">>> CHALLENGE_SEED_ERROR:", err)
	} else {
		fmt.Println(">>> CHALLENGE_SEED_CHECK_COMPLETE")
	}

	// Initialize Gin
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()
	r.SetTrustedProxies(nil)

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://localhost:3001",
			"http://127.0.0.1:3000",
			"http://127.0.0.1:3001",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Static files
	r.Static("/uploads", "./uploads")

	// Register Routes
	routes.RegisterRoutes(r)

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf(">>> SERVER_STARTED: Listening on port %s\n", port)
	r.Run("0.0.0.0:" + port)
}

// seedChallengesFromJSON seeds initial challenges from a JSON file
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
