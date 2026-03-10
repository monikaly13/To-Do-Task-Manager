# Stage 1: Build Next.js frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: Build Spring Boot backend
FROM maven:3.9-eclipse-temurin-17-alpine AS backend-build
WORKDIR /app

COPY SpringBootApp/ ./SpringBootApp/

# Copy Next.js static output into Spring Boot resources
COPY --from=frontend-build /app/out ./SpringBootApp/src/main/resources/static/

# Build JAR (skip tests for faster deploy)
RUN mvn -f SpringBootApp/pom.xml package -DskipTests -q

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=backend-build /app/SpringBootApp/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
