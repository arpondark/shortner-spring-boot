# Login/Registration Debug Guide

## Issue: Login and Registration Failing

### ✅ Backend Status
- Backend is running on `http://localhost:8080`
- Login endpoint is accessible via curl
- Test credentials `john_doe`/`password123` work via direct API call

### ❌ Frontend Issue
The frontend is likely encountering a CORS (Cross-Origin Resource Sharing) issue when trying to communicate with the backend.

## Quick Fix Solutions:

### 1. **Test the Connection**
Visit: `http://localhost:3000/debug` to see the connection status.

### 2. **Backend CORS Configuration**
The Spring Boot backend needs CORS configured to allow requests from `http://localhost:3000`.

Add this to your Spring Boot application:

```java
@Configuration
@EnableWebSecurity
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 3. **Test Login with Pre-filled Credentials**
1. Go to: `http://localhost:3000/login`
2. The form should be pre-filled with `john_doe`/`password123`
3. Click "Sign in"
4. Check browser console for error details

### 4. **Browser Console Debugging**
Open browser Developer Tools (F12) and check the Console tab for error messages when attempting login.

## Test Pages Created:
- `/test-auth` - Authentication testing interface
- `/debug` - Connection debugging
- `/login` - Enhanced with better error handling

## Expected Behavior:
✅ Successful login should:
1. Show "Login successful!" toast
2. Redirect to dashboard (`/`)
3. Store JWT token in cookies
4. Show user interface with navigation

## Common Error Messages:
- **"Network error"** = CORS or server connection issue
- **"Invalid username or password"** = Wrong credentials
- **"Login failed"** = Generic error (check console for details)

## Verification Steps:
1. Backend running on port 8080 ✅
2. Frontend running on port 3000 ✅  
3. CORS configured ❌ (likely missing)
4. Environment variables set ✅
