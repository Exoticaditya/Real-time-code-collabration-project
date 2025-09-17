#!/bin/bash

# Real-time Code Collaboration Tool - Deployment Script
# This script helps deploy the application in different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="realtime-code-collab"
DOCKER_REGISTRY="your-registry.com" # Replace with your docker registry
VERSION=$(date +%Y%m%d-%H%M%S)

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Help function
show_help() {
    cat << EOF
Real-time Code Collaboration Tool - Deployment Script

Usage: $0 [OPTIONS]

OPTIONS:
    -e, --env ENVIRONMENT    Deployment environment (development|staging|production)
    -v, --version VERSION    Application version (default: current timestamp)
    -p, --push              Push images to registry
    -d, --deploy            Deploy to environment
    -c, --cleanup           Clean up old containers and images
    -h, --help              Show this help message

EXAMPLES:
    $0 -e development        # Build for development
    $0 -e production -p -d   # Build, push, and deploy to production
    $0 -c                    # Clean up old containers and images

EOF
}

# Parse arguments
ENVIRONMENT="development"
PUSH_IMAGES=false
DEPLOY=false
CLEANUP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        -p|--push)
            PUSH_IMAGES=true
            shift
            ;;
        -d|--deploy)
            DEPLOY=true
            shift
            ;;
        -c|--cleanup)
            CLEANUP=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    error "Invalid environment: $ENVIRONMENT. Must be one of: development, staging, production"
fi

log "Starting deployment for environment: $ENVIRONMENT"
log "Version: $VERSION"

# Cleanup function
cleanup() {
    if [[ "$CLEANUP" == true ]]; then
        log "Cleaning up old containers and images..."
        docker-compose down --remove-orphans || true
        docker system prune -f || true
        docker volume prune -f || true
        success "Cleanup completed"
    fi
}

# Build function
build_images() {
    log "Building images..."
    
    case $ENVIRONMENT in
        development)
            docker-compose build
            ;;
        staging|production)
            docker-compose -f docker-compose.prod.yml build
            ;;
    esac
    
    success "Images built successfully"
}

# Push function
push_images() {
    if [[ "$PUSH_IMAGES" == true ]]; then
        log "Pushing images to registry..."
        
        # Tag images
        docker tag ${APP_NAME}-backend:latest $DOCKER_REGISTRY/${APP_NAME}-backend:$VERSION
        docker tag ${APP_NAME}-frontend:latest $DOCKER_REGISTRY/${APP_NAME}-frontend:$VERSION
        
        # Push images
        docker push $DOCKER_REGISTRY/${APP_NAME}-backend:$VERSION
        docker push $DOCKER_REGISTRY/${APP_NAME}-frontend:$VERSION
        
        # Tag as latest for production
        if [[ "$ENVIRONMENT" == "production" ]]; then
            docker tag ${APP_NAME}-backend:latest $DOCKER_REGISTRY/${APP_NAME}-backend:latest
            docker tag ${APP_NAME}-frontend:latest $DOCKER_REGISTRY/${APP_NAME}-frontend:latest
            docker push $DOCKER_REGISTRY/${APP_NAME}-backend:latest
            docker push $DOCKER_REGISTRY/${APP_NAME}-frontend:latest
        fi
        
        success "Images pushed to registry"
    fi
}

# Deploy function
deploy_app() {
    if [[ "$DEPLOY" == true ]]; then
        log "Deploying application..."
        
        case $ENVIRONMENT in
            development)
                docker-compose up -d
                ;;
            staging|production)
                docker-compose -f docker-compose.prod.yml up -d
                ;;
        esac
        
        # Wait for services to be healthy
        log "Waiting for services to be healthy..."
        sleep 30
        
        # Health check
        if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
            success "Backend is healthy"
        else
            warning "Backend health check failed"
        fi
        
        if [[ "$ENVIRONMENT" == "production" ]]; then
            if curl -f http://localhost/health > /dev/null 2>&1; then
                success "Frontend is healthy"
            else
                warning "Frontend health check failed"
            fi
        else
            if curl -f http://localhost:3000 > /dev/null 2>&1; then
                success "Frontend is healthy"
            else
                warning "Frontend health check failed"
            fi
        fi
        
        success "Application deployed successfully"
        
        # Show running containers
        log "Running containers:"
        docker-compose ps
    fi
}

# Main execution
main() {
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker first."
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose &> /dev/null; then
        error "docker-compose is not installed. Please install it first."
    fi
    
    # Run cleanup if requested
    cleanup
    
    # Build images
    build_images
    
    # Push images if requested
    push_images
    
    # Deploy if requested
    deploy_app
    
    success "Deployment script completed successfully!"
    
    # Show useful information
    log "Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  View running containers: docker-compose ps"
    echo "  Access backend: http://localhost:5000"
    if [[ "$ENVIRONMENT" == "production" ]]; then
        echo "  Access frontend: http://localhost"
    else
        echo "  Access frontend: http://localhost:3000"
    fi
}

# Run main function
main
