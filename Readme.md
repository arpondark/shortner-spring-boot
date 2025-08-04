# URL Shortener Application

A Spring Boot application that allows users to create shortened URLs, similar to bit.ly or tinyurl. The application includes user authentication, URL management, and click tracking.

## Features

- User registration and authentication with JWT
- Create shortened URLs
- Redirect to original URLs via short links
- View user's URL history
- Click tracking for each shortened URL
- Secure endpoints with role-based access

## Technologies Used

- Spring Boot 3.5.4
- Spring Security 6.5.2
- Spring Data JPA
- MySQL Database
- JWT Authentication
- Lombok
- Maven

## Project Structure

```
shortner/
├── src/
│   ├── main/
│   │   ├── java/com/arpon007/shortner/
│   │   │   ├── ShortnerApplication.java           # Main application class
│   │   │   ├── config/
│   │   │   │   └── WebSecurityConfig.java         # Security configuration
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java            # Authentication endpoints
│   │   │   │   ├── UrlMappingController.java      # URL management endpoints
│   │   │   │   └── RedirectController.java        # URL redirect handler
│   │   │   ├── dtos/
│   │   │   │   ├── LoginRequest.java              # Login request DTO
│   │   │   │   ├── RegisterRequest.java           # Registration request DTO
│   │   │   │   ├── UrlMappingDTO.java             # URL mapping response DTO
│   │   │   │   └── ClickEventDtos.java            # Click analytics DTO
│   │   │   ├── jwt/
│   │   │   │   ├── JwtAuthenticationResponse.java # JWT response wrapper
│   │   │   │   ├── jwtAuthFilter.java             # JWT authentication filter
│   │   │   │   └── JwtUtils.java                  # JWT utility methods
│   │   │   ├── models/
│   │   │   │   ├── User.java                      # User entity
│   │   │   │   ├── UrlMapping.java                # URL mapping entity
│   │   │   │   └── ClickEvent.java                # Click tracking entity
│   │   │   ├── repo/
│   │   │   │   ├── UserRepository.java            # User data access
│   │   │   │   ├── UrlMappingRepo.java            # URL mapping data access
│   │   │   │   └── ClickEventRepo.java            # Click event data access
│   │   │   └── Service/
│   │   │       ├── UserService.java               # User business logic
│   │   │       ├── UserDetailsImpl.java           # Spring Security user details
│   │   │       ├── UserDetailsServiceImpl.java    # User details service
│   │   │       └── UrlMappingService.java          # URL management business logic
│   │   └── resources/
│   │       └── application.properties              # Application configuration
│   └── test/
│       └── java/com/arpon007/shortner/
│           └── ShortnerApplicationTests.java       # Test configuration
├── target/                                         # Compiled classes (generated)
├── .mvn/wrapper/                                   # Maven wrapper files
├── ANALYTICS_TESTING_GUIDE.md                     # Analytics testing documentation
├── Readme.md                                       # This file
├── pom.xml                                         # Maven dependencies
├── mvnw                                            # Maven wrapper (Unix)
└── mvnw.cmd                                        # Maven wrapper (Windows)
```

### Key Components

#### Controllers
- **AuthController**: Handles user registration and login
- **UrlMappingController**: Manages URL shortening, analytics, and user URLs
- **RedirectController**: Handles short URL redirects and click tracking

#### Models/Entities
- **User**: Stores user account information with encrypted passwords
- **UrlMapping**: Links short URLs to original URLs with metadata
- **ClickEvent**: Records individual click events for analytics

#### Services
- **UserService**: User management and authentication logic
- **UrlMappingService**: URL shortening, analytics, and click tracking
- **UserDetailsService**: Spring Security integration

#### Security
- **WebSecurityConfig**: Configures JWT-based authentication
- **JwtAuthFilter**: Processes JWT tokens in requests
- **JwtUtils**: Handles JWT token creation and validation

#### Data Transfer Objects (DTOs)
- **LoginRequest/RegisterRequest**: API request structures
- **UrlMappingDTO**: URL response format
- **ClickEventDtos**: Analytics response format

## Architecture Overview

### Authentication Flow
1. User registers with username, email, and password
2. Password is encrypted using BCrypt
3. User logs in to receive JWT token
4. JWT token is required for all protected endpoints
5. Token expires after 1 hour

### URL Shortening Flow
1. User submits original URL via API
2. System generates 8-character random short code
3. Mapping is stored in database with user association
4. Short URL is returned to user

### Click Tracking Flow
1. User accesses short URL (GET /{shortUrl})
2. System looks up original URL
3. Click count is incremented
4. Click event is recorded with timestamp
5. User is redirected to original URL
6. Protocol (https://) is added if missing

### Security Model
- **Public endpoints**: `/api/auth/**` (registration, login)
- **Protected endpoints**: `/api/url/**` (requires JWT)
- **Open redirects**: `/{shortUrl}` (public access for redirects)
- **User isolation**: Users can only access their own URLs

## Prerequisites

- Java 21 or higher
- MySQL 8.0+ Database
- Maven 3.6+
- IDE (IntelliJ IDEA, Eclipse, VS Code) - Optional
- Postman or similar API testing tool

## Environment Setup

### 1. Java Installation
Ensure Java 21 is installed and JAVA_HOME is set:
```bash
java -version
# Should show Java 21.x.x
```

### 2. MySQL Database Setup
```sql
-- Create database
CREATE DATABASE url_shortner;

-- Create user (optional, for security)
CREATE USER 'shortner_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON url_shortner.* TO 'shortner_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Application Configuration
Update `src/main/resources/application.properties`:

```properties
# Application Name
spring.application.name=shortner

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/url_shortner
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
jwt.secret=your_jwt_secret_key_minimum_32_characters_long
jwt.expiration=3600000
```

**Important Security Notes:**
- Change `jwt.secret` to a secure random string in production
- Use environment variables for sensitive data in production
- Consider using `spring.jpa.hibernate.ddl-auto=validate` in production

## Database Schema

The application automatically creates the following tables using JPA/Hibernate:

### Users Table
```sql
CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255) DEFAULT 'ROLE_USER',
    PRIMARY KEY (id),
    UNIQUE KEY unique_username (username),
    UNIQUE KEY unique_email (email)
);
```

### URL Mappings Table
```sql
CREATE TABLE url_mapping (
    id BIGINT NOT NULL AUTO_INCREMENT,
    original_url VARCHAR(2048),
    short_url VARCHAR(255),
    click_count INT DEFAULT 0,
    created_date DATETIME(6),
    user_id BIGINT,
    PRIMARY KEY (id),
    UNIQUE KEY unique_short_url (short_url),
    KEY fk_user (user_id),
    CONSTRAINT fk_url_mapping_user FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Click Events Table
```sql
CREATE TABLE click_event (
    id BIGINT NOT NULL AUTO_INCREMENT,
    click_date DATETIME(6),
    user_mapping_id BIGINT,
    PRIMARY KEY (id),
    KEY fk_url_mapping (user_mapping_id),
    CONSTRAINT fk_click_event_mapping FOREIGN KEY (user_mapping_id) REFERENCES url_mapping (id)
);
```

### Entity Relationships
- **One-to-Many**: User → UrlMapping (One user can have multiple URLs)
- **One-to-Many**: UrlMapping → ClickEvent (One URL can have multiple clicks)
- **Many-to-One**: ClickEvent → UrlMapping (Many clicks belong to one URL)

## Running the Application

### Option 1: Using Maven Wrapper (Recommended)
```bash
# Clone the repository
git clone https://github.com/arpondark/shortner-spring-boot.git
cd shortner-spring-boot

# Make Maven wrapper executable (Unix/Linux/Mac)
chmod +x mvnw

# Run the application
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

### Option 2: Using Maven Directly
```bash
# Clean and compile
mvn clean compile

# Run tests
mvn test

# Package the application
mvn package

# Run the packaged JAR
java -jar target/shortner-0.0.1-SNAPSHOT.jar

# Or run directly
mvn spring-boot:run
```

### Option 3: IDE Development
1. Import the project as a Maven project
2. Ensure Java 21 is configured
3. Run `ShortnerApplication.java` main method
4. Application will start on `http://localhost:8080`

### Verify Installation
```bash
# Check if application is running
curl http://localhost:8080/actuator/health

# Or test a public endpoint
curl -X POST http://localhost:8080/api/auth/public/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'
```

## Dependencies

### Core Dependencies (from pom.xml)

#### Spring Boot Starters
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

#### Database
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

#### JWT Implementation
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

#### Development Tools
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### Maven Configuration

#### Java Version
```xml
<properties>
    <java.version>21</java.version>
</properties>
```

#### Build Plugins
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

### Lombok Annotations Used

- `@Data` - Generates getters, setters, toString, equals, hashCode
- `@AllArgsConstructor` - Generates constructor with all fields
- `@NoArgsConstructor` - Generates no-argument constructor
- `@Entity` - JPA entity marker
- `@RestController` - Spring REST controller marker
- `@Service` - Spring service component marker
- `@Repository` - Spring repository component marker

## API Endpoints

### Authentication Endpoints

#### 1. Register User
- **URL:** `POST /api/auth/register`
- **Content-Type:** `application/json`
- **Body:**
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
}
```
- **Response:**
```json
{
    "message": "User registered successfully"
}
```

#### 2. Login User
- **URL:** `POST /api/auth/login`
- **Content-Type:** `application/json`
- **Body:**
```json
{
    "username": "john_doe",
    "password": "password123"
}
```
- **Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer"
}
```

### URL Management Endpoints (Require Authentication)

#### 3. Shorten URL
- **URL:** `POST /api/url/shorten`
- **Content-Type:** `application/json`
- **Headers:** `Authorization: Bearer {jwt_token}`
- **Body:**
```json
{
    "originalUrl": "https://www.example.com/very/long/url/that/needs/shortening"
}
```
- **Response:**
```json
{
    "id": 1,
    "orginalurl": "https://www.example.com/very/long/url/that/needs/shortening",
    "shorturl": "AbC12xYz",
    "clickCount": 0,
    "createdAt": "2025-08-04T14:30:00",
    "username": "john_doe"
}
```

#### 4. Get My URLs
- **URL:** `GET /api/url/myurls`
- **Headers:** `Authorization: Bearer {jwt_token}`
- **Response:**
```json
[
    {
        "id": 1,
        "orginalurl": "https://www.example.com/very/long/url/that/needs/shortening",
        "shorturl": "AbC12xYz",
        "clickCount": 5,
        "createdAt": "2025-08-04T14:30:00",
        "username": "john_doe"
    }
]
```

#### 5. Get URL Analytics
- **URL:** `GET /api/url/analytics/{shortUrl}`
- **Headers:** `Authorization: Bearer {jwt_token}`
- **Query Parameters:**
  - `startDate` (optional): Start date in YYYY-MM-DD format
  - `endDate` (optional): End date in YYYY-MM-DD format
- **Example:** `GET /api/url/analytics/AbC12xYz?startDate=2025-08-01&endDate=2025-08-04`
- **Response:**
```json
{
    "shortUrl": "AbC12xYz",
    "originalUrl": "https://www.example.com/very/long/url/that/needs/shortening",
    "totalClicks": 15,
    "uniqueClicks": 12,
    "clicksByDate": [
        {
            "date": "2025-08-01",
            "clicks": 3
        },
        {
            "date": "2025-08-02",
            "clicks": 7
        },
        {
            "date": "2025-08-03",
            "clicks": 4
        },
        {
            "date": "2025-08-04",
            "clicks": 1
        }
    ],
    "topReferrers": [
        {
            "referrer": "direct",
            "count": 8
        },
        {
            "referrer": "google.com",
            "count": 4
        },
        {
            "referrer": "facebook.com",
            "count": 3
        }
    ],
    "deviceTypes": [
        {
            "device": "desktop",
            "count": 9
        },
        {
            "device": "mobile",
            "count": 5
        },
        {
            "device": "tablet",
            "count": 1
        }
    ]
}
```

### URL Redirection

#### 6. Redirect to Original URL
- **URL:** `GET /{shortUrl}`
- **Example:** `GET /AbC12xYz`
- **Response:** HTTP 302 redirect to the original URL
- **Note:** This endpoint increments the click count automatically

## Testing with Postman

### 1. Register a New User

1. Create a new POST request to `http://localhost:8080/api/auth/register`
2. Set Content-Type to `application/json`
3. Add the registration JSON in the body
4. Send the request

### 2. Login to Get JWT Token

1. Create a new POST request to `http://localhost:8080/api/auth/login`
2. Set Content-Type to `application/json`
3. Add the login JSON in the body
4. Send the request
5. Copy the `token` value from the response

### 3. Create a Shortened URL

1. Create a new POST request to `http://localhost:8080/api/url/shorten`
2. Set Content-Type to `application/json`
3. Add Authorization header: `Bearer {paste_your_token_here}`
4. Add the URL shortening JSON in the body
5. Send the request
6. Copy the `shorturl` value from the response

### 4. View Your URLs

1. Create a new GET request to `http://localhost:8080/api/url/myurls`
2. Add Authorization header: `Bearer {paste_your_token_here}`
3. Send the request

### 5. Test URL Redirection

1. Open a browser or create a GET request in Postman
2. Navigate to `http://localhost:8080/{shorturl}` (replace {shorturl} with the actual short URL)
3. You should be redirected to the original URL

### 6. Get URL Analytics

1. Create a new GET request to `http://localhost:8080/api/url/analytics/{shorturl}`
2. Add Authorization header: `Bearer {paste_your_token_here}`
3. Optionally add query parameters for date filtering:
   - `?startDate=2025-08-01&endDate=2025-08-04`
4. Send the request

**Example cURL command:**
```bash
curl -X GET "http://localhost:8080/api/url/analytics/AbC12xYz?startDate=2025-08-01&endDate=2025-08-04" \
  -H "Authorization: Bearer {your_jwt_token_here}"
```

## Sample Test Data

### User Registration
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
}
```

### URL Shortening Examples
```json
{
    "originalUrl": "https://www.google.com"
}
```

```json
{
    "originalUrl": "https://github.com/spring-projects/spring-boot"
}
```

```json
{
    "originalUrl": "https://stackoverflow.com/questions/tagged/spring-boot"
}
```

### Analytics API Examples

**Get analytics for a specific short URL:**
```bash
GET /api/url/analytics/AbC12xYz
```

**Get analytics with date filtering:**
```bash
GET /api/url/analytics/AbC12xYz?startDate=2025-08-01&endDate=2025-08-04
```

**Get analytics for the last 7 days:**
```bash
GET /api/url/analytics/AbC12xYz?startDate=2025-07-28&endDate=2025-08-04
```

## Development Guide

### Code Organization

#### Package Structure
- `com.arpon007.shortner` - Root package
  - `config` - Configuration classes (Security, etc.)
  - `controller` - REST API controllers
  - `dtos` - Data Transfer Objects
  - `jwt` - JWT-related utilities and filters
  - `models` - JPA entities
  - `repo` - Spring Data repositories
  - `Service` - Business logic services

#### Key Design Patterns
1. **Repository Pattern**: Data access abstraction via Spring Data JPA
2. **DTO Pattern**: Separate request/response objects from entities
3. **Service Layer**: Business logic separation from controllers
4. **Filter Pattern**: JWT authentication via custom filter
5. **Builder Pattern**: Used implicitly via Lombok annotations

### Adding New Features

#### 1. Adding a New Entity
```java
@Entity
@Data
public class NewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Add fields and relationships
}
```

#### 2. Creating Repository
```java
@Repository
public interface NewEntityRepository extends JpaRepository<NewEntity, Long> {
    // Add custom query methods
}
```

#### 3. Creating Service
```java
@Service
@AllArgsConstructor
public class NewEntityService {
    private NewEntityRepository repository;
    
    // Add business logic methods
}
```

#### 4. Creating Controller
```java
@RestController
@RequestMapping("/api/newentity")
@AllArgsConstructor
public class NewEntityController {
    private NewEntityService service;
    
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<NewEntity>> getAll(Principal principal) {
        // Implementation
    }
}
```

### Security Considerations

#### Authentication Flow
1. User credentials validated against database
2. JWT token generated with user details and role
3. Token sent to client in response
4. Client includes token in Authorization header
5. JwtAuthFilter validates token on each request
6. SecurityContext populated with user details

#### Securing New Endpoints
```java
// In WebSecurityConfig.java
.requestMatchers("/api/public/**").permitAll()     // Public access
.requestMatchers("/api/admin/**").hasRole("ADMIN") // Admin only
.requestMatchers("/api/user/**").hasRole("USER")   // User only
.anyRequest().authenticated()                       // Default: authenticated
```

### Testing

#### Unit Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UrlMappingServiceTest

# Run with coverage
mvn test jacoco:report
```

#### Integration Testing
```bash
# Test with embedded database
mvn test -Dspring.profiles.active=test

# Test specific endpoints
curl -X POST http://localhost:8080/api/auth/public/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

### Performance Optimization

#### Database Optimization
1. **Indexing**: Add indexes on frequently queried columns
```sql
CREATE INDEX idx_short_url ON url_mapping(short_url);
CREATE INDEX idx_user_id ON url_mapping(user_id);
CREATE INDEX idx_click_date ON click_event(click_date);
```

2. **Query Optimization**: Use JPQL for complex queries
```java
@Query("SELECT NEW com.arpon007.shortner.dtos.ClickEventDtos(DATE(c.clickDate), COUNT(c)) " +
       "FROM ClickEvent c WHERE c.urlMapping = :urlMapping " +
       "GROUP BY DATE(c.clickDate)")
List<ClickEventDtos> findClickStatsByUrlMapping(@Param("urlMapping") UrlMapping urlMapping);
```

#### Caching
```java
// Add caching to frequently accessed data
@Cacheable("shortUrls")
public UrlMapping findByShortUrl(String shortUrl) {
    return urlMappingRepo.findByShortUrl(shortUrl).orElse(null);
}
```

### Deployment

#### Production Configuration
```properties
# application-prod.properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.com.arpon007.shortner=WARN

# Use environment variables
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/url_shortner}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
```

#### Docker Deployment
```dockerfile
FROM openjdk:21-jre-slim
COPY target/shortner-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_URL=jdbc:mysql://db:3306/url_shortner
      - DB_USERNAME=root
      - DB_PASSWORD=password
    depends_on:
      - db
  
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=url_shortner
    ports:
      - "3306:3306"
```

#### Build Commands
```bash
# Create JAR file
mvn clean package

# Build Docker image
docker build -t url-shortener .

# Run with Docker Compose
docker-compose up -d
```

### Monitoring and Logging

#### Application Logs
```java
// Add logging to classes
private static final Logger logger = LoggerFactory.getLogger(UrlMappingService.class);

public UrlMappingDTO createShortUrl(String originalUrl, User user) {
    logger.info("Creating short URL for user: {}, original URL: {}", user.getUsername(), originalUrl);
    // Implementation
}
```

#### Health Checks
```properties
# Enable actuator endpoints
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

## Error Handling

The application returns appropriate HTTP status codes:

- `200 OK` - Successful requests
- `201 Created` - Successful user registration
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found (e.g., invalid short URL)
- `500 Internal Server Error` - Server errors

## Common Issues and Solutions

### 1. Double Slash in URL Path
**Error:** `"path": "/api/url//myurls"`
**Solution:** Ensure you're using the correct URL: `http://localhost:8080/api/url/myurls` (single slash)

### 2. JWT Token Expired
**Error:** `401 Unauthorized`
**Solution:** Login again to get a new JWT token

### 3. Database Connection Issues
**Error:** Database connection failed
**Solution:** Verify MySQL is running and database credentials are correct

## Database Schema

The application automatically creates the following tables:

- `users` - User information and credentials
- `url_mapping` - URL mappings with click tracking
- `click_event` - Individual click events (for detailed analytics)

## Security

- Passwords are encrypted using BCrypt
- JWT tokens expire after 1 hour
- All URL management endpoints require authentication
- Role-based access control with USER role

## Development Notes

- The application uses Lombok to reduce boilerplate code
- All entities use `@Data` annotation for automatic getter/setter generation
- JWT secret should be changed in production environments
- Database credentials should be externalized in production

## Contributing Guidelines

### Code Style
- Follow Java naming conventions (camelCase for variables, PascalCase for classes)
- Use meaningful variable and method names
- Add proper JavaDoc comments for public methods
- Keep methods small and focused on single responsibility

### Git Workflow
1. Create a feature branch from `main`
2. Make changes and commit with descriptive messages
3. Test your changes thoroughly
4. Submit a pull request with detailed description

### Testing
- Write unit tests for new features
- Ensure all existing tests pass
- Test endpoints with both valid and invalid data
- Verify JWT authentication works correctly

### Adding New Features
1. Update the appropriate service/controller classes
2. Add new DTOs if needed for request/response
3. Update database schema if required
4. Add appropriate security configuration
5. Update this README with new endpoints

## Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check if port 8080 is already in use
netstat -ano | findstr :8080

# Kill process using the port
taskkill /PID <process_id> /F
```

#### 2. Database Connection Error
```bash
# Verify MySQL service is running
services.msc

# Test connection
mysql -u root -p -h localhost -P 3306
```

#### 3. JWT Token Issues
- Ensure token is included in Authorization header
- Check token hasn't expired (1 hour lifetime)
- Verify token format: `Bearer <token>`

#### 4. URL Redirection Problems
- Check if original URL includes protocol (http/https)
- Verify short URL exists in database
- Confirm click events are being recorded

### Debug Mode
```properties
# Enable debug logging
logging.level.com.arpon007.shortner=DEBUG
logging.level.org.springframework.security=DEBUG
```

## Future Enhancements

### Planned Features
- [ ] Custom short URL aliases
- [ ] URL expiration dates
- [ ] Detailed analytics dashboard
- [ ] QR code generation for short URLs
- [ ] Rate limiting for URL creation
- [ ] Email verification for user registration
- [ ] Password reset functionality
- [ ] Admin panel for user management

### Technical Improvements
- [ ] Redis caching for frequently accessed URLs
- [ ] API rate limiting with Redis
- [ ] Database connection pooling optimization
- [ ] Comprehensive integration tests
- [ ] API documentation with Swagger
- [ ] Containerized development environment
- [ ] CI/CD pipeline setup

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or support, please contact the development team or create an issue in the project repository.

---

**Project Status:** Active Development  
**Version:** 1.0.0  
**Last Updated:** December 2024
