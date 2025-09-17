# Deployment Guide

## Quick Deployment Options

### 🐳 Docker Deployment (Recommended)

#### Development
```bash
# Build and run in development mode
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

#### Production
```bash
# Build and run in production mode
docker-compose -f docker-compose.prod.yml up --build -d

# Access the application
# Frontend: http://localhost (port 80)
# Backend: http://localhost:5000
```

### 📦 Manual Deployment

#### Prerequisites
- Node.js 16+ 
- npm 7+
- Git

#### Steps
1. **Install root dependencies**
   ```bash
   npm install
   ```

2. **Install all project dependencies**
   ```bash
   npm run install:all
   ```

3. **Start in development mode**
   ```bash
   npm run start:dev
   ```

4. **Or start services separately**
   ```bash
   # Terminal 1 - Backend
   npm run start:backend
   
   # Terminal 2 - Frontend  
   npm run start:frontend
   ```

## Environment Configuration

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Socket.IO Configuration
SOCKET_PING_TIMEOUT=60000
SOCKET_PING_INTERVAL=25000
```

### Frontend (.env.production)
```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

## Cloud Deployment

### Heroku
1. Create two Heroku apps (frontend and backend)
2. Set environment variables
3. Deploy using Git or GitHub integration

### Vercel (Frontend) + Railway/Render (Backend)
1. Deploy frontend to Vercel
2. Deploy backend to Railway or Render
3. Update CORS settings and frontend API URL

### AWS/GCP/Azure
1. Use container services (ECS, Cloud Run, Container Instances)
2. Set up load balancer and SSL certificates
3. Configure environment variables

## Monitoring & Health Checks

### Health Check Endpoints
- Backend: `GET /api/health`
- Frontend: `GET /health` (through nginx)

### Monitoring
```bash
# View logs
docker-compose logs -f

# Check container status
docker-compose ps

# Resource usage
docker stats
```

## Scaling Considerations

### Horizontal Scaling
- Use Redis for session storage
- Implement sticky sessions for Socket.IO
- Use container orchestration (Kubernetes, Docker Swarm)

### Performance Optimization
- Enable gzip compression ✅
- Use CDN for static assets
- Implement connection pooling
- Add database indexing (when database is added)

## Security Checklist

- [x] CORS configuration
- [x] Rate limiting
- [x] Helmet security headers
- [x] Input validation
- [x] Error handling
- [ ] HTTPS/SSL (environment dependent)
- [ ] Authentication (future enhancement)
- [ ] Data encryption (future enhancement)

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill
lsof -ti:5000 | xargs kill
```

**Docker permission issues**
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
```

**Environment variables not loading**
- Check .env file location
- Verify variable names (no spaces)
- Restart application after changes

### Log Locations
- Backend logs: Console output
- Frontend logs: Browser console
- Docker logs: `docker-compose logs [service-name]`

## CI/CD Pipeline

The project includes GitHub Actions workflow for:
- ✅ Automated testing
- ✅ Security scanning  
- ✅ Docker building
- ✅ Multi-environment deployment

Workflow file: `.github/workflows/ci-cd.yml`

## Production Checklist

Before deploying to production:

- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up SSL certificates
- [ ] Configure monitoring and alerts
- [ ] Set up backup strategy
- [ ] Load test the application
- [ ] Set up logging aggregation
- [ ] Configure auto-scaling rules
- [ ] Set up disaster recovery

## Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test health endpoints
4. Check GitHub Issues
5. Create new issue with deployment details
