package database

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"codingplatform/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var FeedbackCollection *mongo.Collection
var UserCollection *mongo.Collection

// ConnectDB initializes the connection to MongoDB
func ConnectDB() {
	mongoURI := strings.TrimSpace(os.Getenv("MONGO_URI"))
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
		fmt.Println(">>> SYSTEM_CONNECTED: Using local MongoDB (MONGO_URI not set)")
	} else {
		fmt.Println(">>> SYSTEM_CONNECTED: Using MongoDB from environment")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(">>> DATABASE_CONNECTION_FAILED: ", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(">>> DATABASE_PING_FAILED: ", err)
	}

	Client = client

	// Initialize collections
	FeedbackCollection = GetCollection("feedback")
	UserCollection = GetCollection("users")

	fmt.Println(">>> DATABASE_CONNECTED_SUCCESSFULLY")

	if err := seedChallengesFromJSON(); err != nil {
		log.Println(">>> CHALLENGE_SEED_FAILED:", err)
	} else {
		fmt.Println(">>> CHALLENGE_SEED_CHECK_COMPLETE")
	}
}

// GetCollection returns a handle for a specific collection
func GetCollection(collectionName string) *mongo.Collection {
	return Client.Database("codingplatform_db").Collection(collectionName)
}

func seedChallengesFromJSON() error {
	if Client == nil {
		return fmt.Errorf("mongo client is not initialized")
	}

	jsonPath := filepath.Join("data", "challenges.json")
	raw, err := os.ReadFile(jsonPath)
	if err != nil {
		return fmt.Errorf("failed to read %s: %w", jsonPath, err)
	}

	var challenges []models.Challenge
	if err := json.Unmarshal(raw, &challenges); err != nil {
		return fmt.Errorf("failed to parse %s: %w", jsonPath, err)
	}

	if len(challenges) == 0 {
		return fmt.Errorf("no challenges found in %s", jsonPath)
	}

	collection := GetCollection("challenges")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	upsertCount := 0

	for _, challenge := range challenges {
		if challenge.ID <= 0 {
			log.Printf(">>> CHALLENGE_SKIPPED_INVALID_ID: %+v\n", challenge)
			continue
		}

		update := bson.M{
			"$set": bson.M{
				"id":            challenge.ID,
				"title":         challenge.Title,
				"description":   challenge.Description,
				"difficulty":    challenge.Difficulty,
				"category":      challenge.Category,
				"duration":      challenge.Duration,
				"tags":          challenge.Tags,
				"examples":      challenge.Examples,
				"constraints":   challenge.Constraints,
				"starterCode":   challenge.StarterCode,
				"testCases":     challenge.TestCases,
				"functionName":  challenge.FunctionName,
				"validatorType": challenge.ValidatorType,
				"inputType":     challenge.InputType,
				"returnType":    challenge.ReturnType,
			},
		}

		_, err := collection.UpdateOne(
			ctx,
			bson.M{"id": challenge.ID},
			update,
			options.Update().SetUpsert(true),
		)
		if err != nil {
			return fmt.Errorf("failed to upsert challenge id %d: %w", challenge.ID, err)
		}

		upsertCount++
	}

	fmt.Printf(">>> CHALLENGE_SYNC_SUCCESS: %d challenges upserted\n", upsertCount)
	return nil
}
