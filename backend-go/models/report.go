package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Report struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID             primitive.ObjectID `bson:"user_id" json:"userId"`
	ReporterUsername   string             `bson:"reporter_username,omitempty" json:"reporterUsername,omitempty"`
	ReporterProfilePic string             `bson:"reporter_profile_pic,omitempty" json:"reporterProfilePic,omitempty"`
	Type               string             `bson:"type" json:"type"`
	TargetID           int64              `bson:"target_id" json:"targetId"`
	TargetUsername     string             `bson:"target_username" json:"targetUsername"`
	TargetProfilePic   string             `bson:"target_profile_pic,omitempty" json:"targetProfilePic,omitempty"`
	Reason             string             `bson:"reason" json:"reason"`
	Status             string             `bson:"status" json:"status"` // pending, resolved, dismissed
	ResolvedAt         time.Time          `bson:"resolved_at,omitempty" json:"resolvedAt,omitempty"`
	CreatedAt          time.Time          `bson:"created_at" json:"createdAt"`
}
