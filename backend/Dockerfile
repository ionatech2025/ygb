# ==============================================================================
# Build Stage
# ==============================================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml first to cache dependencies layer
COPY pom.xml .

# Download dependencies offline to speed up subsequent builds
RUN mvn dependency:go-offline -B

# Copy source code and build the package (skipping tests for production build speed)
COPY src ./src
RUN mvn clean package -DskipTests

# ==============================================================================
# Run Stage
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Spring Boot default port
EXPOSE 8080

# Run the jar with security best practices
ENTRYPOINT ["java", "-jar", "app.jar"]
