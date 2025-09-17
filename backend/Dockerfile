# Use multi-stage build for optimization
FROM node:18-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory and set permissions
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

# Switch to non-root user
USER node

# Copy package files
COPY --chown=node:node package*.json ./

# Production stage
FROM base AS production

# Set environment
ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY --chown=node:node . .

# Add labels for better container management
LABEL maintainer="Real-time Code Collaboration Team"
LABEL version="1.0.0"
LABEL description="Backend API for Real-time Code Collaboration Tool"

EXPOSE 5000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run the application
CMD ["node", "src/app.js"]
