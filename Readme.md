# URL Shortener API

A Spring Boot-based URL shortener service with JWT authentication and user management capabilities.

## Features

- User registration and authentication
- JWT-based security
- URL shortening functionality
- Click tracking and analytics
- MySQL database integration
- RESTful API endpoints

## Technologies Used

- **Backend:** Spring Boot 3.5.4
- **Security:** Spring Security with JWT
- **Database:** MySQL 8.0
- **ORM:** Hibernate/JPA
- **Build Tool:** Maven
- **Java Version:** 21

## Project Structure

```
src/
├── main/
│   ├── java/com/arpon007/shortner/
│   │   ├── ShortnerApplication.java          # Main application class
│   │   ├── config/
│   │   │   └── WebSecurityConfig.java        # Security configuration
│   │   ├── controller/
│   │   │   ├── AuthController.java           # Authentication endpoints
│   │   │   └── UrlMappingController.java     # URL shortening endpoints
│   │   ├── dtos/
│   │   │   ├── LoginRequest.java             # Login request DTO
│   │   │   ├── RegisterRequest.java          # Registration request DTO
│   │   │   └── UrlMappingDTO.java            # URL mapping response DTO
│   │   ├── jwt/
│   │   │   ├── JwtAuthenticationResponse.java
│   │   │   ├── jwtAuthFilter.java            # JWT filter
│   │   │   └── JwtUtils.java                 # JWT utilities
│   │   ├── models/
│   │   │   ├── ClickEvent.java               # Click tracking entity
│   │   │   ├── UrlMapping.java               # URL mapping entity
│   │   │   └── User.java                     # User entity
│   │   ├── repo/
│   │   │   ├── UserRepository.java           # User repository
│   │   │   └── UrlMappingRepo.java           # URL mapping repository
│   │   └── Service/
│   │       ├── UserDetailsImpl.java
│   │       ├── UserDetailsServiceImpl.java
│   │       ├── UserService.java              # User service layer
│   │       └── UrlMappingService.java        # URL mapping service
│   └── resources/
│       └── application.properties            # Configuration file
```

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd shortner
```

### 2. Database Setup
1. Install MySQL and create a database:
```sql
CREATE DATABASE url_shortner;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/url_shortner
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build and Run
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Documentation

### Base URL
```
http://localhost:8080
```

### Authentication Endpoints

#### 1. Register User
- **Endpoint:** `POST /api/auth/public/register`
- **Description:** Register a new user
- **Headers:** 
  - Content-Type: `application/json`

**Request Body:**
```json
{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": ["USER"]
}
```

**Response:**
```json
"User registered successfully"
```

#### 2. Login User
- **Endpoint:** `POST /api/auth/public/login`
- **Description:** Authenticate user and receive JWT token
- **Headers:** 
  - Content-Type: `application/json`

**Request Body:**
```json
{
    "username": "john_doe",
    "password": "password123"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer"
}
```

### URL Shortening Endpoints

#### 1. Shorten URL
- **Endpoint:** `POST /api/url/shorten`
- **Description:** Create a shortened URL for a given original URL
- **Headers:** 
  - Content-Type: `application/json`
  - Authorization: `Bearer <jwt-token>`
- **Authentication:** Required (JWT Token)

**Request Body:**
```json
{
    "originalUrl": "https://www.example.com/very/long/url/that/needs/to/be/shortened"
}
```

**Response:**
```json
{
    "id": 1,
    "orginalurl": "https://www.example.com/very/long/url/that/needs/to/be/shortened",
    "shorturl": "AbC12Xy8",
    "clickCount": 0,
    "createdAt": "2025-08-04T10:30:00",
    "username": "john_doe"
}
```

## Testing with Postman

### 1. Import Collection
Create a new Postman collection called "URL Shortener API"

### 2. User Registration Test

**Request Details:**
- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/public/register`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
      "username": "testuser",
      "email": "test@example.com",
      "password": "test123",
      "role": ["USER"]
  }
  ```

**Expected Response:**
- **Status:** 200 OK
- **Body:** `"User registered successfully"`

### 3. User Login Test

**Request Details:**
- **Method:** POST
- **URL:** `http://localhost:8080/api/auth/public/login`
- **Headers:** 
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
      "username": "testuser",
      "password": "test123"
  }
  ```

**Expected Response:**
- **Status:** 200 OK
- **Body:** 
  ```json
  {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTYzOTU3NjAwMCwiZXhwIjoxNjM5NTc5NjAwfQ.example_jwt_token_signature",
      "tokenType": "Bearer"
  }
  ```

### 4. URL Shortening Test

#### Step 1: Get JWT Token
Before testing URL shortening, you must first obtain a JWT token by logging in (follow step 3 above).

#### Step 2: Setup Authorization in Postman
1. **Copy the JWT token** from the login response
2. **In Postman**, go to the **Authorization** tab of your shortening request
3. **Select Type:** `Bearer Token`
4. **Paste the token** in the Token field

#### Step 3: Create Short URL Request
**Request Details:**
- **Method:** POST
- **URL:** `http://localhost:8080/api/url/shorten`
- **Headers:** 
  ```
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Body (raw JSON):**
  ```json
  {
      "originalUrl": "https://www.google.com"
  }
  ```

**Expected Response:**
- **Status:** 200 OK
- **Body:** 
  ```json
  {
      "id": 1,
      "orginalurl": "https://www.google.com",
      "shorturl": "AbC12Xy8",
      "clickCount": 0,
      "createdAt": "2025-08-04T10:30:00",
      "username": "testuser"
  }
  ```

#### Step 4: Alternative - Using Headers Tab
Instead of Authorization tab, you can manually add the header:
- **Key:** `Authorization`
- **Value:** `Bearer your_jwt_token_here`

### 5. Test Cases

#### Valid Registration
```json
{
    "username": "alice",
    "email": "alice@gmail.com",
    "password": "securePass123",
    "role": ["USER"]
}
```

#### Admin User Registration
```json
{
    "username": "admin",
    "email": "admin@company.com",
    "password": "adminPass123",
    "role": ["USER", "ADMIN"]
}
```

#### Valid Login
```json
{
    "username": "alice",
    "password": "securePass123"
}
```

#### Login with Different User
```json
{
    "username": "admin",
    "password": "adminPass123"
}
```

#### Valid URL Shortening
```json
{
    "originalUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

#### Different URL Examples
```json
{
    "originalUrl": "https://github.com/arpondark/shortner-spring-boot"
}
```

```json
{
    "originalUrl": "https://docs.spring.io/spring-boot/docs/current/reference/html/"
}
```

### 6. Error Testing

#### Registration Errors

##### Invalid Email Format
```json
{
    "username": "testuser",
    "email": "invalid-email",
    "password": "test123",
    "role": ["USER"]
}
```

##### Missing Required Fields
```json
{
    "username": "testuser",
    "email": "test@example.com"
}
```

#### Login Errors

##### Invalid Credentials
```json
{
    "username": "nonexistent",
    "password": "wrongpassword"
}
```

##### Missing Password
```json
{
    "username": "testuser"
}
```

##### Empty Credentials
```json
{
    "username": "",
    "password": ""
}
```

#### URL Shortening Errors

##### Missing JWT Token
Try making the request without Authorization header:
- **Expected:** 401 Unauthorized

##### Invalid/Expired JWT Token
```
Authorization: Bearer invalid_token_here
```
- **Expected:** 401 Unauthorized

##### Missing Original URL
```json
{
    "someOtherField": "value"
}
```

##### Invalid URL Format
```json
{
    "originalUrl": "not-a-valid-url"
}
```

##### Empty Original URL
```json
{
    "originalUrl": ""
}
```

## Using JWT Token for Protected Endpoints

After successful login, save the JWT token from the response and include it in subsequent requests to protected endpoints:

**Headers for Protected Endpoints:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Postman JWT Token Setup Guide

#### Method 1: Using Authorization Tab (Recommended)
1. **Login first** using the `/api/auth/public/login` endpoint
2. **Copy the token** from the response (without "Bearer" prefix)
3. **Open your URL shortening request** in Postman
4. **Go to Authorization tab**
5. **Select Type:** Bearer Token
6. **Paste token** in the Token field
7. **Send the request**

#### Method 2: Using Headers Tab
1. **Go to Headers tab** in your request
2. **Add a new header:**
   - **Key:** `Authorization`
   - **Value:** `Bearer your_jwt_token_here`
3. **Send the request**

### Example cURL Commands

**Get JWT Token:**
```bash
curl -X POST http://localhost:8080/api/auth/public/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "test123"}'
```

**Shorten URL:**
```bash
curl -X POST http://localhost:8080/api/url/shorten \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.google.com"}'
```

### Complete Workflow Example

1. **Register a user:**
```bash
curl -X POST http://localhost:8080/api/auth/public/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com", 
    "password": "password123",
    "role": ["USER"]
  }'
```

2. **Login to get JWT token:**
```bash
curl -X POST http://localhost:8080/api/auth/public/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "password123"}'
```

3. **Use token to shorten URL:**
```bash
curl -X POST http://localhost:8080/api/url/shorten \
  -H "Authorization: Bearer <token-from-step-2>" \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.example.com/very/long/url"}'
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255) DEFAULT 'ROLE_USER'
);
```

### URL Mappings Table
```sql
CREATE TABLE url_mapping (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_url VARCHAR(2048),
    short_url VARCHAR(255),
    click_count INT DEFAULT 0,
    created_date DATETIME,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Click Events Table
```sql
CREATE TABLE click_event (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    clicked_at DATETIME,
    ip_address VARCHAR(45),
    user_agent TEXT,
    url_mapping_id BIGINT,
    FOREIGN KEY (url_mapping_id) REFERENCES url_mapping(id)
);
```

## Configuration

### JWT Configuration
- **Secret Key:** Configured in `application.properties`
- **Expiration Time:** 1 hour (3600000 milliseconds)
- **Algorithm:** HS256

### Security Configuration
- Public endpoints: `/api/auth/**`
- Protected endpoints: `/api/urls/**`
- JWT-based authentication for protected routes

## Development Notes

### Adding New Endpoints
1. Create DTOs in `dtos/` package
2. Add controller methods in appropriate controller
3. Update security configuration if needed
4. Add service layer logic

### JWT Token Usage
After successful authentication, include JWT token in requests:
```
Authorization: Bearer <your-jwt-token>
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database `url_shortner` exists

2. **JWT Token Error**
   - Check token expiration
   - Verify JWT secret configuration
   - Ensure proper Authorization header format

3. **Build Errors**
   - Verify Java 21 is installed
   - Run `mvn clean install`
   - Check for missing dependencies

## Future Enhancements

- [x] URL shortening endpoints ✅ (Completed)
- [x] User login/authentication ✅ (Completed)
- [ ] URL redirect functionality (GET /{shortUrl})
- [ ] Get user's URLs endpoint
- [ ] URL analytics dashboard
- [ ] Custom short URL aliases
- [ ] URL expiration functionality
- [ ] Rate limiting
- [ ] API documentation with Swagger


## License

This project is licensed under the MIT License.
