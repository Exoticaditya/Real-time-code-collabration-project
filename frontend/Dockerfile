# Multi-stage build for production optimization
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app for production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Add labels for better container management
LABEL maintainer="Real-time Code Collaboration Team"
LABEL version="1.0.0"
LABEL description="Frontend for Real-time Code Collaboration Tool"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
