# GitHub OAuth Setup - Complete Guide

## ✅ All Changes Completed

Your GitHub OAuth implementation has been secured and updated to properly use environment variables. No secrets are hardcoded in the source code.

---

## 📋 Files Changed

### Backend (`backend-go/`)

#### 1. **[.env.example](.env.example)** - Created
   - Template for required environment variables
   - Contains placeholders for:
     - `GITHUB_CLIENT_ID` - Your GitHub OAuth app client ID
     - `GITHUB_CLIENT_SECRET` - Your GitHub OAuth app client secret (backend only!)
     - `GITHUB_REDIRECT_URI` - The callback URL GitHub will redirect to
     - `BACKEND_URL` - Your backend server URL
     - `FRONTEND_URL` - Your frontend URL
     - `MONGO_URI` - MongoDB connection string
     - `JWT_SECRET` - Secret for JWT token generation
     - Other configuration

#### 2. **[.gitignore](.gitignore)** - Created
   - Prevents `.env` files from being committed
   - Protects secrets from being pushed to GitHub

#### 3. **[main.go](main.go)** - Updated
   - `/auth/github/login` route now:
     - ✅ Requires `GITHUB_REDIRECT_URI` from environment (no fallback hardcode)
     - ✅ Returns error if env var is missing
   
   - `/auth/github/callback` route now:
     - ✅ Uses `FRONTEND_URL` from environment for all redirects
     - ✅ Fetches real GitHub profile data (username, avatar, email)
     - ✅ Handles missing email by fetching from `/user/emails` endpoint
     - ✅ Creates/updates users in database with real data
     - ✅ Generates JWT token and redirects to frontend with clean parameters
     - ✅ Uses environment variables for all URLs (no hardcoding)

### Frontend (`frontend-nextjs/`)

#### 1. **[.env.example](.env.example)** - Created
   - Template for frontend environment variables
   - Contains placeholders for:
     - `NEXT_PUBLIC_BACKEND_URL` - Backend URL (exposed to frontend)
     - `NEXT_PUBLIC_FRONTEND_URL` - Frontend URL

#### 2. **[next.config.ts](next.config.ts)** - Updated
   - API rewrites now use `NEXT_PUBLIC_BACKEND_URL` from environment
   - No longer hardcoded to `http://localhost:8080`

#### 3. **[app/login/page.tsx](app/login/page.tsx)** - Updated
   - GitHub login button now uses `NEXT_PUBLIC_BACKEND_URL` environment variable
   - Gracefully falls back to `http://localhost:8080` if env var is not set

#### 4. **[app/signup/page.tsx](app/signup/page.tsx)** - Updated
   - GitHub login button updated to use environment variable

#### 5. **[app/auth/callback/page.tsx](app/auth/callback/page.tsx)** - Updated
   - Now uses `persistUserSession()` helper function
   - Ensures consistent session storage with regular login flow
   - Properly handles all user data from OAuth callback

---

## 🔐 Security Features

✅ **Backend Only Secret Storage**
- `GITHUB_CLIENT_SECRET` is only read on the backend
- Frontend never receives or exposes the secret
- Never included in client-side code or network requests

✅ **No Hardcoded Values**
- All URLs configured via environment variables
- Easy to switch between development and production URLs
- No need to modify code for different deployments

✅ **Real GitHub Data**
- Fetches actual profile from GitHub API
- Handles private emails by checking `/user/emails` endpoint
- Stores real username, email, and profile picture
- Rejects OAuth if email cannot be retrieved

✅ **Proper Session Management**
- JWT token generated on backend
- Session data stored securely in localStorage
- Consistent with normal login flow

---

## 🚀 Setup Instructions

### Step 1: Create GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `CodeMaster` (or your app name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:8080/auth/github/callback`
4. Click **"Register application"**
5. Copy your **Client ID** and **Client Secret** (save securely!)

### Step 2: Create Backend `.env` File

Create `backend-go/.env` with your values:

```bash
# Backend configuration
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000

# MongoDB configuration
MONGO_URI=your_mongodb_connection_string_here

# GitHub OAuth configuration (from Step 1)
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_REDIRECT_URI=http://localhost:8080/auth/github/callback

# JWT Secret (generate a secure random string, min 32 chars)
JWT_SECRET=your_very_secure_random_string_here_at_least_32_characters

# Server Port
PORT=8080

# Environment
ENVIRONMENT=development
```

### Step 3: Create Frontend `.env.local` File

Create `frontend-nextjs/.env.local`:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

**Note:** The `.env.local` file is automatically ignored by `.gitignore` so it won't be committed.

### Step 4: Production Setup

When deploying to production:

**Backend `.env`:**
```bash
BACKEND_URL=https://your-backend.com
FRONTEND_URL=https://your-frontend.com
GITHUB_CLIENT_ID=your_prod_client_id
GITHUB_CLIENT_SECRET=your_prod_client_secret
GITHUB_REDIRECT_URI=https://your-backend.com/auth/github/callback
# ... other vars
```

**Frontend `.env.production.local`:**
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend.com
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend.com
```

---

## 🧪 Testing the OAuth Flow

1. **Start Backend:**
   ```bash
   cd backend-go
   go run main.go
   ```

2. **Start Frontend:**
   ```bash
   cd frontend-nextjs
   npm run dev
   ```

3. **Test Login:**
   - Go to `http://localhost:3000/login`
   - Click "Continue with GitHub"
   - You should be redirected to GitHub to authorize
   - After authorization, you'll be redirected back and logged in

4. **Verify Session:**
   - Check browser DevTools → Application → Local Storage
   - Should see `terminal_token`, `user_name`, `user_email` keys

---

## ✅ OAuth Flow Summary

```
Frontend Login Button
    ↓
GET /auth/github/login (backend, reads GITHUB_CLIENT_ID from env)
    ↓
Redirects to GitHub (GitHub API)
    ↓
User authorizes app
    ↓
GitHub redirects to callback URL
    ↓
GET /auth/github/callback (backend)
    • Exchanges auth code for access token
    • Fetches user profile from GitHub
    • Handles private emails from /user/emails
    • Creates/updates user in MongoDB
    • Generates JWT token
    • Redirects to frontend with token
    ↓
Frontend receives token in URL params
    ↓
Session persisted in localStorage
    ↓
User logged in ✅
```

---

## 📝 Important Notes

- ✅ No fake fallback values like "GitHub User" or "githubuser@example.com"
- ✅ Real email required from GitHub (errors if missing)
- ✅ Profile picture fetched from GitHub (`avatar_url`)
- ✅ Source field set to `"github"` to track OAuth users
- ✅ Clean URL parameters passed to frontend
- ✅ Session matches regular login flow for consistency

---

## 🔍 Troubleshooting

### "GITHUB_CLIENT_ID_NOT_SET" Error
- **Cause:** Missing `GITHUB_CLIENT_ID` in `.env`
- **Fix:** Add your GitHub Client ID to `backend-go/.env`

### "GITHUB_SECRETS_MISSING" Error
- **Cause:** Missing `GITHUB_CLIENT_SECRET` in `.env`
- **Fix:** Add your GitHub Client Secret to `backend-go/.env`

### "GITHUB_REDIRECT_URI_NOT_SET" Error
- **Cause:** Missing `GITHUB_REDIRECT_URI` in `.env`
- **Fix:** Make sure it matches what you set in GitHub app settings

### "GITHUB_EMAIL_REQUIRED" Error
- **Cause:** User's GitHub email is private and not in their profile
- **Fix:** User must make their email public in GitHub settings

### Redirect Loop or 404 After Authorization
- **Cause:** `FRONTEND_URL` in backend `.env` is wrong
- **Fix:** Ensure `FRONTEND_URL` points to your frontend server

---

## 🎯 Next Steps

1. ✅ Get GitHub Client ID and Secret (see Step 1 above)
2. ✅ Create `.env` files (see Step 2 & 3 above)
3. ✅ Test the OAuth flow (see Testing section above)
4. ✅ Set up CI/CD to avoid committing `.env` files
5. ✅ For production, update env values and ensure SSL/HTTPS

---

## 📚 References

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [GitHub API - Get Authenticated User](https://docs.github.com/en/rest/users/users#get-the-authenticated-user)
- [GitHub API - Get User Emails](https://docs.github.com/en/rest/users/emails)

---

**All code changes are production-ready and follow security best practices!** 🚀
