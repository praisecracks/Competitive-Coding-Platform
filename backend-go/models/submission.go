package models

import "time"

type HistoryEntry struct {
	Time string `json:"time" bson:"time"`
	Line string `json:"line" bson:"line"`
}

type SubmissionRecord struct {
	UserID        string         `json:"user_id" bson:"user_id"`
	Username      string         `json:"username" bson:"username"`
	ChallengeID   int            `json:"challenge_id" bson:"challenge_id"`
	Language      string         `json:"language" bson:"language"`
	Code          string         `json:"code" bson:"code"`
	Score         int            `json:"score" bson:"score"`
	Status        string         `json:"status" bson:"status"`
	PassedTests   int            `json:"passedTests" bson:"passedTests"`
	TotalTests    int            `json:"totalTests" bson:"totalTests"`
	Output        []string       `json:"output,omitempty" bson:"output,omitempty"`
	Error         string         `json:"error,omitempty" bson:"error,omitempty"`
	ExecutionTime string         `json:"executionTime,omitempty" bson:"executionTime,omitempty"`
	History       []HistoryEntry `json:"history,omitempty" bson:"history,omitempty"`
	JudgeVersion  string         `json:"judgeVersion,omitempty" bson:"judgeVersion,omitempty"`
	CreatedAt     time.Time      `json:"created_at" bson:"created_at"`
}