// backend-go/models/user.go
package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email              string             `bson:"email" json:"email"`
	Username           string             `bson:"username" json:"username"`
	Password           string             `bson:"password" json:"password,omitempty"`
	ProfilePic         string             `bson:"profile_pic,omitempty" json:"profile_pic,omitempty"`
	Source             string             `bson:"source,omitempty" json:"source,omitempty"`
	Country            string             `bson:"country,omitempty" json:"country,omitempty"`
	Rank               string             `bson:"rank" json:"rank"`
	Bio                string             `bson:"bio" json:"bio"`
	Role               string             `bson:"role" json:"role"`
	GithubUrl          string             `bson:"github_url" json:"githubUrl"`
	LinkedinUrl        string             `bson:"linkedin_url" json:"linkedinUrl"`
	EmailNotifications bool               `bson:"email_notifications" json:"emailNotifications"`
	ChallengeReminders bool               `bson:"challenge_reminders" json:"challengeReminders"`
	PublicProfile      bool               `bson:"public_profile" json:"publicProfile"`
	TotalSolved        int                `bson:"total_solved" json:"totalSolved"`
	ChallengesWon      int                `bson:"challenges_won" json:"challengesWon"`
	ChallengesPlayed   int                `bson:"challenges_played" json:"challengesPlayed"`
	CurrentStreak      int                `bson:"current_streak" json:"currentStreak"`
	IsSuspended        bool               `bson:"is_suspended" json:"isSuspended"`
	ResetToken         string             `bson:"reset_token,omitempty" json:"-"`
	ResetTokenExpiry   time.Time          `bson:"reset_token_expiry,omitempty" json:"-"`
	CreatedAt          time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt          time.Time          `bson:"updated_at" json:"updatedAt"`
}
