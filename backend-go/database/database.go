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
var LearningProgressCollection *mongo.Collection
var NotificationsCollection *mongo.Collection
var NotificationDismissalsCollection *mongo.Collection

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
	LearningProgressCollection = GetCollection("learning_progress")
	NotificationsCollection = GetCollection("notifications")
	NotificationDismissalsCollection = GetCollection("notification_dismissals")

	// Create indexes
	createNotificationsIndexes(ctx)
	createNotificationDismissalIndexes(ctx)

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

// createNotificationsIndexes ensures proper indexes exist on the notifications collection
func createNotificationsIndexes(ctx context.Context) {
	if NotificationsCollection == nil {
		fmt.Println(">>> NOTIFICATIONS_COLLECTION_NOT_INITIALIZED")
		return
	}

	// Index 1: user_id + created_at DESC — covers main fetch query: find by user, sorted by time
	indexModel1 := mongo.IndexModel{
		Keys: bson.D{{Key: "user_id", Value: 1}, {Key: "created_at", Value: -1}},
	}
	// Index 2: user_id + read + created_at DESC — helps filter unread notifications efficiently
	indexModel2 := mongo.IndexModel{
		Keys: bson.D{{Key: "user_id", Value: 1}, {Key: "read", Value: 1}, {Key: "created_at", Value: -1}},
	}

	// Create both indexes (MongoDB will skip if already exist)
	_, err1 := NotificationsCollection.Indexes().CreateOne(ctx, indexModel1)
	if err1 != nil {
		fmt.Printf(">>> NOTIFICATIONS_INDEX1_ERROR: %v\n", err1)
	} else {
		fmt.Println(">>> NOTIFICATIONS_INDEX1_CREATED: user_id_1_created_at_-1")
	}

	_, err2 := NotificationsCollection.Indexes().CreateOne(ctx, indexModel2)
	if err2 != nil {
		fmt.Printf(">>> NOTIFICATIONS_INDEX2_ERROR: %v\n", err2)
	} else {
		fmt.Println(">>> NOTIFICATIONS_INDEX2_CREATED: user_id_1_read_1_created_at_-1")
	}
}

// createNotificationDismissalIndexes ensures indexes on notification_dismissals collection
func createNotificationDismissalIndexes(ctx context.Context) {
	if NotificationDismissalsCollection == nil {
		fmt.Println(">>> NOTIFICATION_DISMISSALS_COLLECTION_NOT_INITIALIZED")
		return
	}

	// Unique compound index: each user can dismiss a notification only once
	indexModel := mongo.IndexModel{
		Keys: bson.D{{Key: "user_id", Value: 1}, {Key: "notification_id", Value: 1}},
		Options: options.Index().SetUnique(true),
	}
	_, err := NotificationDismissalsCollection.Indexes().CreateOne(ctx, indexModel)
	if err != nil {
		fmt.Printf(">>> NOTIFICATION_DISMISSALS_INDEX_ERROR: %v\n", err)
	} else {
		fmt.Println(">>> NOTIFICATION_DISMISSALS_INDEX_CREATED: user_id_1_notification_id_1")
	}
}
