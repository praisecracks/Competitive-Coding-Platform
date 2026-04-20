package routes

import (
	"codingplatform/controllers"
	"codingplatform/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	// Public routes
	r.POST("/signup", controllers.Register)
	r.POST("/login", controllers.Login)

	// Auth routes
	auth := r.Group("/auth")
	{
		auth.POST("/forgot-password", controllers.ForgotPassword)
		auth.POST("/reset-password", controllers.ResetPassword)
		auth.GET("/verify-reset-token", controllers.VerifyResetToken)
		auth.GET("/github/login", controllers.GitHubLogin)
		auth.GET("/github/callback", controllers.GitHubCallback)
	}

	// Challenge routes
	challenges := r.Group("/challenges")
	challenges.Use(middleware.OptionalAuthMiddleware())
	{
		challenges.GET("", controllers.GetChallenges)
		challenges.GET("/:id", controllers.GetChallengeByID)
		challenges.POST("/:id/open", middleware.AuthMiddleware(), controllers.MarkChallengeOpened)
	}

	// Protected routes
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/dashboard/stats", controllers.GetDashboardStats)
		protected.GET("/analytics", controllers.GetAnalytics)
		protected.POST("/dashboard/reset-stats", controllers.ResetStats)
		protected.GET("/profile", controllers.GetProfile)
		protected.PUT("/profile", controllers.UpdateProfile)
		protected.DELETE("/profile", controllers.DeleteAccount)
		protected.POST("/profile/avatar", controllers.UploadAvatar)
		protected.DELETE("/profile/avatar", controllers.DeleteAvatar)
		protected.POST("/profile/change-password", controllers.ChangePassword)
		protected.GET("/profile/referral-code", controllers.GetReferralCode)

		// Admin routes
		admin := protected.Group("/admin")
		admin.Use(middleware.AdminOnly())
		{
			admin.GET("/stats", controllers.GetAdminStats)
			admin.GET("/users", controllers.GetUsers)
			admin.GET("/challenges", controllers.GetAdminChallenges)
			admin.POST("/challenges", controllers.CreateChallenge)
			admin.PUT("/challenges/:id", controllers.UpdateChallenge)
			admin.DELETE("/challenges/:id", controllers.DeleteChallenge)
			admin.GET("/submissions", controllers.GetSubmissionsAudit)
			admin.GET("/reports", controllers.GetReports)
			admin.PUT("/reports/:id", controllers.ResolveReport)
			admin.GET("/feedback", controllers.GetFeedback)
			admin.DELETE("/feedback/:id", controllers.DeleteFeedback)

			// Super Admin routes
			super := admin.Group("/super")
			super.Use(middleware.SuperAdminOnly())
			{
				super.POST("/promote", controllers.PromoteUser)
				super.POST("/suspend", controllers.SuspendUser)
				super.POST("/create-admin", controllers.CreateAdmin)
				super.DELETE("/users/:id", controllers.DeleteUser)
			}
		}

		// Duo routes
		duo := protected.Group("/duo")
		{
			duo.GET("/pending-invites", controllers.GetPendingInvites)
			duo.POST("/invite", controllers.SendDuelInvite)
			duo.GET("/status/:duel_id", controllers.GetDuelStatus)
			duo.POST("/accept/:duel_id", controllers.AcceptDuelInvite)
			duo.POST("/decline/:duel_id", controllers.DeclineDuelInvite)
			duo.POST("/submit/:duel_id", controllers.SubmitDuel)
			duo.POST("/progress/:duel_id", controllers.UpdateLiveProgress)
		}

		// Notification routes
		notifications := protected.Group("/notifications")
		{
			notifications.GET("", controllers.GetNotifications)
			notifications.POST("/mark-read/:id", controllers.MarkNotificationRead)
			notifications.GET("/system", controllers.GetSystemNotifications)
		}

		// Submission routes
		protected.POST("/run", controllers.RunCode)
		protected.POST("/submit", controllers.SubmitCode)

		// Learning Progress routes
		learning := protected.Group("/learning")
		{
			learning.GET("/progress", controllers.GetLearningProgress)
			learning.PUT("/track-progress", controllers.UpdateTrackProgress)
			learning.POST("/streak", controllers.UpdateStreak)
			learning.POST("/journal", controllers.AddJournalEntry)
			learning.DELETE("/journal/:id", controllers.DeleteJournalEntry)
			learning.PUT("/legacy-progress", controllers.UpdateLegacyProgress)
		}
	}

	// Reports
	protected.POST("/report", controllers.SubmitReport)

	// Feedback (user can submit)
	protected.POST("/feedback", controllers.SubmitFeedback)

	// Leaderboard and Search
	r.GET("/leaderboard", controllers.GetLeaderboard)

	search := r.Group("/search")
	search.Use(middleware.OptionalAuthMiddleware())
	{
		search.GET("", controllers.GetSearch)
	}

	r.GET("/search/user/:id", controllers.GetUserByID)
	r.GET("/users/search", controllers.SearchUserByQuery)

	// News Proxy
	r.GET("/news-proxy", controllers.ProxyNews)
}
