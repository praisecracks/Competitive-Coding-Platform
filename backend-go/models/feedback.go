package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Feedback struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID     primitive.ObjectID `bson:"user_id" json:"userId"`
	Username   string             `bson:"username,omitempty" json:"username,omitempty"`
	ProfilePic string             `bson:"profile_pic,omitempty" json:"profilePic,omitempty"`
	Message    string             `bson:"message" json:"message"`
	Page       string             `bson:"page" json:"page"`
	CreatedAt  time.Time          `bson:"created_at" json:"createdAt"`
}
