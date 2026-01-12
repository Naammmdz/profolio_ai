FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /workspace

ENV MAVEN_CONFIG=""

COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml pom.xml
RUN chmod +x mvnw

COPY src src
RUN ./mvnw --batch-mode package -DskipTests -Dmaven.wagon.http.retryHandler.count=5 -Dmaven.wagon.http.pool=false

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /workspace/target/AGW-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
