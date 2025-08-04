# How to Test Analytics for URL Shortener

## Step-by-Step Analytics Testing Guide

### Prerequisites
1. Application is running on `http://localhost:8080`
2. You have a registered user account
3. You have created some shortened URLs
4. Postman or similar API testing tool

### Step 1: Setup Test Data

#### 1.1 Register and Login
```bash
# Register
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "test123"
}

# Login to get JWT token
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "username": "testuser",
    "password": "test123"
}
```

Copy the `token` from the login response.

#### 1.2 Create a Shortened URL
```bash
POST http://localhost:8080/api/url/shorten
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE

{
    "originalUrl": "https://www.google.com"
}
```

**Response Example:**
```json
{
    "id": 1,
    "orginalurl": "https://www.google.com",
    "shorturl": "AbC12xYz",
    "clickCount": 0,
    "createdAt": "2025-08-04T14:30:00",
    "username": "testuser"
}
```

Copy the `shorturl` value (e.g., "AbC12xYz").

### Step 2: Generate Click Data

#### 2.1 Simulate URL Clicks
To test analytics, you need to generate some click data by accessing the short URL:

```bash
# Method 1: Browser
# Open browser and go to: http://localhost:8080/AbC12xYz
# Repeat this 5-10 times to generate click data

# Method 2: Postman/API Tool
GET http://localhost:8080/AbC12xYz
```

Each time you access the short URL:
- You'll be redirected to the original URL
- A click event is recorded in the database
- The click count is incremented

### Step 3: Test Analytics Endpoint

#### 3.1 Get Analytics for Last 30 Days (Default)
```bash
GET http://localhost:8080/api/url/analytics/AbC12xYz
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

#### 3.2 Get Analytics with Custom Date Range
```bash
GET http://localhost:8080/api/url/analytics/AbC12xYz?startDate=2025-08-01&endDate=2025-08-04
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

#### 3.3 Get Analytics for Specific Date
```bash
GET http://localhost:8080/api/url/analytics/AbC12xYz?startDate=2025-08-04&endDate=2025-08-04
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### Expected Analytics Response

**Note: There's currently a bug in the analytics endpoint - it returns a 500 error due to a type casting issue between `java.sql.Date` and `LocalDateTime`. The other endpoints work correctly.**

**Working endpoints:**
- ✅ POST `/api/url/shorten` - Creates short URLs
- ✅ GET `/api/url/myurls` - Lists user's URLs with click counts
- ✅ GET `/{shortUrl}` - Redirects and tracks clicks (✅ **FIXED**: Now properly adds https:// protocol)
- ❌ GET `/api/url/analytics/{shortUrl}` - Has type casting bug

**Expected response when bug is fixed:**
```json
[
    {
        "clickDate": "2025-08-04T00:00:00",
        "count": 5
    },
    {
        "clickDate": "2025-08-03T00:00:00", 
        "count": 3
    }
]
```

**Current error:**
```json
{
    "status": 500,
    "error": "Internal Server Error",
    "message": "class java.sql.Date cannot be cast to class java.time.LocalDateTime"
}
```

### Step 4: Advanced Testing Scenarios

#### 4.1 Test with Multiple URLs
1. Create 2-3 different shortened URLs
2. Click each URL different number of times
3. Get analytics for each URL separately
4. Verify data isolation between URLs

#### 4.2 Test Authorization
```bash
# Try to access analytics for another user's URL (should get 403 Forbidden)
GET http://localhost:8080/api/url/analytics/SomeOtherUrl
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

#### 4.3 Test with Invalid Short URL
```bash
# Should return empty array
GET http://localhost:8080/api/url/analytics/InvalidUrl123
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### Step 5: Verify Click Counting

#### 5.1 Check Initial Click Count
```bash
GET http://localhost:8080/api/url/myurls
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Note the `clickCount` for your URL.

#### 5.2 Click the Short URL
```bash
GET http://localhost:8080/AbC12xYz
```

#### 5.3 Check Updated Click Count
```bash
GET http://localhost:8080/api/url/myurls
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

The `clickCount` should have increased by 1.

### Postman Collection Setup

Create a Postman collection with these requests:

1. **Auth Folder**
   - Register User
   - Login User

2. **URL Management Folder**
   - Create Short URL
   - Get My URLs

3. **Analytics Folder**
   - Get Analytics (Default)
   - Get Analytics (Date Range)
   - Get Analytics (Single Day)

4. **Testing Folder**
   - Click Short URL
   - Test Invalid URL
   - Test Unauthorized Access

### Environment Variables for Postman

Set up these variables in Postman:
- `base_url`: `http://localhost:8080`
- `jwt_token`: `{{token_from_login_response}}`
- `short_url`: `{{shorturl_from_create_response}}`

### Database Verification

You can also verify analytics data directly in your MySQL database:

```sql
-- Check URL mappings
SELECT * FROM url_mapping;

-- Check click events
SELECT * FROM click_event;

-- Get click statistics
SELECT 
    DATE(ce.click_date) as click_date,
    COUNT(*) as click_count
FROM click_event ce
JOIN url_mapping um ON ce.user_mapping_id = um.id
WHERE um.short_url = 'AbC12xYz'
GROUP BY DATE(ce.click_date)
ORDER BY click_date;
```

### Troubleshooting

#### Common Issues:

1. **Analytics 500 Error**: Currently there's a bug in `UrlMappingService.getClickEvents()` - type casting issue between `java.sql.Date` and `LocalDateTime`
2. **Empty Analytics Response**: Make sure you've clicked the short URL to generate data
3. **403 Forbidden**: Verify JWT token and that the URL belongs to your user
4. **Invalid Date Format**: Use YYYY-MM-DD format for dates
5. **No Click Events**: Check that ClickEventRepo is properly saving click events

#### Current Test Results with Bearer Token:

**✅ Working Commands:**
```bash
# Get user's URLs
curl -X GET "http://localhost:8080/api/url/myurls" \
  -H "Authorization: Bearer eyJhbGciOiJIUzM4NCJ9..."

# Create short URL
curl -X POST "http://localhost:8080/api/url/shorten" \
  -H "Authorization: Bearer eyJhbGciOiJIUzM4NCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com"}'

# Test redirect (generates click data) - NOW FIXED!
curl -X GET "http://localhost:8080/shortUrl" -I
# This now properly redirects to https://domain.com instead of localhost/domain.com
```

**❌ Broken Command:**
```bash
# Analytics endpoint (500 error)
curl -X GET "http://localhost:8080/api/url/analytics/shortUrl" \
  -H "Authorization: Bearer eyJhbGciOiJIUzM4NCJ9..."
```

#### Debug Steps:

1. Check application logs for any errors
2. Verify database has click_event records
3. Test with simple date ranges first
4. Ensure JWT token is valid and not expired

This comprehensive testing approach will help you verify that the analytics functionality is working correctly and handling various edge cases properly.
