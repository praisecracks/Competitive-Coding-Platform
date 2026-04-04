package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/smtp"
	"os"
	"strings"
	"time"
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
	// Configured if either Resend OR SMTP is set up
	return config.ResendAPIKey != "" || (config.SMTPHost != "" && config.SMTPUser != "" && config.SMTPPass != "")
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

// SendPasswordResetEmail sends a password reset email to the user using Resend API
func SendPasswordResetEmail(toEmail, resetLink string) error {
	config := GetEmailConfig()

	fmt.Printf(">>> EMAIL SERVICE: Attempting to send password reset email to %s\n", toEmail)

	if !IsEmailConfigured() {
		// Fallback to mock email if not configured
		fmt.Printf(">>> MOCK EMAIL (Resend API not configured):\nTo: %s\nSubject: CODEMASTER Password Reset\nBody: Click here to reset your password: %s\n\n", toEmail, resetLink)
		return nil
	}

	fromName := config.FromName
	if fromName == "" {
		fromName = "CODEMASTER"
	}

	fromEmail := config.FromEmail
	// PRODUCTION TIP: Resend requires a verified domain to send emails in production.
	// If you're using a free tier without a domain, you MUST use 'onboarding@resend.dev'.
	if fromEmail == "" || !isValidSender(fromEmail) {
		fmt.Printf(">>> EMAIL SERVICE WARNING: Invalid sender '%s'. Falling back to 'onboarding@resend.dev'\n", fromEmail)
		fromEmail = "onboarding@resend.dev"
	}

	subject := "Reset your CODEMASTER password"

	// Plain text fallback
	textBody := fmt.Sprintf(`Hello,

You requested a password reset for your CODEMASTER account.

Click the link below to reset your password:
%s

This link will expire in 1 hour.

If you did not request this reset, please ignore this email.

Best regards,
The CODEMASTER Team`, resetLink)

	// Professional HTML template
	logoHTML := fmt.Sprintf(`<a href="#" class="logo">%s</a>`, fromName)
	if config.AppLogoURL != "" {
		logoHTML = fmt.Sprintf(`<img src="%s" alt="%s" height="40" style="display: block; margin: 0 auto;">`, config.AppLogoURL, fromName)
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
        .button { background-color: #000; color: #fff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.2s; }
        .footer { font-size: 13px; color: #9ca3af; text-align: center; border-top: 1px solid #f1f1f1; padding-top: 24px; }
        .link { color: #d946ef; text-decoration: none; }
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

	// Prepare final sender identity
	from := fmt.Sprintf("%s <%s>", fromName, fromEmail)

	// --- OPTION 1: SMTP (Gmail/Personal Email) ---
	if config.SMTPHost != "" && config.SMTPUser != "" && config.SMTPPass != "" {
		fmt.Printf(">>> EMAIL SERVICE: Using SMTP (%s)\n", config.SMTPHost)

		// Gmail SMTP often requires 587. Default to 587 if not set.
		port := config.SMTPPort
		if port == "" {
			port = "587"
		}

		// SMTP Headers
		header := make(map[string]string)
		header["From"] = from
		header["To"] = toEmail
		header["Subject"] = subject
		header["MIME-Version"] = "1.0"
		header["Content-Type"] = "text/html; charset=\"utf-8\""

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

	// --- OPTION 2: Resend API (SaaS Default) ---
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

		// Send request to Resend API
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

		// Read response body
		respBody, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Printf(">>> EMAIL SERVICE: Failed to read response: %v\n", err)
			return fmt.Errorf("failed to read email response: %w", err)
		}

		// Check response status
		if resp.StatusCode < 200 || resp.StatusCode >= 300 {
			fmt.Printf(">>> EMAIL SEND FAILED (Resend): Status %d, Response: %s\n", resp.StatusCode, string(respBody))
			return fmt.Errorf("email API returned status %d: %s", resp.StatusCode, string(respBody))
		}

		// Parse response
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

// isValidSender checks if the sender email is valid for Resend.
// In a real production app, this would check if the domain is verified.
func isValidSender(email string) bool {
	if email == "" {
		return false
	}
	// Resend's free tier restricted domains (cannot send FROM these without verification)
	// This is a simple check; in production, you'd verify against your own domain.
	if strings.HasSuffix(email, "@gmail.com") ||
		strings.HasSuffix(email, "@yahoo.com") ||
		strings.HasSuffix(email, "@hotmail.com") ||
		strings.HasSuffix(email, "@outlook.com") {
		return false
	}
	return true
}
