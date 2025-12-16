# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY medical-appointment-frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source
COPY medical-appointment-frontend/ ./

# Build frontend for production
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY medical-appointment-api/package*.json ./
COPY medical-appointment-api/prisma ./prisma/

# Install backend dependencies
RUN npm ci

# Copy backend source
COPY medical-appointment-api/ ./

# Generate Prisma Client
RUN npx prisma generate

# Build backend
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy backend package files
COPY medical-appointment-api/package*.json ./
COPY medical-appointment-api/prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production

# Generate Prisma Client
RUN npx prisma generate

# Copy built backend from builder
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built frontend from frontend-builder
COPY --from=frontend-builder /app/frontend/build ./public

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Start application (run migrations then start server)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
