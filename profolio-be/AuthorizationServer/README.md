# Authorization Server

Spring Boot-based OAuth2 Authorization Server với BFF (Backend for Frontend) pattern, sẵn sàng để tái sử dụng cho nhiều project khác.

## 🌐 Language

[🇻🇳 Tiếng Việt](README.md) | [🇬🇧 English](README_EN.md)

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Kiến trúc](#kiến-trúc)
- [Tính năng](#tính-năng)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [OAuth2 Flow](#oauth2-flow)
- [API Endpoints](#api-endpoints)
- [Tái sử dụng cho Project khác](#tái-sử-dụng-cho-project-khác)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng quan

Authorization Server này cung cấp:

- ✅ **OAuth2 Authorization Code Flow** chuẩn
- ✅ **BFF Pattern** - Tokens được lưu server-side, chỉ HttpOnly cookies
- ✅ **Spring Authorization Server** - Implementation chuẩn OAuth2/OIDC
- ✅ **JWT Tokens** với custom claims (roles)
- ✅ **Multi-provider support** - Email, Google, GitHub
- ✅ **Consul Service Discovery** - Tích hợp với microservices
- ✅ **Database-backed** - PostgreSQL với Flyway migrations

---

## 🏗️ Kiến trúc

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

## ✨ Tính năng

### Core Features

- **OAuth2/OIDC Compliant**: Full support cho OAuth2 Authorization Code Flow
- **BFF Pattern**: Tokens không bao giờ lộ ra frontend
- **JWT Tokens**: Signed với RSA keys, chứa roles claims
- **Multi-Provider**: Email/password, Google, GitHub (extensible)
- **Session Management**: Server-side token storage với HttpOnly cookies
- **Role-Based Access**: Tích hợp với Spring Security roles

### Security Features

- ✅ HttpOnly cookies (chống XSS)
- ✅ CSRF protection với state parameter
- ✅ Password encryption (BCrypt)
- ✅ JWT signing với RSA keys
- ✅ CORS configuration
- ✅ Input validation

---

## 🚀 Cài đặt

### Prerequisites

- Java 21+
- Maven 3.8+
- PostgreSQL 12+
- Consul (optional, cho service discovery)

### Build

```bash
cd AuthorizationServer
mvn clean install
```

### Run

```bash
mvn spring-boot:run
```

Hoặc với environment variables:

```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/authdb
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=your_password
export CONSUL_HOST=localhost
export CONSUL_PORT=8500

mvn spring-boot:run
```

---

## ⚙️ Cấu hình

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

Frontend redirect user đến:

```
GET /oauth2/authorize?
  client_id=auth-code-client&
  redirect_uri=http://localhost:3000/callback&
  response_type=code&
  scope=openid profile email&
  state=<random_state>
```

### 2. User Login

User thấy login form tại `/login`, nhập credentials.

### 3. Authorization Code

Server redirect về với authorization code:

```
GET /callback?code=AUTHORIZATION_CODE&state=<state>
```

### 4. Code Exchange (BFF)

Frontend gọi BFF endpoint:

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

**Cookie được set tự động:**
```
Set-Cookie: SESSION_ID=xxx; HttpOnly; Secure; SameSite=Lax
```

### 5. API Calls

Frontend gọi API với cookie:

```http
GET /api/auth/me
Cookie: SESSION_ID=xxx
```

---

## 📡 API Endpoints

### Public Endpoints

#### `POST /api/auth/register`
Đăng ký user mới.

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
Exchange authorization code cho tokens (BFF).

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
Lấy thông tin user hiện tại.

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
Authorization endpoint - redirect user đến đây để bắt đầu OAuth2 flow.

#### `POST /oauth2/token`
Token endpoint - được gọi bởi BFF với client_secret.

#### `GET /oauth2/userinfo`
UserInfo endpoint - lấy user info từ access token.

#### `GET /oauth2/jwks`
JWK Set endpoint - public keys để verify JWT.

---

## 🔄 Tái sử dụng cho Project khác

### Bước 1: Copy Authorization Server

```bash
cp -r AuthorizationServer /path/to/new-project/
cd /path/to/new-project/AuthorizationServer
```

### Bước 2: Cập nhật Package Name

Tìm và thay thế package name:

```bash
# Tìm tất cả files
find . -type f -name "*.java" -exec sed -i 's/com.naammm.authorizationserver/com.yourcompany.authserver/g' {} +
```

### Bước 3: Cấu hình Database

1. Tạo database mới:
```sql
CREATE DATABASE authdb;
```

2. Cập nhật `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/your_authdb
    username: your_user
    password: your_password
```

3. Flyway sẽ tự động chạy migrations.

### Bước 4: Tạo OAuth2 Registered Client

Có 2 cách:

#### Cách 1: Sử dụng Seed Data Migration

Tạo file migration mới `V5__Insert_OAuth2_Client.sql`:

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

**Lưu ý**: Encrypt client secret với BCrypt trước khi insert.

#### Cách 2: Tạo Client Programmatically

Tạo một `@Component` để init client:

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

### Bước 5: Cập nhật Seed Data (Roles)

Đảm bảo có role "USER" trong database:

```sql
-- Update V3__Insert_Seed_Data.sql hoặc tạo migration mới
INSERT INTO roles (name) VALUES ('USER') ON CONFLICT DO NOTHING;
```

Hoặc nếu dùng roles khác, cập nhật `UserService.java`:

```java
user.getRoles().add(roleRepository.findByName("YOUR_ROLE_NAME")
    .orElseThrow(() -> new ResourceNotFoundException("Default role not found")));
```

### Bước 6: Cấu hình Frontend

1. Cập nhật OAuth2 client ID:
```typescript
const CLIENT_ID = 'your-client-id';
const REDIRECT_URI = 'http://your-frontend.com/callback';
const AUTH_SERVER_URL = 'http://your-auth-server.com:9000';
```

2. Implement OAuth2 flow (xem `oauth2Service.ts` trong frontend).

### Bước 7: Customize Login Page

Chỉnh sửa `src/main/resources/templates/login.html` để match branding của bạn.

### Bước 8: Thêm OAuth Providers (Optional)

Để thêm Google/GitHub OAuth:

1. Thêm dependencies:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

2. Cấu hình trong `application.yml`:
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

3. Update `UserService` để handle OAuth providers.

---

## 🔒 Security Best Practices

### Production Checklist

- [ ] **HTTPS Only**: Set `Secure` flag cho cookies
- [ ] **Strong Client Secret**: Sử dụng strong, random secret
- [ ] **Environment Variables**: Không hardcode secrets
- [ ] **CORS Configuration**: Chỉ allow trusted origins
- [ ] **Rate Limiting**: Implement rate limiting cho login endpoints
- [ ] **Token Storage**: Sử dụng Redis thay vì in-memory
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

Thay in-memory storage bằng Redis:

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

**Nguyên nhân**: Client chưa được tạo trong database.

**Giải pháp**: Chạy seed data migration hoặc tạo client manually.

#### 2. "Invalid redirect URI"

**Nguyên nhân**: Redirect URI không match với registered client.

**Giải pháp**: Kiểm tra `redirect_uri` trong request và registered client config.

#### 3. "Session expired"

**Nguyên nhân**: Session cookie đã hết hạn hoặc không tồn tại.

**Giải pháp**: User cần login lại.

#### 4. CORS errors

**Nguyên nhân**: Frontend origin không được allow.

**Giải pháp**: Cập nhật `allowed-origins` trong `CorsConfig`.

#### 5. Database connection errors

**Nguyên nhân**: Database không accessible hoặc credentials sai.

**Giải pháp**: Kiểm tra `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`.

---

## 🗄️ Database Schema

### Core Tables

- **users**: User accounts với UUID primary key
- **roles**: User roles (USER, ADMIN, etc.)
- **user_roles**: Many-to-many relationship
- **oauth2_registered_client**: OAuth2 clients
- **oauth2_authorization**: Authorization codes và tokens
- **oauth2_authorization_consent**: User consent records

### Migration Files

- `V1__Create_OAuth2_Tables.sql`: OAuth2 core tables
- `V2__Create_User_and_Role_Tables.sql`: User và role tables
- `V3__Insert_Seed_Data.sql`: Initial roles và users
- `V4__Update_User_Table_To_Match_Doc.sql`: Update user table với UUID và new fields

### Tạo Migration Mới

```bash
# Tạo file migration mới
touch src/main/resources/db/migration/V5__Your_Migration_Name.sql
```

Flyway sẽ tự động chạy migrations theo thứ tự version.

---

## 📚 Tài liệu tham khảo

- [Spring Authorization Server Documentation](https://docs.spring.io/spring-authorization-server/docs/current/reference/html/)
- [OAuth2 Specification](https://oauth.net/2/)
- [OpenID Connect Specification](https://openid.net/connect/)
- [BFF Pattern](https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/)

---

## 📝 License

MIT License - Tự do sử dụng cho mọi project.

---

## 🤝 Contributing

Khi tái sử dụng, bạn có thể:

1. Fork và customize theo nhu cầu
2. Thêm OAuth providers mới
3. Extend user entity với fields mới
4. Implement email verification
5. Add multi-tenancy support

---

## 📧 Support

Nếu có vấn đề khi tái sử dụng, hãy:

1. Kiểm tra logs trong `logs/auth-server.log`
2. Verify database migrations đã chạy
3. Check environment variables
4. Review security configuration

---

**Happy Coding! 🚀**
