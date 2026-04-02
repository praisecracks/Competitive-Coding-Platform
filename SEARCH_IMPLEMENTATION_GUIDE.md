# Global Header Search Implementation Guide

## ✅ Completed Frontend Implementation

Three files have been created/updated:

### 1. **lib/search.ts** ✅ (Created)
- Search utility functions with debounce
- API integration logic
- Type definitions for search results
- Helper functions (initials, text highlighting)

### 2. **components/SearchBar.tsx** ✅ (Created)
- Reusable search input component
- Dropdown results with grouped sections (Users, Challenges)
- Keyboard navigation (Escape to close)
- Click outside to close
- Loading, empty, and error states
- Responsive design with SaaS styling

### 3. **components/Header.tsx** ✅ (Updated)
- Imported SearchBar component
- Added search bar to header layout (hidden on dashboard, only for logged-in users)
- Maintains existing layout and functionality

---

## 🔧 Backend Implementation Required

### Step 1: Search Controller ✅ (Already Created)

File: `backend-go/controllers/search.controller.go` ✅ (Complete)

This file contains:
- `GetSearchHandler()` - Main handler function
- `searchUsers()` - Search users by username
- `searchChallenges()` - Search challenges by title, category, tags
- Type definitions for request/response

---

### Step 2: Add Route to main.go (REQUIRED)

**Location:** In `backend-go/main.go`, find the `protected` routes section (around line 362)

**Add this line after the leaderboard route:**

```go
protected.GET(
    "/search",
    controllers.GetSearchHandler(usersCollection, challengesCollection),
)
```

**Full Context Example:**
```go
// Around line 660-670 in main.go
protected.GET(
    "/leaderboard",
    controllers.GetLeaderboardHandler(usersCollection, submissionsCollection, challengesCollection),
)

// ADD THIS:
protected.GET(
    "/search",
    controllers.GetSearchHandler(usersCollection, challengesCollection),
)

protected.POST("/run", func(c *gin.Context) {
    // ... existing code
})
```

---

## 🚀 Testing the Implementation

### 1. **Frontend Testing:**
```bash
cd frontend-nextjs
npm run dev
# Navigate to dashboard
# Type in the search bar at the top
# You should see:
# - Loading spinner while typing
# - Dropdown with Users and Challenges sections
# - Click user to navigate to leaderboard
# - Click challenge to navigate to challenge details
# - Press Escape to close
# - Click outside to close
```

### 2. **Backend Testing:**
```bash
cd backend-go
go run main.go

# Test with curl:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8080/search?q=javascript"

# Response should be:
{
  "users": [
    {
      "id": "...",
      "username": "...",
      "rank": "...",
      "profile_pic": "..."
    }
  ],
  "challenges": [
    {
      "id": "...",
      "title": "...",
      "difficulty": "Easy",
      "category": "...",
      "tags": [...]
    }
  ]
}
```

---

## 📋 Features Implemented

### Frontend:
✅ Search input with debounce (300ms)
✅ Dropdown with grouped results (Users, Challenges)
✅ Loading state
✅ Empty state
✅ Error handling
✅ Click outside to close
✅ Keyboard shortcuts (Escape)
✅ Case-insensitive search
✅ Results limit (5 per category)
✅ Responsive design
✅ SaaS-style UI matching your theme

### Backend:
✅ User search by username
✅ Challenge search by title
✅ Challenge search by category
✅ Challenge search by tags
✅ Case-insensitive matching
✅ Result limiting for performance
✅ Error handling
✅ Token-based authentication

---

## 🔍 API Endpoint Details

**Endpoint:** `GET /search?q={query}`

**Authentication:** Required (Protected route)

**Query Parameters:**
- `q` (required): Search query string (max 100 characters)

**Response:**
```typescript
{
  "users": [
    {
      "id": string,
      "username": string,
      "rank": string,
      "profile_pic": string
    }
  ],
  "challenges": [
    {
      "id": string,
      "title": string,
      "difficulty": string,
      "category": string,
      "tags": string[]
    }
  ]
}
```

---

## ⚙️ Configuration

### Frontend Debounce (app/lib/search.ts):
```typescript
performSearch(value, 300) // 300ms delay
```
Adjust in `SearchBar.tsx` line ~45 if needed.

### Backend Result Limit (backend-go/controllers/search.controller.go):
```go
opts := options.Find().SetLimit(5)
```
Change `5` to return more/fewer results.

### Query Length Limit:
```go
if len(query) > 100 {
    query = query[:100]
}
```

---

## 🎨 Customization

### Change Search Colors:
File: `app/components/SearchBar.tsx`
- Lines with `text-pink-500`, `bg-white/5`, etc. are color values
- Adjust Tailwind classes to match your theme

### Change Result Limit Per Category:
File: `backend-go/controllers/search.controller.go`
- Line ~104: `opts := options.Find().SetLimit(5)`

### Change Result Grouping Order:
File: `app/components/SearchBar.tsx`
- Lines 137-200: Reorder the Users/Challenges sections

---

##  ❌ Troubleshooting

### Search bar doesn't appear:
- Verify you're logged in
- Check that you're not on a dashboard page (`/dashboard/*`)
- Verify `SearchBar` import in Header.tsx

### Search returns empty:
- Check backend collections have data
- Verify MongoDB connection
- Check query parameter is being sent

### Results very slow:
- Add database indexes on `username` and `title` fields
- Reduce result limit in backend
- Check MongoDB query performance

### Authentication errors:
- Verify token is valid
- Check `AuthMiddleware()` is properly configured
- Ensure token is in localStorage

---

## 📝 Database Indexes (Recommended)

For better performance, add these indexes to MongoDB:

```javascript
// In MongoDB console
db.users.createIndex({ "username": 1 })
db.challenges.createIndex({ "title": 1 })
db.challenges.createIndex({ "category": 1 })
db.challenges.createIndex({ "tags": 1 })
```

---

## ✅ Checklist

- [ ] Copied `SearchBar.tsx` to `app/components/`
- [ ] Copied `search.ts` to `app/lib/`
- [ ] Updated `app/components/Header.tsx` with import and usage
- [ ] Copied `search.controller.go` to `backend-go/controllers/`
- [ ] Added search route to `backend-go/main.go`
- [ ] Tested frontend search functionality
- [ ] Tested backend search endpoint with token
- [ ] Tested navigation on user/challenge click
- [ ] Verified all UI states work (loading, empty, error)

---

## 🎯 Next Steps (Optional)

1. **Add search history**: Store recent searches in localStorage
2. **Add filters**: Allow filtering by difficulty, category
3. **Add trending**: Show trending searches when empty
4. **Add autocomplete**: Suggest queries as user types
5. **Add advanced search**: Support filters, operators
6. **Add analytics**: Track popular searches

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify collections exist in MongoDB
4. Check authentication token is valid
5. Verify collections have `_id`, `username`/`title` fields

