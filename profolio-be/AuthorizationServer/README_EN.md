# Authorization Server

Spring Boot-based OAuth2 Authorization Server with BFF (Backend for Frontend) pattern, ready to reuse for multiple projects.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [OAuth2 Flow](#oauth2-flow)
- [API Endpoints](#api-endpoints)
- [Reusing for Other Projects](#reusing-for-other-projects)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🌐 Language

[🇻🇳 Tiếng Việt](README.md) | [🇬🇧 English](README_EN.md)

---

## 🎯 Overview

This Authorization Server provides:

- ✅ **OAuth2 Authorization Code Flow** - Standard OAuth2 implementation
- ✅ **BFF Pattern** - Tokens stored server-side, only HttpOnly cookies
- ✅ **Spring Authorization Server** - Standard OAuth2/OIDC implementation
- ✅ **JWT Tokens** with custom claims (roles)
- ✅ **Multi-provider support** - Email, Google, GitHub
- ✅ **Consul Service Discovery** - Integration with microservices
- ✅ **Database-backed** - PostgreSQL with Flyway migrations

---

## 🏗️ Architecture

### Component Structure

```
AuthorizationServer/
├── config/
│   ├── AuthorizationServerConfig.java    # OAuth2 server config
│   ├── WebSecurityConfig.java            # Security filters
│   └── CorsConfig.java                   # CORS configuration
├── user/
│   ├── User.java                         # User entity
│   ├── Role.java                         # Role entity
│   ├── controller/
│   │   └── AuthController.java          # Registration endpoint
│   ├── service/
│   │   ├── UserService.java             # User management
│   │   └── AuthenticationService.java   # Token utilities
│   └── dto/
│       └── RegisterRequest.java         # Registration DTO
├── bff/                                  # BFF Pattern Implementation
│   ├── controller/
│   │   └── BFFAuthController.java       # Code exchange, /me, logout
│   ├── service/
│   │   └── BFFAuthService.java          # Token storage & exchange
│   └── dto/
│       └── OAuth2TokenExchangeRequest.java
└── resources/
    ├── templates/
    │   └── login.html                   # Custom login page
    └── db/migration/                    # Flyway migrations
```

### Authentication Flow

```
┌─────────┐
│ Browser │
└────┬────┘
     │ 1. GET /oauth2/authorize
     ↓
┌─────────────────────────┐
│ Authorization Server    │
│ - Show login form       │
│ - Authenticate user     │
└────┬────────────────────┘
     │ 2. Redirect with code
     ↓
┌─────────┐
│ Browser │
│ /callback?code=xxx      │
└────┬────┘
     │ 3. POST /api/auth/exchange
     ↓
┌─────────────────────────┐
│ BFF Controller          │
│ - Exchange code         │
│ - Store tokens          │
│ - Set HttpOnly cookie   │
└────┬────────────────────┘
     │ 4. Cookie set
     ↓
┌─────────┐
│ Browser │
│ - Use cookie for API    │
└─────────┘
```

---

## ✨ Features

### Core Features

- **OAuth2/OIDC Compliant**: Full support for OAuth2 Authorization Code Flow
- **BFF Pattern**: Tokens never exposed to frontend
- **JWT Tokens**: Signed with RSA keys, contains roles claims
- **Multi-Provider**: Email/password, Google, GitHub (extensible)
- **Session Management**: Server-side token storage with HttpOnly cookies
- **Role-Based Access**: Integrated with Spring Security roles

### Security Features

- ✅ HttpOnly cookies (XSS protection)
- ✅ CSRF protection with state parameter
- ✅ Password encryption (BCrypt)
- ✅ JWT signing with RSA keys
- ✅ CORS configuration
- ✅ Input validation

---

## 🚀 Installation

### Prerequisites

- Java 21+
- Maven 3.8+
- PostgreSQL 12+
- Consul (optional, for service discovery)

### Build

```bash
cd AuthorizationServer
mvn clean install
```

### Run

```bash
mvn spring-boot:run
```

Or with environment variables:

```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/authdb
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=your_password
export CONSUL_HOST=localhost
export CONSUL_PORT=8500

mvn spring-boot:run
```

---

## ⚙️ Configuration

### Application Configuration (`application.yml`)

```yaml
server:
  port: ${SERVER_PORT:9000}

spring:
  application:
    name: authorization-server
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/authdb}
    username: ${DATABASE_USERNAME:postgres}
    password: ${DATABASE_PASSWORD:password}
  cloud:
    consul:
      host: ${CONSUL_HOST:localhost}
      port: ${CONSUL_PORT:8500}
      discovery:
        enabled: true
        instance-id: ${spring.application.name}:${random.value}
        prefer-ip-address: true
        register: true

app:
  oauth:
    client:
      id: ${OAUTH_CLIENT_ID:auth-code-client}
      secret: ${OAUTH_CLIENT_SECRET:secret123}
      redirect-uris: ${OAUTH_REDIRECT_URIS:http://localhost:3000/callback}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Server port | 9000 |
| `DATABASE_URL` | PostgreSQL connection URL | jdbc:postgresql://localhost:5432/authdb |
| `DATABASE_USERNAME` | Database username | postgres |
| `DATABASE_PASSWORD` | Database password | - |
| `CONSUL_HOST` | Consul host | localhost |
| `CONSUL_PORT` | Consul port | 8500 |
| `OAUTH_CLIENT_ID` | OAuth2 client ID | auth-code-client |
| `OAUTH_CLIENT_SECRET` | OAuth2 client secret | secret123 |
| `OAUTH_REDIRECT_URIS` | Allowed redirect URIs | http://localhost:3000/callback |
| `ISSUER_URL` | OAuth2 issuer URL | http://localhost:9000 |

---

## 🔐 OAuth2 Flow

### 1. Authorization Request

Frontend redirects user to:

```
GET /oauth2/authorize?
  client_id=auth-code-client&
  redirect_uri=http://localhost:3000/callback&
  response_type=code&
  scope=openid profile email&
  state=<random_state>
```

### 2. User Login

User sees login form at `/login`, enters credentials.

### 3. Authorization Code

Server redirects back with authorization code:

```
GET /callback?code=AUTHORIZATION_CODE&state=<state>
```

### 4. Code Exchange (BFF)

Frontend calls BFF endpoint:

```http
POST /api/auth/exchange
Content-Type: application/json

{
  "code": "AUTHORIZATION_CODE",
  "redirectUri": "http://localhost:3000/callback"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "roles": ["USER"]
    }
  }
}
```

**Cookie is set automatically:**
```
Set-Cookie: SESSION_ID=xxx; HttpOnly; Secure; SameSite=Lax
```

### 5. API Calls

Frontend calls API with cookie:

```http
GET /api/auth/me
Cookie: SESSION_ID=xxx
```

---

## 📡 API Endpoints

### Public Endpoints

#### `POST /api/auth/register`
Register new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",  // optional
  "name": "User Name"      // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please login using OAuth2 flow.",
  "data": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### `POST /api/auth/exchange`
Exchange authorization code for tokens (BFF).

**Request:**
```json
{
  "code": "authorization_code",
  "redirectUri": "http://localhost:3000/callback"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "roles": ["USER"]
    }
  }
}
```

### Protected Endpoints (Require Cookie)

#### `GET /api/auth/me`
Get current user info.

**Headers:**
```
Cookie: SESSION_ID=xxx
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "roles": ["USER"]
  }
}
```

#### `POST /api/auth/logout`
Logout user, clear session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### OAuth2 Endpoints (Direct Browser Access)

#### `GET /oauth2/authorize`
Authorization endpoint - redirect user here to start OAuth2 flow.

#### `POST /oauth2/token`
Token endpoint - called by BFF with client_secret.

#### `GET /oauth2/userinfo`
UserInfo endpoint - get user info from access token.

#### `GET /oauth2/jwks`
JWK Set endpoint - public keys to verify JWT.

---

## 🔄 Reusing for Other Projects

### Step 1: Copy Authorization Server

```bash
cp -r AuthorizationServer /path/to/new-project/
cd /path/to/new-project/AuthorizationServer
```

### Step 2: Update Package Name

Find and replace package name:

```bash
# Find all files
find . -type f -name "*.java" -exec sed -i 's/com.naammm.authorizationserver/com.yourcompany.authserver/g' {} +
```

### Step 3: Configure Database

1. Create new database:
```sql
CREATE DATABASE authdb;
```

2. Update `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/your_authdb
    username: your_user
    password: your_password
```

3. Flyway will automatically run migrations.

### Step 4: Create OAuth2 Registered Client

Two options:

#### Option 1: Using Seed Data Migration

Create new migration file `V5__Insert_OAuth2_Client.sql`:

```sql
-- Insert OAuth2 registered client
INSERT INTO oauth2_registered_client (
    id, client_id, client_secret, client_id_issued_at, client_name,
    client_authentication_methods, authorization_grant_types,
    redirect_uris, scopes, client_settings, token_settings
) VALUES (
    'your-client-uuid',
    'your-client-id',
    '{bcrypt}$2a$12$YourEncryptedSecretHere',  -- Use BCrypt to encrypt
    CURRENT_TIMESTAMP,
    'Your App Client',
    'client_secret_basic',
    'authorization_code,refresh_token',
    'http://localhost:3000/callback',
    'openid,profile,email',
    '{"@class":"java.util.Collections$EmptyMap"}',
    '{"@class":"java.util.Collections$EmptyMap"}'
);
```

**Note**: Encrypt client secret with BCrypt before inserting.

#### Option 2: Create Client Programmatically

Create a `@Component` to init client:

```java
@Component
public class OAuth2ClientInitializer {
    @Autowired
    private RegisteredClientRepository clientRepository;
    
    @PostConstruct
    public void init() {
        if (clientRepository.findByClientId("your-client-id") == null) {
            RegisteredClient client = RegisteredClient.withId(UUID.randomUUID().toString())
                .clientId("your-client-id")
                .clientSecret("{bcrypt}$2a$12$...")
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                .redirectUri("http://localhost:3000/callback")
                .scope("openid")
                .scope("profile")
                .scope("email")
                .build();
            clientRepository.save(client);
        }
    }
}
```

### Step 5: Update Seed Data (Roles)

Ensure "USER" role exists in database:

```sql
-- Update V3__Insert_Seed_Data.sql or create new migration
INSERT INTO roles (name) VALUES ('USER') ON CONFLICT DO NOTHING;
```

Or if using different roles, update `UserService.java`:

```java
user.getRoles().add(roleRepository.findByName("YOUR_ROLE_NAME")
    .orElseThrow(() -> new ResourceNotFoundException("Default role not found")));
```

### Step 6: Configure Frontend

1. Update OAuth2 client ID:
```typescript
const CLIENT_ID = 'your-client-id';
const REDIRECT_URI = 'http://your-frontend.com/callback';
const AUTH_SERVER_URL = 'http://your-auth-server.com:9000';
```

2. Implement OAuth2 flow (see `oauth2Service.ts` in frontend).

### Step 7: Customize Login Page

Edit `src/main/resources/templates/login.html` to match your branding.

### Step 8: Add OAuth Providers (Optional)

To add Google/GitHub OAuth:

1. Add dependencies:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

2. Configure in `application.yml`:
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: openid,profile,email
```

3. Update `UserService` to handle OAuth providers.

---

## 🔒 Security Best Practices

### Production Checklist

- [ ] **HTTPS Only**: Set `Secure` flag for cookies
- [ ] **Strong Client Secret**: Use strong, random secret
- [ ] **Environment Variables**: Don't hardcode secrets
- [ ] **CORS Configuration**: Only allow trusted origins
- [ ] **Rate Limiting**: Implement rate limiting for login endpoints
- [ ] **Token Storage**: Use Redis instead of in-memory
- [ ] **Session Timeout**: Set appropriate session expiration
- [ ] **Email Verification**: Implement email verification flow
- [ ] **Audit Logging**: Log authentication events
- [ ] **Key Rotation**: Rotate JWT signing keys periodically

### Example Production Config

```yaml
app:
  oauth:
    client:
      secret: ${OAUTH_CLIENT_SECRET}  # From environment
  cors:
    allowed-origins: ${ALLOWED_ORIGINS:https://yourdomain.com}

server:
  ssl:
    enabled: true
    key-store: classpath:keystore/production.jks
    key-store-password: ${KEYSTORE_PASSWORD}
```

### Redis Token Storage (Production)

Replace in-memory storage with Redis:

```java
@Service
public class BFFAuthService {
    private final RedisTemplate<String, String> redisTemplate;
    
    public String exchangeCodeForTokens(...) {
        String sessionId = UUID.randomUUID().toString();
        
        // Store in Redis with TTL
        redisTemplate.opsForValue().set(
            "session:" + sessionId, 
            accessToken, 
            1, 
            TimeUnit.HOURS
        );
        redisTemplate.opsForValue().set(
            "refresh:" + sessionId, 
            refreshToken, 
            24, 
            TimeUnit.HOURS
        );
        
        return sessionId;
    }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Registered client not found"

**Cause**: Client not created in database.

**Solution**: Run seed data migration or create client manually.

#### 2. "Invalid redirect URI"

**Cause**: Redirect URI doesn't match registered client.

**Solution**: Check `redirect_uri` in request and registered client config.

#### 3. "Session expired"

**Cause**: Session cookie expired or doesn't exist.

**Solution**: User needs to login again.

#### 4. CORS errors

**Cause**: Frontend origin not allowed.

**Solution**: Update `allowed-origins` in `CorsConfig`.

#### 5. Database connection errors

**Cause**: Database not accessible or wrong credentials.

**Solution**: Check `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`.

---

## 🗄️ Database Schema

### Core Tables

- **users**: User accounts with UUID primary key
- **roles**: User roles (USER, ADMIN, etc.)
- **user_roles**: Many-to-many relationship
- **oauth2_registered_client**: OAuth2 clients
- **oauth2_authorization**: Authorization codes and tokens
- **oauth2_authorization_consent**: User consent records

### Migration Files

- `V1__Create_OAuth2_Tables.sql`: OAuth2 core tables
- `V2__Create_User_and_Role_Tables.sql`: User and role tables
- `V3__Insert_Seed_Data.sql`: Initial roles and users
- `V4__Update_User_Table_To_Match_Doc.sql`: Update user table with UUID and new fields

### Create New Migration

```bash
# Create new migration file
touch src/main/resources/db/migration/V5__Your_Migration_Name.sql
```

Flyway will automatically run migrations in version order.

---

## 📚 References

- [Spring Authorization Server Documentation](https://docs.spring.io/spring-authorization-server/docs/current/reference/html/)
- [OAuth2 Specification](https://oauth.net/2/)
- [OpenID Connect Specification](https://openid.net/connect/)
- [BFF Pattern](https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/)

---

## 📝 License

MIT License - Free to use for any project.

---

## 🤝 Contributing

When reusing, you can:

1. Fork and customize as needed
2. Add new OAuth providers
3. Extend user entity with new fields
4. Implement email verification
5. Add multi-tenancy support

---

## 📧 Support

If you encounter issues when reusing:

1. Check logs in `logs/auth-server.log`
2. Verify database migrations ran
3. Check environment variables
4. Review security configuration

---

**Happy Coding! 🚀**
