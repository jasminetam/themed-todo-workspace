# ====== Build stage: use Gradle image so no need for the wrapper jar ======
FROM gradle:8.10.2-jdk21-alpine AS build
WORKDIR /app

# Copy Gradle config (works with Groovy or Kotlin DSL)
COPY build.gradle* settings.gradle* gradle.properties* ./

# Copy source code
COPY src ./src

# Build the Spring Boot fat jar
RUN gradle bootJar --no-daemon

# ====== Run stage: lightweight JRE image ======
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the jar built in the previous stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
