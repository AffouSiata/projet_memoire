# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Increase Node memory limit
ENV NODE_OPTIONS=--max_old_space_size=2048

# Copy frontend package files
COPY medical-appointment-frontend/package*.json ./

# Install frontend dependencies (use npm install instead of npm ci for flexibility)
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY medical-appointment-frontend/ ./

# Build frontend for production
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Install Python and build tools for bcrypt
RUN apk add --no-cache python3 make g++

# Copy backend package files
COPY medical-appointment-api/package*.json ./
COPY medical-appointment-api/prisma ./prisma/

# Install backend dependencies
RUN npm install --legacy-peer-deps

# Copy backend source
COPY medical-appointment-api/ ./

# Generate Prisma Client with specific version
RUN npx prisma@5.22.0 generate

# Build backend
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production

WORKDIR /app

# Install Python and build tools for bcrypt (needed at runtime for some native modules)
RUN apk add --no-cache python3 make g++

# Copy backend package files
COPY medical-appointment-api/package*.json ./
COPY medical-appointment-api/prisma ./prisma/

# Install only production dependencies
RUN npm install --only=production --legacy-peer-deps

# Generate Prisma Client with specific version
RUN npx prisma@5.22.0 generate

# Copy built backend from builder
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/frontend/build ./public

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Start application (run migrations then start server)
CMD ["sh", "-c", "npx prisma@5.22.0 migrate deploy && node dist/main"]
