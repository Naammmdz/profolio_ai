## Production Deployment Configuration

### Environment Variables cho Production

Tạo file `.env` hoặc config trong deployment platform (Docker, Kubernetes, Cloud):

```bash
# Server Configuration
SERVER_PORT=9000

# Database Configuration
DATABASE_URL=jdbc:postgresql://your-db-host:5432/authdb
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_secure_password
DB_POOL_SIZE=20

# OAuth2 Configuration
ISSUER_URL=https://auth.yourdomain.com
KEYSTORE_PASSWORD=your_keystore_password
KEYSTORE_ALIAS=auth-server
KEY_PASSWORD=your_key_password

# OAuth Client Configuration
OAUTH_CLIENT_ID=production-client-id
OAUTH_CLIENT_SECRET=strong_random_secret_here
OAUTH_REDIRECT_URIS=https://yourdomain.com/callback,https://yourdomain.com/login

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Frontend Configuration
FRONTEND_LOGIN_URL=https://yourdomain.com/login

# Logging Configuration
LOG_LEVEL=INFO
APP_LOG_LEVEL=INFO
SECURITY_LOG_LEVEL=WARN
OAUTH_LOG_LEVEL=INFO
LOG_FILE=/var/log/auth-server/app.log

# Actuator Configuration
HEALTH_SHOW_DETAILS=never

# JPA Configuration
SHOW_SQL=false
```

### Docker Deployment

#### Dockerfile
```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/AuthorizationServer-*.jar app.jar
EXPOSE 9000
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: authdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  auth-server:
    build: .
    ports:
      - "9000:9000"
    environment:
      DATABASE_URL: jdbc:postgresql://postgres:5432/authdb
      DATABASE_USERNAME: postgres
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
      ISSUER_URL: ${ISSUER_URL}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
      FRONTEND_LOGIN_URL: ${FRONTEND_LOGIN_URL}
      OAUTH_CLIENT_ID: ${OAUTH_CLIENT_ID}
      OAUTH_CLIENT_SECRET: ${OAUTH_CLIENT_SECRET}
      OAUTH_REDIRECT_URIS: ${OAUTH_REDIRECT_URIS}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
```

### Kubernetes Deployment

#### ConfigMap (config.yaml)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: auth-server-config
data:
  SERVER_PORT: "9000"
  LOG_LEVEL: "INFO"
  APP_LOG_LEVEL: "INFO"
```

#### Secret (secret.yaml)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: auth-server-secret
type: Opaque
stringData:
  DATABASE_PASSWORD: your_secure_password
  OAUTH_CLIENT_SECRET: strong_random_secret
  KEYSTORE_PASSWORD: your_keystore_password
```

#### Deployment (deployment.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auth-server
  template:
    metadata:
      labels:
        app: auth-server
    spec:
      containers:
      - name: auth-server
        image: your-registry/auth-server:latest
        ports:
        - containerPort: 9000
        envFrom:
        - configMapRef:
            name: auth-server-config
        - secretRef:
            name: auth-server-secret
        env:
        - name: DATABASE_URL
          value: jdbc:postgresql://postgres-service:5432/authdb
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 9000
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 9000
          initialDelaySeconds: 30
          periodSeconds: 5
```

### Build và Deploy Commands

```bash
# Build project
mvn clean package -DskipTests

# Build Docker image
docker build -t auth-server:latest .

# Run with docker-compose
docker-compose up -d

# Deploy to Kubernetes
kubectl apply -f k8s/
```

### Security Checklist cho Production

- [x] Environment variables cho sensitive data
- [x] CORS configuration với allowed origins cụ thể
- [x] CSRF protection (enabled cho non-API endpoints)
- [x] Security headers (XSS, CSP, Frame Options)
- [x] BCrypt với strength 12
- [x] HTTPS/TLS (config trong reverse proxy/load balancer)
- [x] Actuator endpoints secured với ROLE_ADMIN
- [x] Logging configuration (không log sensitive data)
- [x] Database connection pooling
- [x] Token expiration settings
- [x] Health checks configured

### Monitoring

Access metrics endpoint:
```bash
curl http://localhost:9000/actuator/prometheus
```

Configure Prometheus scraping và Grafana dashboards để monitor application.
