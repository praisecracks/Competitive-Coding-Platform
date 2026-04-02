package controllers

import (
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// ProxyNews fetches news from external APIs to avoid CORS issues
func ProxyNews(c *gin.Context) {
	source := c.Query("source")
	if source == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "SOURCE_REQUIRED"})
		return
	}

	var targetURL string
	switch source {
	case "github":
		targetURL = "https://api.github.com/search/repositories?q=stars:>100&sort=stars&order=desc&per_page=8"
	case "devto":
		targetURL = "https://dev.to/api/articles?tag=tech&top=7&per_page=8"
	case "hackernews_ids":
		targetURL = "https://hacker-news.firebaseio.com/v0/topstories.json"
	case "hackernews_item":
		id := c.Query("id")
		if id == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID_REQUIRED_FOR_HN_ITEM"})
			return
		}
		targetURL = fmt.Sprintf("https://hacker-news.firebaseio.com/v0/item/%s.json", id)
	case "reddit":
		targetURL = "https://www.reddit.com/r/technology/hot.json?limit=8"
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "INVALID_SOURCE"})
		return
	}

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	req, err := http.NewRequest("GET", targetURL, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FAILED_TO_CREATE_REQUEST"})
		return
	}

	// Add User-Agent for GitHub and Reddit APIs
	req.Header.Set("User-Agent", "CodeMaster-App/1.0")

	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "EXTERNAL_API_UNAVAILABLE"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "FAILED_TO_READ_RESPONSE"})
		return
	}

	// Forward the content type and status code
	c.Header("Content-Type", resp.Header.Get("Content-Type"))
	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}
