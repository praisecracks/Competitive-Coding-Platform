package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/smtp"
	"os"
	"strings"
	"sync"
	"time"

	"codingplatform/database"
	"codingplatform/models"

	"go.mongodb.org/mongo-driver/bson"
)

// EmailConfig holds email configuration
type EmailConfig struct {
	ResendAPIKey string
	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPass     string
	FromEmail    string
	FromName     string
	AppLogoURL   string
}

// GetEmailConfig loads email configuration from environment variables
func GetEmailConfig() EmailConfig {
	return EmailConfig{
		ResendAPIKey: os.Getenv("RESEND_API_KEY"),
		SMTPHost:     os.Getenv("SMTP_HOST"),
		SMTPPort:     os.Getenv("SMTP_PORT"),
		SMTPUser:     os.Getenv("SMTP_USER"),
		SMTPPass:     os.Getenv("SMTP_PASS"),
		FromEmail:    os.Getenv("FROM_EMAIL"),
		FromName:     os.Getenv("FROM_NAME"),
		AppLogoURL:   os.Getenv("APP_LOGO_URL"),
	}
}

// IsEmailConfigured checks if any email method is properly configured
func IsEmailConfigured() bool {
	config := GetEmailConfig()
	return config.ResendAPIKey != "" ||
		(config.SMTPHost != "" && config.SMTPUser != "" && config.SMTPPass != "")
}

// ResendEmailRequest represents the request body for Resend API
type ResendEmailRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	Text    string   `json:"text,omitempty"`
	Html    string   `json:"html,omitempty"`
}

// ResendEmailResponse represents the response from Resend API
type ResendEmailResponse struct {
	ID string `json:"id"`
}

// BroadcastStats contains statistics about a broadcast operation
type BroadcastStats struct {
	TotalUsers           int `json:"total_users"`
	NotificationsCreated int `json:"notifications_created"`
	EmailsSent           int `json:"emails_sent"`
	EmailsFailed         int `json:"emails_failed"`
}

// SendPasswordResetEmail sends a password reset email to the user
func SendPasswordResetEmail(toEmail, resetLink string) error {
	config := GetEmailConfig()

	fmt.Printf(">>> EMAIL SERVICE: Attempting to send password reset email to %s\n", toEmail)

	if !IsEmailConfigured() {
		fmt.Printf(">>> MOCK EMAIL (email service not configured):\nTo: %s\nSubject: CODEMASTER Password Reset\nBody: Click here to reset your password: %s\n\n", toEmail, resetLink)
		return nil
	}

	fromName := strings.TrimSpace(config.FromName)
	if fromName == "" {
		fromName = "CODEMASTER"
	}

	fromEmail := strings.TrimSpace(config.FromEmail)
	if fromEmail == "" || !isValidSender(fromEmail) {
		return fmt.Errorf("invalid FROM_EMAIL configuration")
	}

	subject := "CODEMASTER password reset request"

	textBody := fmt.Sprintf(`Hello,

We received a request to reset the password for your CODEMASTER account.

Click the link below to reset your password:
%s

This link will expire in 1 hour.

If you did not request this reset, please ignore this email.

Best regards,
The CODEMASTER Team`, resetLink)

	logoHTML := fmt.Sprintf(`<a href="https://codemasterx.com.ng" class="logo">%s</a>`, fromName)
	if strings.TrimSpace(config.AppLogoURL) != "" {
		logoHTML = fmt.Sprintf(
			`<img src="%s" alt="%s" style="display:block;margin:0 auto;max-width:140px;height:auto;">`,
			config.AppLogoURL,
			fromName,
		)
	}

	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset your password</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 40px auto; padding: 40px; background: #ffffff; border-radius: 12px; border: 1px solid #e1e4e8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { margin-bottom: 32px; text-align: center; }
        .logo { font-size: 24px; font-weight: 800; color: #d946ef; letter-spacing: -0.02em; text-decoration: none; }
        .content { margin-bottom: 32px; }
        h1 { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 16px; }
        p { margin-bottom: 16px; color: #4b5563; }
        .button-container { text-align: center; margin: 32px 0; }
        .button { background-color: #000; color: #fff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; }
        .footer { font-size: 13px; color: #9ca3af; text-align: center; border-top: 1px solid #f1f1f1; padding-top: 24px; }
        .link { color: #d946ef; text-decoration: none; word-break: break-all; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            %s
        </div>
        <div class="content">
            <h1>Reset your password</h1>
            <p>Hello,</p>
            <p>We received a request to reset the password for your CODEMASTER account. Click the button below to proceed:</p>
            
            <div class="button-container">
                <a href="%%s" class="button">Reset Password</a>
            </div>
            
            <p>If you prefer, you can also copy and paste this link into your browser:</p>
            <p><a href="%%s" class="link">%%s</a></p>
            
            <p><strong>Note:</strong> This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            &copy; 2026 CODEMASTER. All rights reserved.<br>
            Level up your coding skills.
        </div>
    </div>
</body>
</html>
`, logoHTML)

	htmlBody = fmt.Sprintf(htmlBody, resetLink, resetLink, resetLink)

	from := fmt.Sprintf("%s <%s>", fromName, fromEmail)

	// OPTION 1: SMTP
	if config.SMTPHost != "" && config.SMTPUser != "" && config.SMTPPass != "" {
		fmt.Printf(">>> EMAIL SERVICE: Using SMTP (%s)\n", config.SMTPHost)

		port := strings.TrimSpace(config.SMTPPort)
		if port == "" {
			port = "587"
		}

		header := map[string]string{
			"From":         from,
			"To":           toEmail,
			"Subject":      subject,
			"MIME-Version": "1.0",
			"Content-Type": `text/html; charset="utf-8"`,
		}

		message := ""
		for k, v := range header {
			message += fmt.Sprintf("%s: %s\r\n", k, v)
		}
		message += "\r\n" + htmlBody

		auth := smtp.PlainAuth("", config.SMTPUser, config.SMTPPass, config.SMTPHost)
		err := smtp.SendMail(config.SMTPHost+":"+port, auth, config.SMTPUser, []string{toEmail}, []byte(message))
		if err != nil {
			fmt.Printf(">>> SMTP SEND FAILED: %v\n", err)
			return fmt.Errorf("failed to send email via SMTP: %w", err)
		}

		fmt.Printf(">>> EMAIL SENT SUCCESSFULLY via SMTP to %s\n", toEmail)
		return nil
	}

	// OPTION 2: Resend API
	if config.ResendAPIKey != "" {
		fmt.Printf(">>> EMAIL SERVICE: Using Resend API\n")

		reqBody := ResendEmailRequest{
			From:    from,
			To:      []string{toEmail},
			Subject: subject,
			Text:    textBody,
			Html:    htmlBody,
		}

		jsonData, err := json.Marshal(reqBody)
		if err != nil {
			fmt.Printf(">>> EMAIL SERVICE: Failed to marshal request: %v\n", err)
			return fmt.Errorf("failed to prepare email request: %w", err)
		}

		req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(jsonData))
		if err != nil {
			fmt.Printf(">>> EMAIL SERVICE: Failed to create request: %v\n", err)
			return fmt.Errorf("failed to create email request: %w", err)
		}

		req.Header.Set("Authorization", "Bearer "+config.ResendAPIKey)
		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{
			Timeout: 15 * time.Second,
		}

		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf(">>> EMAIL SEND FAILED (Resend): %v\n", err)
			return fmt.Errorf("failed to send email via Resend: %w", err)
		}
		defer resp.Body.Close()

		respBody, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Printf(">>> EMAIL SERVICE: Failed to read response: %v\n", err)
			return fmt.Errorf("failed to read email response: %w", err)
		}

		if resp.StatusCode < 200 || resp.StatusCode >= 300 {
			fmt.Printf(">>> EMAIL SEND FAILED (Resend): Status %d, Response: %s\n", resp.StatusCode, string(respBody))
			return fmt.Errorf("email API returned status %d: %s", resp.StatusCode, string(respBody))
		}

		var resendResp ResendEmailResponse
		if err := json.Unmarshal(respBody, &resendResp); err != nil {
			fmt.Printf(">>> EMAIL SERVICE: Failed to parse response: %v\n", err)
			return fmt.Errorf("failed to parse email response: %w", err)
		}

		fmt.Printf(">>> EMAIL SENT SUCCESSFULLY via Resend to %s (ID: %s)\n", toEmail, resendResp.ID)
		return nil
	}

return fmt.Errorf("no email service (SMTP or Resend) is configured")
}

// CreateBroadcastNotifications creates in-app notifications for the given users
// Returns the count of successfully created notifications
func CreateBroadcastNotifications(users []models.User, subject, message string) int {
	if len(users) == 0 {
		return 0
	}
	notificationsCollection := database.GetCollection("notifications")
	ctx := context.Background()
	count := 0
	for _, user := range users {
		notification := models.Notification{
			UserID:    user.ID.Hex(),
			Type:      models.NotificationBroadcast,
			Title:     subject,
			Message:   message,
			Read:      false,
			CreatedAt: time.Now().UTC(),
		}
		if _, err := notificationsCollection.InsertOne(ctx, notification); err != nil {
			fmt.Printf(">>> FAILED to create notification for user %s: %v\n", user.ID.Hex(), err)
		} else {
			count++
		}
	}
	return count
}

// isValidSender checks if the sender email is valid for Resend.
func isValidSender(email string) bool {
	if email == "" {
		return false
	}

	if strings.HasSuffix(email, "@gmail.com") ||
		strings.HasSuffix(email, "@yahoo.com") ||
		strings.HasSuffix(email, "@hotmail.com") ||
		strings.HasSuffix(email, "@outlook.com") {
		return false
	}

	return true
}

// SendBroadcastEmail sends broadcast emails to target users and creates in-app notifications for all target users.
// sendToAll: if true, send to all users; if false, only users with email_notifications=true
// Returns stats about the broadcast; email send failures are logged but not treated as fatal errors.
func SendBroadcastEmail(subject, message, htmlContent, actionUrl string, sendToAll bool) (BroadcastStats, error) {
	var stats BroadcastStats
	config := GetEmailConfig()
	isTestMode := strings.ToLower(strings.TrimSpace(os.Getenv("BROADCAST_TEST_MODE"))) == "true"

	// Fetch target users
	usersCollection := database.GetCollection("users")
	ctx := context.Background()
	filter := bson.M{}
	if !sendToAll {
		filter = bson.M{"email_notifications": true}
	}
	cursor, err := usersCollection.Find(ctx, filter)
	if err != nil {
		return stats, fmt.Errorf("failed to fetch users: %w", err)
	}
	defer cursor.Close(ctx)

	var users []models.User
	if err := cursor.All(ctx, &users); err != nil {
		return stats, fmt.Errorf("failed to decode users: %w", err)
	}
	if len(users) == 0 {
		fmt.Printf(">>> BROADCAST: No users found matching criteria\n")
		return stats, nil
	}
	stats.TotalUsers = len(users)
	fmt.Printf(">>> BROADCAST: Targeting %d users\n", len(users))

	// Create in-app notifications for ALL target users (synchronously for reliability)
	stats.NotificationsCreated = CreateBroadcastNotifications(users, subject, message)

	// If email service is not configured, skip email sending
	if !IsEmailConfigured() {
		fmt.Printf(">>> EMAIL SERVICE: Not configured - skipping email sends. Notifications created: %d\n", stats.NotificationsCreated)
		return stats, nil
	}

	// Determine which users to send emails to
	var emailTargets []models.User
	if isTestMode {
		// Test mode: send only to test recipients
		testEmailsStr := os.Getenv("TEST_EMAIL_RECIPIENTS")
		if testEmailsStr == "" {
			// Default to admin users only
			for _, u := range users {
				if u.Role == "admin" || u.Role == "super_admin" {
					emailTargets = append(emailTargets, u)
				}
			}
			if len(emailTargets) == 0 && len(users) > 0 {
				// Fallback: first 2 users
				if len(users) > 2 {
					emailTargets = users[:2]
				} else {
					emailTargets = users
				}
			}
			fmt.Printf(">>> BROADCAST TEST MODE: No TEST_EMAIL_RECIPIENTS set, using admin/first users (%d recipients)\n", len(emailTargets))
		} else {
			// Parse the comma-separated test email list
			testEmails := strings.Split(testEmailsStr, ",")
			for _, u := range users {
				for _, testEmail := range testEmails {
					if strings.EqualFold(u.Email, strings.TrimSpace(testEmail)) {
						emailTargets = append(emailTargets, u)
						break
					}
				}
			}
			fmt.Printf(">>> BROADCAST TEST MODE: Sending to %d test recipients from TEST_EMAIL_RECIPIENTS list\n", len(emailTargets))
		}
	} else {
		// Production mode: all target users
		emailTargets = users
	}

	if len(emailTargets) == 0 {
		fmt.Printf(">>> BROADCAST: No email recipients to send to\n")
		return stats, nil
	}

	// Prepare from address
	fromName := strings.TrimSpace(config.FromName)
	if fromName == "" {
		fromName = "CODEMASTER"
	}
	fromEmail := strings.TrimSpace(config.FromEmail)
	if fromEmail == "" || !isValidSender(fromEmail) {
		return stats, fmt.Errorf("invalid FROM_EMAIL configuration")
	}
	from := fmt.Sprintf("%s <%s>", fromName, fromEmail)

	// Send emails concurrently with rate limiting (max 10 in-flight)
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, 10)
	var mu sync.Mutex

	for _, user := range emailTargets {
		wg.Add(1)
		go func(u models.User) {
			defer wg.Done()
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			if err := sendSingleEmail(u.Email, from, subject, message, htmlContent); err != nil {
				fmt.Printf(">>> FAILED to send email to %s: %v\n", u.Email, err)
				mu.Lock()
				stats.EmailsFailed++
				mu.Unlock()
			} else {
				mu.Lock()
				stats.EmailsSent++
				mu.Unlock()
			}
		}(user)
	}

	wg.Wait()

	fmt.Printf(">>> BROADCAST COMPLETE: Emails sent: %d, failed: %d; Notifications created: %d/%d\n",
		stats.EmailsSent, stats.EmailsFailed, stats.NotificationsCreated, stats.TotalUsers)

	return stats, nil
}

// sendSingleEmail sends a single email via SMTP or Resend
func sendSingleEmail(toEmail, from, subject, textBody, htmlBody string) error {
	config := GetEmailConfig()

	// OPTION 1: SMTP
	if config.SMTPHost != "" && config.SMTPUser != "" && config.SMTPPass != "" {
		fmt.Printf(">>> EMAIL SERVICE: Using SMTP (%s)\n", config.SMTPHost)

		port := strings.TrimSpace(config.SMTPPort)
		if port == "" {
			port = "587"
		}

		header := map[string]string{
			"From":         from,
			"To":           toEmail,
			"Subject":      subject,
			"MIME-Version": "1.0",
			"Content-Type": `text/html; charset="utf-8"`,
		}

		message := ""
		for k, v := range header {
			message += fmt.Sprintf("%s: %s\r\n", k, v)
		}
		message += "\r\n" + htmlBody

		auth := smtp.PlainAuth("", config.SMTPUser, config.SMTPPass, config.SMTPHost)
		err := smtp.SendMail(config.SMTPHost+":"+port, auth, config.SMTPUser, []string{toEmail}, []byte(message))
		if err != nil {
			return fmt.Errorf("failed to send email via SMTP: %w", err)
		}

		return nil
	}

	// OPTION 2: Resend API
	if config.ResendAPIKey != "" {
		fmt.Printf(">>> EMAIL SERVICE: Using Resend API\n")

		reqBody := ResendEmailRequest{
			From:    from,
			To:      []string{toEmail},
			Subject: subject,
			Text:    textBody,
			Html:    htmlBody,
		}

		jsonData, err := json.Marshal(reqBody)
		if err != nil {
			return fmt.Errorf("failed to prepare email request: %w", err)
		}

		req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(jsonData))
		if err != nil {
			return fmt.Errorf("failed to create email request: %w", err)
		}

		req.Header.Set("Authorization", "Bearer "+config.ResendAPIKey)
		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{
			Timeout: 15 * time.Second,
		}

		resp, err := client.Do(req)
		if err != nil {
			return fmt.Errorf("failed to send email via Resend: %w", err)
		}
		defer resp.Body.Close()

		respBody, err := io.ReadAll(resp.Body)
		if err != nil {
			return fmt.Errorf("failed to read email response: %w", err)
		}

		if resp.StatusCode < 200 || resp.StatusCode >= 300 {
			return fmt.Errorf("email API returned status %d: %s", resp.StatusCode, string(respBody))
		}

		return nil
	}

	return fmt.Errorf("no email service (SMTP or Resend) is configured")
}