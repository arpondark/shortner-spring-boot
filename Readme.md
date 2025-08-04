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
│   │   │   └── AuthController.java           # Authentication endpoints
│   │   ├── dtos/
│   │   │   └── RegisterRequest.java          # Data transfer objects
│   │   ├── jwt/
│   │   │   ├── JwtAuthenticationResponse.java
│   │   │   ├── jwtAuthFilter.java            # JWT filter
│   │   │   └── JwtUtils.java                 # JWT utilities
│   │   ├── models/
│   │   │   ├── ClickEvent.java               # Click tracking entity
│   │   │   ├── UrlMapping.java               # URL mapping entity
│   │   │   └── User.java                     # User entity
│   │   ├── repo/
│   │   │   └── UserRepository.java           # User repository
│   │   └── Service/
│   │       ├── UserDetailsImpl.java
│   │       ├── UserDetailsServiceImpl.java
│   │       └── UserService.java              # User service layer
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

### 3. Test Cases

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

### 4. Error Testing

#### Invalid Email Format
```json
{
    "username": "testuser",
    "email": "invalid-email",
    "password": "test123",
    "role": ["USER"]
}
```

#### Missing Required Fields
```json
{
    "username": "testuser",
    "email": "test@example.com"
}
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

- [ ] URL shortening endpoints
- [ ] User login/authentication
- [ ] URL analytics dashboard
- [ ] Custom short URL aliases
- [ ] URL expiration functionality
- [ ] Rate limiting
- [ ] API documentation with Swagger


## License

This project is licensed under the MIT License.
