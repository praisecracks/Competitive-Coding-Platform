package controllers

import (
	"context"
	"errors"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"codingplatform/database"
	"codingplatform/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type PublicChallengeTestCase struct {
	InputJSON          string `json:"inputJson" bson:"inputJson"`
	ExpectedOutputJSON string `json:"expectedOutputJson,omitempty" bson:"expectedOutputJson,omitempty"`
	IsHidden           bool   `json:"isHidden,omitempty" bson:"isHidden,omitempty"`
}

type PublicChallenge struct {
	ID            int                       `json:"id"`
	Title         string                    `json:"title"`
	Description   string                    `json:"description,omitempty"`
	Difficulty    string                    `json:"difficulty,omitempty"`
	Category      string                    `json:"category,omitempty"`
	Duration      int                       `json:"duration"`
	Tags          []string                  `json:"tags,omitempty"`
	Examples      []models.ChallengeExample `json:"examples,omitempty"`
	Constraints   []string                  `json:"constraints,omitempty"`
	StarterCode   models.StarterCodeMap     `json:"starterCode,omitempty"`
	TestCases     []PublicChallengeTestCase `json:"testCases,omitempty"`
	FunctionName  string                    `json:"functionName,omitempty"`
	ValidatorType string                    `json:"validatorType,omitempty"`
	InputType     string                    `json:"inputType,omitempty"`
	ReturnType    string                    `json:"returnType,omitempty"`
	Opened        bool                      `json:"opened"`
}

func buildPublicChallenge(ch models.Challenge, opened bool) PublicChallenge {
	publicCases := make([]PublicChallengeTestCase, 0, len(ch.TestCases))

	for _, tc := range ch.TestCases {
		if tc.IsHidden {
			continue
		}

		publicCases = append(publicCases, PublicChallengeTestCase{
			InputJSON:          tc.InputJSON,
			ExpectedOutputJSON: tc.ExpectedOutputJSON,
			IsHidden:           false,
		})
	}

	return PublicChallenge{
		ID:            ch.ID,
		Title:         ch.Title,
		Description:   ch.Description,
		Difficulty:    ch.Difficulty,
		Category:      ch.Category,
		Duration:      ch.Duration,
		Tags:          ch.Tags,
		Examples:      ch.Examples,
		Constraints:   ch.Constraints,
		StarterCode:   ch.StarterCode,
		TestCases:     publicCases,
		FunctionName:  ch.FunctionName,
		ValidatorType: ch.ValidatorType,
		InputType:     ch.InputType,
		ReturnType:    ch.ReturnType,
		Opened:        opened,
	}
}

func getNextChallengeID(ctx context.Context, collection *mongo.Collection) (int, error) {
	var lastChallenge models.Challenge

	err := collection.FindOne(
		ctx,
		bson.M{},
		options.FindOne().SetSort(bson.D{{Key: "id", Value: -1}}),
	).Decode(&lastChallenge)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return 1, nil
		}
		return 0, err
	}

	return lastChallenge.ID + 1, nil
}

func normalizeChallengeInput(input *models.Challenge) {
	input.Title = strings.TrimSpace(input.Title)
	input.Description = strings.TrimSpace(input.Description)
	input.Difficulty = strings.TrimSpace(strings.ToLower(input.Difficulty))
	input.Category = strings.TrimSpace(input.Category)
	input.FunctionName = strings.TrimSpace(input.FunctionName)
	input.ValidatorType = strings.TrimSpace(strings.ToLower(input.ValidatorType))
	input.InputType = strings.TrimSpace(strings.ToLower(input.InputType))
	input.ReturnType = strings.TrimSpace(strings.ToLower(input.ReturnType))

	for i := range input.Tags {
		input.Tags[i] = strings.TrimSpace(input.Tags[i])
	}

	for i := range input.Constraints {
		input.Constraints[i] = strings.TrimSpace(input.Constraints[i])
	}

	for i := range input.Examples {
		input.Examples[i].Input = strings.TrimSpace(input.Examples[i].Input)
		input.Examples[i].Output = strings.TrimSpace(input.Examples[i].Output)
		input.Examples[i].Explanation = strings.TrimSpace(input.Examples[i].Explanation)
	}

	for i := range input.TestCases {
		input.TestCases[i].InputJSON = strings.TrimSpace(input.TestCases[i].InputJSON)
		input.TestCases[i].ExpectedOutputJSON = strings.TrimSpace(input.TestCases[i].ExpectedOutputJSON)
	}
}

func validateChallengeInput(input models.Challenge) string {
	if input.Title == "" {
		return "TITLE_REQUIRED"
	}
	if input.Duration <= 0 {
		return "INVALID_DURATION"
	}
	if input.FunctionName == "" {
		return "FUNCTION_NAME_REQUIRED"
	}
	if input.ValidatorType == "" {
		return "VALIDATOR_TYPE_REQUIRED"
	}
	if input.InputType == "" {
		return "INPUT_TYPE_REQUIRED"
	}
	if input.ReturnType == "" {
		return "RETURN_TYPE_REQUIRED"
	}
	if len(input.TestCases) == 0 {
		return "TEST_CASES_REQUIRED"
	}

	for _, tc := range input.TestCases {
		if tc.InputJSON == "" {
			return "TEST_CASE_INPUT_REQUIRED"
		}
		if tc.ExpectedOutputJSON == "" {
			return "TEST_CASE_EXPECTED_OUTPUT_REQUIRED"
		}
	}

	return ""
}

// GetChallenges returns all public challenges
func GetChallenges(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	challengesCollection := database.GetCollection("challenges")
	interactionsCollection := database.GetCollection("challenge_interactions")
	challenges := []models.Challenge{}

	cursor, err := challengesCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DATABASE_FETCH_ERROR"})
		return
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &challenges); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "CURSOR_PARSE_ERROR"})
		return
	}

	sort.Slice(challenges, func(i, j int) bool {
		return challenges[i].ID < challenges[j].ID
	})

	// Get user interactions if logged in
	userID := ""
	if userIDRaw, exists := c.Get("user_id"); exists {
		userID = userIDRaw.(string)
	}

	openedMap := make(map[int]bool)
	if userID != "" {
		var interactions []models.ChallengeInteraction
		cursor, err := interactionsCollection.Find(ctx, bson.M{"user_id": userID, "opened": true})
		if err == nil {
			defer cursor.Close(ctx)
			_ = cursor.All(ctx, &interactions)
			for _, inter := range interactions {
				openedMap[inter.ChallengeID] = true
			}
		}
	}

	publicChallenges := make([]PublicChallenge, 0, len(challenges))
	for _, ch := range challenges {
		publicChallenges = append(publicChallenges, buildPublicChallenge(ch, openedMap[ch.ID]))
	}

	c.JSON(http.StatusOK, publicChallenges)
}

// GetChallengeByID returns a single public challenge by its ID
func GetChallengeByID(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_CHALLENGE_ID"})
		return
	}

	challengesCollection := database.GetCollection("challenges")
	interactionsCollection := database.GetCollection("challenge_interactions")
	var challenge models.Challenge

	err = challengesCollection.FindOne(ctx, bson.M{"id": id}).Decode(&challenge)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{"error": "CHALLENGE_NOT_FOUND"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "CHALLENGE_FETCH_FAILED"})
		return
	}

	// Check if opened by user
	opened := false
	if userIDRaw, exists := c.Get("user_id"); exists {
		userID := userIDRaw.(string)
		var interaction models.ChallengeInteraction
		err = interactionsCollection.FindOne(ctx, bson.M{"user_id": userID, "challenge_id": id, "opened": true}).Decode(&interaction)
		if err == nil {
			opened = true
		}
	}

	c.JSON(http.StatusOK, buildPublicChallenge(challenge, opened))
}

// GetAdminChallenges returns all full challenges for admin
func GetAdminChallenges(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	challengesCollection := database.GetCollection("challenges")
	challenges := []models.Challenge{}

	cursor, err := challengesCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DATABASE_FETCH_ERROR"})
		return
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &challenges); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "CURSOR_PARSE_ERROR"})
		return
	}

	sort.Slice(challenges, func(i, j int) bool {
		return challenges[i].ID < challenges[j].ID
	})

	c.JSON(http.StatusOK, challenges)
}

// CreateChallenge creates a new challenge
func CreateChallenge(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	var input models.Challenge
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_INPUT"})
		return
	}

	normalizeChallengeInput(&input)

	if validationErr := validateChallengeInput(input); validationErr != "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr})
		return
	}

	challengesCollection := database.GetCollection("challenges")

	nextID, err := getNextChallengeID(ctx, challengesCollection)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FAILED_TO_GENERATE_CHALLENGE_ID"})
		return
	}

	input.ID = nextID

	_, err = challengesCollection.InsertOne(ctx, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "CREATE_CHALLENGE_FAILED"})
		return
	}

	c.JSON(http.StatusCreated, input)
}

// UpdateChallenge updates an existing challenge
func UpdateChallenge(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_CHALLENGE_ID"})
		return
	}

	var input models.Challenge
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_INPUT"})
		return
	}

	normalizeChallengeInput(&input)

	if validationErr := validateChallengeInput(input); validationErr != "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr})
		return
	}

	input.ID = id
	challengesCollection := database.GetCollection("challenges")

	result, err := challengesCollection.ReplaceOne(ctx, bson.M{"id": id}, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "UPDATE_CHALLENGE_FAILED"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "CHALLENGE_NOT_FOUND"})
		return
	}

	c.JSON(http.StatusOK, input)
}

// DeleteChallenge deletes a challenge
func DeleteChallenge(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_CHALLENGE_ID"})
		return
	}

	challengesCollection := database.GetCollection("challenges")
	result, err := challengesCollection.DeleteOne(ctx, bson.M{"id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DELETE_FAILED"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "CHALLENGE_NOT_FOUND"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "CHALLENGE_DELETED_SUCCESSFULLY"})
}

// MarkChallengeOpened marks a challenge as opened for a user
func MarkChallengeOpened(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	userIDRaw, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDRaw.(string)

	idParam := c.Param("id")
	challengeID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_CHALLENGE_ID"})
		return
	}

	interactionsCollection := database.GetCollection("challenge_interactions")

	filter := bson.M{
		"user_id":      userID,
		"challenge_id": challengeID,
	}

	update := bson.M{
		"$set": bson.M{
			"opened":    true,
			"opened_at": time.Now(),
		},
	}

	opts := options.Update().SetUpsert(true)

	_, err = interactionsCollection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FAILED_TO_MARK_OPENED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "CHALLENGE_MARKED_OPENED"})
}
