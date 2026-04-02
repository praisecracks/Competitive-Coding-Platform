package models

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
	Input          string `json:"input" bson:"input"`
	ExpectedOutput string `json:"expectedOutput" bson:"expectedOutput"`
	IsHidden       bool   `json:"isHidden,omitempty" bson:"isHidden,omitempty"`
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
}