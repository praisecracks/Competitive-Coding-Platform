package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NotificationType string

const (
	NotificationDuelInvite NotificationType = "duel_invite"
	NotificationDuelResult NotificationType = "duel_result"
	NotificationSystem     NotificationType = "system"
)

type Notification struct {
	ID        primitive.ObjectID     `json:"id" bson:"_id,omitempty"`
	UserID    string                 `json:"user_id" bson:"user_id"`
	Type      NotificationType       `json:"type" bson:"type"`
	Title     string                 `json:"title" bson:"title"`
	Message   string                 `json:"message" bson:"message"`
	Data      map[string]interface{} `json:"data,omitempty" bson:"data,omitempty"`
	Read      bool                   `json:"read" bson:"read"`
	CreatedAt time.Time              `json:"created_at" bson:"created_at"`
}
