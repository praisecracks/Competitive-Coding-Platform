// backend-go/models/learningProgress.go
package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// TrackProgress stores progress for a single track
type TrackProgress struct {
	CompletedTopicIds  []string                  `bson:"completed_topic_ids" json:"completedTopicIds"`
	CompletedLessonIds []string                  `bson:"completed_lesson_ids" json:"completedLessonIds"`
	LessonProgress     map[string]LessonProgress `bson:"lesson_progress" json:"lessonProgress"`
	TopicTimeSpent     map[string]int            `bson:"topic_time_spent" json:"topicTimeSpent"`
	StartedAt          time.Time                 `bson:"started_at" json:"startedAt"`
	LastAccessedAt     time.Time                 `bson:"last_accessed_at" json:"lastAccessedAt"`
}

// LessonProgress stores progress for individual lessons
type LessonProgress struct {
	Completed        bool `bson:"completed" json:"completed"`
	TimeSpentSeconds int  `bson:"time_spent_seconds" json:"timeSpentSeconds"`
}

// LearningProgress - main document for user learning progress
type LearningProgress struct {
	ID             primitive.ObjectID            `bson:"_id,omitempty" json:"id"`
	UserID         primitive.ObjectID            `bson:"user_id" json:"userId"`
	TrackProgress  map[string]TrackProgress      `bson:"track_progress" json:"trackProgress"`
	LegacyProgress map[string]LegacyPathProgress `bson:"legacy_progress" json:"legacyProgress"`
	Streak         StreakData                    `bson:"streak" json:"streak"`
	Journal        []JournalEntry                `bson:"journal" json:"journal"`
	CreatedAt      time.Time                     `bson:"created_at" json:"createdAt"`
	UpdatedAt      time.Time                     `bson:"updated_at" json:"updatedAt"`
}

// LegacyPathProgress - for old path-based progress
type LegacyPathProgress struct {
	CompletedStepIds []string `bson:"completed_step_ids" json:"completedStepIds"`
	Liked            bool     `bson:"liked" json:"liked"`
	Rating           int      `bson:"rating" json:"rating"`
}

// StreakData - learning streak
type StreakData struct {
	CurrentStreak    int       `bson:"current_streak" json:"currentStreak"`
	LongestStreak    int       `bson:"longest_streak" json:"longestStreak"`
	LastLearningDate time.Time `bson:"last_learning_date" json:"lastLearningDate"`
}

// JournalEntry - learning journal entry
type JournalEntry struct {
	ID          string              `bson:"id" json:"id"`
	Type        string              `bson:"type" json:"type"` // "course_completion" or "topic_completion"
	Title       string              `bson:"title" json:"title"`
	CompletedAt time.Time           `bson:"completed_at" json:"completedAt"`
	NoteContent *JournalNoteContent `bson:"note_content,omitempty" json:"noteContent,omitempty"`
}

// JournalNoteContent - detailed journal note
type JournalNoteContent struct {
	CourseTitle   string          `bson:"course_title" json:"courseTitle"`
	StepTitle     string          `bson:"step_title" json:"stepTitle"`
	Description   string          `bson:"description,omitempty" json:"description,omitempty"`
	Content       []string        `bson:"content,omitempty" json:"content,omitempty"`
	Example       *ExampleContent `bson:"example,omitempty" json:"example,omitempty"`
	CommonMistake string          `bson:"common_mistake,omitempty" json:"commonMistake,omitempty"`
	KeyTakeaways  []string        `bson:"key_takeaways,omitempty" json:"keyTakeaways,omitempty"`
}

// ExampleContent - code example
type ExampleContent struct {
	Title       string `bson:"title,omitempty" json:"title,omitempty"`
	Code        string `bson:"code,omitempty" json:"code,omitempty"`
	Explanation string `bson:"explanation,omitempty" json:"explanation,omitempty"`
}
