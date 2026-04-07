package models

import (
	"time"
)

type ChallengeExample struct {
	Input       string `json:"input,omitempty" bson:"input,omitempty"`
	Output      string `json:"output,omitempty" bson:"output,omitempty"`
	Explanation string `json:"explanation,omitempty" bson:"explanation,omitempty"`
}

type StarterCodeMap struct {
	JavaScript string `json:"javascript,omitempty" bson:"javascript,omitempty"`
	Python     string `json:"python,omitempty" bson:"python,omitempty"`
	Go         string `json:"go,omitempty" bson:"go,omitempty"`
}

type ChallengeTestCase struct {
	InputJSON          string `json:"inputJson" bson:"inputJson"`
	ExpectedOutputJSON string `json:"expectedOutputJson" bson:"expectedOutputJson"`
	IsHidden           bool   `json:"isHidden,omitempty" bson:"isHidden,omitempty"`
}

type Challenge struct {
	ID          int                 `json:"id" bson:"id"`
	Title       string              `json:"title" bson:"title"`
	Description string              `json:"description,omitempty" bson:"description,omitempty"`
	Difficulty  string              `json:"difficulty,omitempty" bson:"difficulty,omitempty"`
	Category    string              `json:"category,omitempty" bson:"category,omitempty"`
	Duration    int                 `json:"duration" bson:"duration"`
	Tags        []string            `json:"tags,omitempty" bson:"tags,omitempty"`
	Examples    []ChallengeExample  `json:"examples,omitempty" bson:"examples,omitempty"`
	Constraints []string            `json:"constraints,omitempty" bson:"constraints,omitempty"`
	StarterCode StarterCodeMap      `json:"starterCode,omitempty" bson:"starterCode,omitempty"`
	TestCases   []ChallengeTestCase `json:"testCases,omitempty" bson:"testCases,omitempty"`

	FunctionName  string `json:"functionName,omitempty" bson:"functionName,omitempty"`
	ValidatorType string `json:"validatorType,omitempty" bson:"validatorType,omitempty"`
	InputType     string `json:"inputType,omitempty" bson:"inputType,omitempty"`
	ReturnType    string `json:"returnType,omitempty" bson:"returnType,omitempty"`
}

type ChallengeInteraction struct {
	UserID      string    `json:"user_id" bson:"user_id"`
	ChallengeID int       `json:"challenge_id" bson:"challenge_id"`
	Opened      bool      `json:"opened" bson:"opened"`
	OpenedAt    time.Time `json:"opened_at" bson:"opened_at"`
}
