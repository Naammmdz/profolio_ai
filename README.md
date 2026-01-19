# Profolio AI

Monorepo for Profolio AI application - an intelligent AI-powered portfolio creation platform.

## 📋 Overview

Profolio AI is a full-stack application that allows users to create and manage personal portfolios with AI assistance. The system uses a microservices architecture with API Gateway and OAuth2 Authorization Server.

## 🏗️ Project Structure

```
profolio/
├── profolio-fe/              # Frontend application (React + TypeScript + Vite)
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── landing/         # Landing page components
│   │   └── portfolio/       # Portfolio components
│   ├── src/
│   │   ├── config/          # API configuration
│   │   ├── services/        # API services (auth, oauth2)
│   │   ├── types/           # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
│
└── profolio-be/              # Backend services
    ├── AGW/                  # API Gateway (Spring Cloud Gateway)
    │   ├── src/main/java/
    │   └── src/main/resources/
    │       └── application.yml
    │
    └── AuthorizationServer/  # OAuth2 Authorization Server
        ├── src/main/java/
        │   └── com/naammm/authorizationserver/
        │       ├── bff/              # BFF Pattern implementation
        │       ├── config/           # Security & OAuth2 config
        │       ├── controller/       # REST controllers
        │       ├── user/             # User management
        │       └── exception/        # Exception handlers
        ├── src/main/resources/
        │   ├── application.yml
        │   ├── db/migration/        # Flyway migrations
        │   └── templates/           # Login/Register pages
        └── README.md                # Authorization Server details
```

## 🚀 Technology Stack

### Frontend (profolio-fe)
- **React 18.3.1** - UI framework
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool & dev server
- **Framer Motion 11.0.8** - Animation library
- **Axios 1.7.9** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

### Backend (profolio-be)

#### AGW (API Gateway)
- **Spring Boot 3.5.6** - Application framework
- **Spring Cloud Gateway** - API Gateway
- **Spring Cloud Consul Discovery** - Service discovery
- **Java 21** - Programming language
- **WebFlux** - Reactive programming

#### AuthorizationServer
- **Spring Boot 3.5.6** - Application framework
- **Spring Authorization Server** - OAuth2/OIDC implementation
- **Spring Security** - Security framework
- **PostgreSQL** - Database
- **Flyway** - Database migration
- **JWT** - Token-based authentication
- **BFF Pattern** - Backend for Frontend pattern
- **Consul** - Service discovery

## 📦 System Requirements

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Java 21+** (for backend)
- **Maven 3.8+** (for backend)
- **PostgreSQL 12+** (for Authorization Server)
- **Consul** (optional, for service discovery)

## 🛠️ Installation and Running

### 1. Frontend (profolio-fe)

```bash
cd profolio-fe
npm install
npm run dev
```

Frontend will run at: `http://localhost:3000`

**Environment Variables** (create `.env.local` file):
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_AUTH_SERVER_URL=http://localhost:9000
VITE_OAUTH_CLIENT_ID=auth-code-client
VITE_OAUTH_REDIRECT_URI=http://localhost:3000/callback
```

### 2. Authorization Server

```bash
cd profolio-be/AuthorizationServer

# Configure database in application.yml or environment variables
export DATABASE_URL=jdbc:postgresql://localhost:5432/authdb
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=your_password

# Run the application
mvn spring-boot:run
```

Authorization Server will run at: `http://localhost:9000`

See [AuthorizationServer/README.md](profolio-be/AuthorizationServer/README.md) for detailed configuration.

### 3. API Gateway (AGW)

```bash
cd profolio-be/AGW

# Configure Consul (if using)
export CONSUL_HOST=localhost
export CONSUL_PORT=8500

# Run the application
mvn spring-boot:run
```

API Gateway will run at: `http://localhost:8080`

## 🔐 Authentication

The system uses **OAuth2 Authorization Code Flow** with **BFF Pattern**:

1. **Frontend** redirects user to Authorization Server
2. User logs in at Authorization Server
3. Authorization Server returns authorization code
4. Frontend calls BFF endpoint to exchange code
5. BFF stores tokens server-side and sets HttpOnly cookie
6. Frontend uses cookie to call APIs through Gateway

### OAuth2 Flow

```
Browser → Authorization Server (/oauth2/authorize)
       → Login Form
       → Redirect with code (/callback?code=xxx)
       → BFF Exchange (/api/auth/exchange)
       → HttpOnly Cookie is set
       → API calls with cookie
```

## 📡 API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/exchange` - Exchange authorization code (BFF)
- `GET /oauth2/authorize` - OAuth2 authorization endpoint

### Protected Endpoints (Require Cookie)
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/logout` - Logout

See [AuthorizationServer/README.md](profolio-be/AuthorizationServer/README.md) for detailed API documentation.

## 🗄️ Database

Authorization Server uses PostgreSQL with Flyway migrations:
- OAuth2 tables (registered clients, authorizations, etc.)
- User & Role tables
- Seed data

Migrations run automatically when the application starts.

## 🔧 Configuration

### Environment Variables

#### Frontend
- `VITE_API_BASE_URL` - API Gateway URL (default: http://localhost:8080/api)
- `VITE_AUTH_SERVER_URL` - Authorization Server URL (default: http://localhost:9000)
- `VITE_OAUTH_CLIENT_ID` - OAuth2 client ID
- `VITE_OAUTH_REDIRECT_URI` - OAuth2 redirect URI

#### Authorization Server
- `SERVER_PORT` - Server port (default: 9000)
- `DATABASE_URL` - PostgreSQL connection URL
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
- `CONSUL_HOST` - Consul host (default: localhost)
- `CONSUL_PORT` - Consul port (default: 8500)
- `OAUTH_CLIENT_ID` - OAuth2 client ID
- `OAUTH_CLIENT_SECRET` - OAuth2 client secret

#### API Gateway
- `SERVER_PORT` - Server port (default: 8080)
- `CONSUL_HOST` - Consul host (default: localhost)
- `CONSUL_PORT` - Consul port (default: 8500)

## 📚 Documentation

- [Authorization Server README](profolio-be/AuthorizationServer/README.md) - OAuth2 Authorization Server details
- [Database Schema](profolio-fe/docs/DATABASE_SCHEMA.sql) - Database schema
- [Entity Models](profolio-fe/docs/ENTITY_MODELS.md) - Entity models documentation

## 🏃 Development Workflow

1. **Start Database**: Ensure PostgreSQL is running
2. **Start Consul** (optional): `consul agent -dev`
3. **Start Authorization Server**: `cd profolio-be/AuthorizationServer && mvn spring-boot:run`
4. **Start API Gateway**: `cd profolio-be/AGW && mvn spring-boot:run`
5. **Start Frontend**: `cd profolio-fe && npm run dev`

## 🔒 Security Features

- ✅ OAuth2/OIDC compliant
- ✅ BFF Pattern (tokens never exposed to frontend)
- ✅ HttpOnly cookies (XSS protection)
- ✅ CSRF protection with state parameter
- ✅ JWT signing with RSA keys
- ✅ Password encryption (BCrypt)
- ✅ CORS configuration

## 📝 License

MIT License

## 🤝 Contributing

This project is under active development. Contributions are welcome!

---

**Happy Coding! 🚀**
