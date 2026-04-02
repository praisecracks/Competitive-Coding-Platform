package services

import (
	"sync"
	"time"
)

// RateLimiter implements a simple in-memory rate limiter
type RateLimiter struct {
	mu       sync.RWMutex
	attempts map[string][]time.Time
	limit    int
	window   time.Duration
}

// NewRateLimiter creates a new rate limiter
// limit: maximum number of attempts allowed
// window: time window for the limit
func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		attempts: make(map[string][]time.Time),
		limit:    limit,
		window:   window,
	}
}

// Allow checks if a request from the given key is allowed
// Returns true if allowed, false if rate limited
func (rl *RateLimiter) Allow(key string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	windowStart := now.Add(-rl.window)

	// Get existing attempts for this key
	attempts := rl.attempts[key]

	// Filter out old attempts outside the window
	var validAttempts []time.Time
	for _, t := range attempts {
		if t.After(windowStart) {
			validAttempts = append(validAttempts, t)
		}
	}

	// Check if limit exceeded
	if len(validAttempts) >= rl.limit {
		return false
	}

	// Add current attempt
	validAttempts = append(validAttempts, now)
	rl.attempts[key] = validAttempts

	return true
}

// Reset clears the rate limit for a specific key
func (rl *RateLimiter) Reset(key string) {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	delete(rl.attempts, key)
}

// Cleanup removes old entries to prevent memory leaks
// Should be called periodically
func (rl *RateLimiter) Cleanup() {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	windowStart := now.Add(-rl.window)

	for key, attempts := range rl.attempts {
		var validAttempts []time.Time
		for _, t := range attempts {
			if t.After(windowStart) {
				validAttempts = append(validAttempts, t)
			}
		}
		if len(validAttempts) == 0 {
			delete(rl.attempts, key)
		} else {
			rl.attempts[key] = validAttempts
		}
	}
}

// Global rate limiters for different endpoints
var (
	// ForgotPasswordLimiter: 3 attempts per 15 minutes per email
	ForgotPasswordLimiter = NewRateLimiter(3, 15*time.Minute)

	// ResetPasswordLimiter: 5 attempts per 15 minutes per IP
	ResetPasswordLimiter = NewRateLimiter(5, 15*time.Minute)

	// LoginLimiter: 5 attempts per 15 minutes per IP
	LoginLimiter = NewRateLimiter(5, 15*time.Minute)
)

// StartCleanupRoutine starts a background goroutine to clean up old rate limit entries
func StartCleanupRoutine() {
	go func() {
		ticker := time.NewTicker(10 * time.Minute)
		defer ticker.Stop()

		for range ticker.C {
			ForgotPasswordLimiter.Cleanup()
			ResetPasswordLimiter.Cleanup()
			LoginLimiter.Cleanup()
		}
	}()
}
