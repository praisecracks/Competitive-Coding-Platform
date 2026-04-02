package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

// ConnectDB initializes the connection to MongoDB
func ConnectDB() {
	// Get MongoDB URI from environment variable, fallback to localhost for development
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
}

// GetCollection returns a handle for a specific collection
func GetCollection(collectionName string) *mongo.Collection {
	return Client.Database("codingplatform_db").Collection(collectionName)
}
