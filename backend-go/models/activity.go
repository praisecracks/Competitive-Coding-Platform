package models

import "time"

// ActivityType categorizes user actions
type ActivityType string

const (
	ActivitySubmission  ActivityType = "submission"
	ActivityDuel        ActivityType = "duel"
	ActivityLearning    ActivityType = "learning"
	ActivityAchievement ActivityType = "achievement"
	ActivityProfile     ActivityType = "profile"
)

// ActivityStatus indicates outcome status (type-specific)
type ActivityStatus string

const (
	StatusAccepted  ActivityStatus = "accepted"
	StatusFailed    ActivityStatus = "failed"
	StatusPending   ActivityStatus = "pending"
	StatusWon       ActivityStatus = "won"
	StatusLost      ActivityStatus = "lost"
	StatusCompleted ActivityStatus = "completed"
	StatusUnlocked  ActivityStatus = "unlocked"
)

// Activity represents a unified user activity entry
type Activity struct {
	ID         string                 `json:"id" bson:"_id,omitempty"`
	Type       ActivityType           `json:"type"`
	Title      string                 `json:"title"`
	Subtitle   string                 `json:"subtitle,omitempty"` // description/details
	Status     ActivityStatus         `json:"status,omitempty"`
	Score      int                    `json:"score,omitempty"`
	XPAwarded  int                    `json:"xpAwarded,omitempty"`
	Icon       string                 `json:"icon"`    // Lucide icon name
	Color      string                 `json:"color"`   // CSS color class (e.g., "text-emerald-500")
	BGColor    string                 `json:"bgColor"` // background color class
	Date       time.Time              `json:"date"`
	CreatedAt  time.Time              `json:"created_at,omitempty"`
	Metadata   map[string]interface{} `json:"metadata,omitempty"` // free-form extra info
	Difficulty string                 `json:"difficulty,omitempty"`
	Category   string                 `json:"category,omitempty"`
}

// ActivityFeed returns a combined chronological list
type ActivityFeed struct {
	Activities []Activity `json:"activities"`
}
