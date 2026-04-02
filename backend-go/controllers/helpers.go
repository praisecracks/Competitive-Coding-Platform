package controllers

import (
	"strings"

	"golang.org/x/crypto/bcrypt"
)

// normalizeEmail returns a lowercase, trimmed email string
func normalizeEmail(email string) string {
	return strings.TrimSpace(strings.ToLower(email))
}

// looksLikeBcryptHash checks if a string is likely a bcrypt hash
func looksLikeBcryptHash(password string) bool {
	return strings.HasPrefix(password, "$2a$") ||
		strings.HasPrefix(password, "$2b$") ||
		strings.HasPrefix(password, "$2y$")
}

// isPasswordValid checks if a password matches a hash or plaintext (for transition)
func isPasswordValid(storedPassword, incomingPassword string) bool {
	if storedPassword == "" || incomingPassword == "" {
		return false
	}

	if looksLikeBcryptHash(storedPassword) {
		return bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(incomingPassword)) == nil
	}

	return storedPassword == incomingPassword
}
