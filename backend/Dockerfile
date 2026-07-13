# Stage 1: Build the application
FROM maven:3.9.7-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy the pom.xml and download dependencies
# This is done before copying the source code to cache dependencies if the pom.xml hasn't changed
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src src

# Build the application, skipping tests to speed up the docker build
# (Tests should already be run by the CI pipeline before building the image)
RUN mvn package -DskipTests

# Stage 2: Create the production image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-root user and group for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built jar file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
