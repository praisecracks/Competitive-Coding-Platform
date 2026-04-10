package models

import (
	"time"
)

type DuelStatus string

const (
	DuelPending   DuelStatus = "pending"
	DuelAccepted  DuelStatus = "accepted"
	DuelDeclined  DuelStatus = "declined"
	DuelExpired   DuelStatus = "expired"
	DuelCompleted DuelStatus = "completed"
)

type Duel struct {
	ID          string     `json:"id" bson:"_id"`
	ChallengeID int        `json:"challenge_id" bson:"challenge_id"`
	Challenger  string     `json:"challenger_id" bson:"challenger_id"` // User ID
	Opponent    string     `json:"opponent_id" bson:"opponent_id"`     // User ID
	Status      DuelStatus `json:"status" bson:"status"`
	CreatedAt   time.Time  `json:"created_at" bson:"created_at"`
	ExpiresAt   time.Time  `json:"expires_at" bson:"expires_at"`
	AcceptedAt  *time.Time `json:"accepted_at,omitempty" bson:"accepted_at,omitempty"`
	CompletedAt *time.Time `json:"completed_at,omitempty" bson:"completed_at,omitempty"`
	WinnerID    string     `json:"winner_id,omitempty" bson:"winner_id,omitempty"`

	ChallengerSubmitted bool `json:"challenger_submitted" bson:"challenger_submitted"`
	OpponentSubmitted   bool `json:"opponent_submitted" bson:"opponent_submitted"`
	ChallengerScore     int  `json:"challenger_score" bson:"challenger_score"`
	OpponentScore       int  `json:"opponent_score" bson:"opponent_score"`

	ChallengerLiveProgress int `json:"challenger_live_progress" bson:"challenger_live_progress"`
	OpponentLiveProgress   int `json:"opponent_live_progress" bson:"opponent_live_progress"`
}
