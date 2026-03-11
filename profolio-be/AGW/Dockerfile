# ── Build stage ──────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Layer 1: Cache dependencies (chỉ re-run khi pom.xml thay đổi)
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

# Layer 2: Build source (chỉ re-run khi src/ thay đổi)
COPY src ./src
RUN mvn clean package -DskipTests -B -q

# ── Run stage (chỉ JRE, nhẹ hơn) ────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
