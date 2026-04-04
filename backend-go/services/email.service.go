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

	subject := "Reset your CODEMASTER password"

	textBody := fmt.Sprintf(`Hello,

We received a request to reset the password for your CODEMASTER account.

Reset your password using the secure link below:
%s

This link expires in 1 hour.

If you did not request a password reset, you can safely ignore this email.

Best regards,
The CODEMASTER Team`, resetLink)

	logoHTML := fmt.Sprintf(
		`<div style="font-size:30px;font-weight:800;letter-spacing:-0.03em;color:#2563eb;">%s</div>`,
		fromName,
	)

	if strings.TrimSpace(config.AppLogoURL) != "" {
		logoHTML = fmt.Sprintf(
			`<img src="%s" alt="%s" style="display:block;margin:0 auto;max-width:180px;height:auto;">`,
			config.AppLogoURL,
			fromName,
		)
	}

	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
	<div style="width:100%%;background-color:#f4f7fb;padding:32px 16px;">
		<div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
			
			<div style="background:linear-gradient(135deg,#020617 0%%,#111827 100%%);padding:28px 24px;text-align:center;">
				%s
			</div>

			<div style="padding:40px 32px 24px 32px;">
				<div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#eef2ff;color:#4338ca;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:18px;">
					Security Notice
				</div>

				<h1 style="margin:0 0 14px 0;font-size:30px;line-height:1.2;font-weight:800;color:#111827;">
					Reset your password
				</h1>

				<p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#4b5563;">
					Hello,
				</p>

				<p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#4b5563;">
					We received a request to reset the password for your CODEMASTER account. Click the secure button below to continue.
				</p>

				<div style="margin:32px 0;text-align:center;">
					<a href="%%s" style="display:inline-block;background:linear-gradient(90deg,#111827 0%%,#000000 100%%);color:#ffffff !important;text-decoration:none;padding:15px 28px;border-radius:12px;font-size:16px;font-weight:700;letter-spacing:0.01em;box-shadow:0 8px 20px rgba(0,0,0,0.15);">
						Reset Password
					</a>
				</div>

				<div style="margin:0 0 18px 0;padding:16px 18px;border-radius:14px;background:#f9fafb;border:1px solid #e5e7eb;">
					<p style="margin:0 0 8px 0;font-size:13px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:0.04em;">
						Direct link
					</p>
					<p style="margin:0;font-size:14px;line-height:1.7;word-break:break-all;">
						<a href="%%s" style="color:#2563eb;text-decoration:none;">%%s</a>
					</p>
				</div>

				<p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#4b5563;">
					This password reset link will expire in <strong>1 hour</strong> for your security.
				</p>

				<p style="margin:0;font-size:15px;line-height:1.7;color:#4b5563;">
					If you did not request this, you can safely ignore this email. Your account will remain secure.
				</p>
			</div>

			<div style="padding:24px 32px 32px 32px;border-top:1px solid #f3f4f6;text-align:center;background:#ffffff;">
				<p style="margin:0 0 8px 0;font-size:13px;color:#9ca3af;">
					© 2026 CODEMASTER. All rights reserved.
				</p>
				<p style="margin:0;font-size:13px;color:#9ca3af;">
					Train smarter. Solve like a pro.
				</p>
			</div>
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

		fmt.Printf(">>> RESEND RESPONSE STATUS: %d\n", resp.StatusCode)

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