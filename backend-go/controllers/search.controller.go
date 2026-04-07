package controllers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"codingplatform/database"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// SearchUser represents a user in search results
type SearchUser struct {
	ID         primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Username   string             `json:"username" bson:"username"`
	Rank       string             `json:"rank,omitempty" bson:"rank"`
	ProfilePic string             `json:"profile_pic,omitempty" bson:"profile_pic"`
}

// SearchChallenge represents a challenge in search results
type SearchChallenge struct {
	ID         int      `json:"id" bson:"id"`
	Title      string   `json:"title" bson:"title"`
	Difficulty string   `json:"difficulty,omitempty" bson:"difficulty"`
	Category   string   `json:"category,omitempty" bson:"category"`
	Tags       []string `json:"tags,omitempty" bson:"tags"`
	Opened     bool     `json:"opened"`
}

// GetSearch handles the search request for users and challenges
func GetSearch(c *gin.Context) {
	query := strings.TrimSpace(c.Query("q"))
	if query == "" {
		c.JSON(http.StatusOK, gin.H{"users": []SearchUser{}, "challenges": []SearchChallenge{}})
		return
	}

	usersCollection := database.GetCollection("users")
	challengesCollection := database.GetCollection("challenges")

	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	userFilter := bson.M{
		"$and": []bson.M{
			{"public_profile": true},
			{
				"$or": []bson.M{
					{"username": bson.M{"$regex": query, "$options": "i"}},
					{"email": bson.M{"$regex": query, "$options": "i"}},
				},
			},
		},
	}
	challengeFilter := bson.M{
		"$or": []bson.M{
			{"title": bson.M{"$regex": query, "$options": "i"}},
			{"category": bson.M{"$regex": query, "$options": "i"}},
			{"tags": bson.M{"$regex": query, "$options": "i"}},
		},
	}

	userCursor, _ := usersCollection.Find(ctx, userFilter, options.Find().SetLimit(10))
	challengeCursor, _ := challengesCollection.Find(ctx, challengeFilter, options.Find().SetLimit(10))

	var users []SearchUser
	if userCursor != nil {
		defer userCursor.Close(ctx)
		_ = userCursor.All(ctx, &users)
	}

	var challenges []SearchChallenge
	if challengeCursor != nil {
		defer challengeCursor.Close(ctx)
		_ = challengeCursor.All(ctx, &challenges)

		// Check if user is logged in
		userID := ""
		if userIDRaw, exists := c.Get("user_id"); exists {
			userID = userIDRaw.(string)
		}

		if userID != "" {
			interactionsCollection := database.GetCollection("challenge_interactions")
			var interactions []struct {
				ChallengeID int `bson:"challenge_id"`
			}
			cursor, err := interactionsCollection.Find(ctx, bson.M{"user_id": userID, "opened": true})
			if err == nil {
				defer cursor.Close(ctx)
				_ = cursor.All(ctx, &interactions)
				openedMap := make(map[int]bool)
				for _, inter := range interactions {
					openedMap[inter.ChallengeID] = true
				}

				for i := range challenges {
					if openedMap[challenges[i].ID] {
						challenges[i].Opened = true
					}
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"users":      users,
		"challenges": challenges,
	})
}

// GetUserByID searches for a user by their ID
func GetUserByID(c *gin.Context) {
	idParam := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_USER_ID"})
		return
	}

	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	var user SearchUser
	err = usersCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "USER_NOT_FOUND"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SEARCH_FAILED"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// SearchUserByQuery searches for a user by their ID or username
func SearchUserByQuery(c *gin.Context) {
	query := strings.TrimSpace(c.Query("q"))
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "QUERY_REQUIRED"})
		return
	}

	usersCollection := database.GetCollection("users")
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	var filter bson.M
	objID, err := primitive.ObjectIDFromHex(query)
	if err == nil {
		// If query is a valid ObjectID, search by ID
		filter = bson.M{"_id": objID}
	} else {
		// Otherwise, search by case-insensitive exact username
		filter = bson.M{"username": bson.M{"$regex": "^" + query + "$", "$options": "i"}}
	}

	var user SearchUser
	err = usersCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "USER_NOT_FOUND"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SEARCH_FAILED"})
		return
	}

	c.JSON(http.StatusOK, user)
}
