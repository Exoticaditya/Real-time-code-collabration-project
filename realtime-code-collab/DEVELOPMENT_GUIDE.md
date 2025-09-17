# Development Guide

## Real-Time Code Collaboration Tool

This guide will help you set up and develop the Real-Time Code Collaboration Tool.

## Project Structure

```
realtime-code-collab/
├── backend/
│   ├── src/
│   │   └── app.js          # Express server with Socket.IO
│   ├── package.json        # Backend dependencies
│   └── Dockerfile          # Backend Docker configuration
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styling
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── package.json        # Frontend dependencies
│   └── Dockerfile          # Frontend Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── README.md              # Project documentation
├── DEVELOPMENT_GUIDE.md   # This file
└── MVP.md                 # MVP specifications
```

## Prerequisites

- Node.js 18+ 
- npm 8+
- Docker and Docker Compose (for containerized development)

## Development Setup

### Option 1: Local Development (Recommended for development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Exoticaditya/Real-time-code-collabration-project.git
   cd Real-time-code-collabration-project/realtime-code-collab
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server:**
   ```bash
   cd ../backend
   npm start
   ```
   The backend will run on http://localhost:5000

5. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000

### Option 2: Docker Development

1. **Clone and navigate:**
   ```bash
   git clone https://github.com/Exoticaditya/Real-time-code-collabration-project.git
   cd Real-time-code-collabration-project/realtime-code-collab
   ```

2. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

Both services will start automatically:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Technology Stack

### Backend
- **Express.js**: Web server framework
- **Socket.IO**: Real-time bidirectional communication
- **CORS**: Cross-Origin Resource Sharing middleware

### Frontend
- **React**: UI library
- **Monaco Editor**: Code editor (VS Code editor)
- **Socket.IO Client**: Real-time communication with backend

## Key Features Implementation

### Real-Time Code Synchronization
- Uses Socket.IO for bidirectional communication
- Code changes are broadcasted to all connected users in the same session
- Maintains code state on the server for new users joining sessions

### Session Management
- Users can join different coding sessions using session IDs
- Session state is managed in-memory (can be extended with persistence)
- Automatic cleanup of empty sessions

### Chat System
- Real-time messaging within each session
- Messages include username, timestamp, and content
- Chat history is maintained per session

### User Management
- Basic username system
- Displays connected users in each session
- Handles user join/leave events

## API Endpoints

### REST Endpoints
- `GET /api/health` - Health check endpoint

### Socket.IO Events

#### Client to Server
- `join-session` - Join a coding session
- `code-change` - Broadcast code changes
- `chat-message` - Send chat messages

#### Server to Client
- `code-sync` - Receive code updates
- `chat-message` - Receive chat messages
- `user-joined` - User joined notification
- `user-left` - User left notification

## Development Commands

### Backend Development
```bash
cd backend
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

### Frontend Development
```bash
cd frontend
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

### Docker Commands
```bash
docker-compose up              # Start all services
docker-compose up --build      # Rebuild and start
docker-compose down            # Stop all services
docker-compose logs frontend   # View frontend logs
docker-compose logs backend    # View backend logs
```

## Configuration

### Environment Variables

#### Backend
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

#### Frontend
- `REACT_APP_BACKEND_URL`: Backend URL (default: http://localhost:5000)

## Development Workflow

1. **Feature Development:**
   - Create feature branch from main
   - Develop locally using `npm start` commands
   - Test real-time features with multiple browser tabs
   - Ensure both frontend and backend changes work together

2. **Testing Real-Time Features:**
   - Open multiple browser tabs/windows
   - Join the same session ID
   - Test code synchronization across tabs
   - Test chat functionality
   - Test user join/leave events

3. **Code Quality:**
   - Follow React and Node.js best practices
   - Maintain separation of concerns
   - Use meaningful variable and function names
   - Add comments for complex logic

## Common Issues and Solutions

### CORS Issues
- Ensure backend CORS is configured for frontend URL
- Check that Socket.IO CORS settings match frontend URL

### Connection Issues
- Verify both services are running
- Check that ports 3000 and 5000 are available
- Ensure backend URL in frontend matches actual backend address

### Docker Issues
- Ensure Docker and Docker Compose are installed
- Check that ports are not being used by other applications
- Use `docker-compose down` before rebuilding if needed

## Next Steps for Production

1. **Persistence Layer:**
   - Add MongoDB/PostgreSQL for session and user data
   - Implement proper user authentication
   - Store chat history and code snapshots

2. **Security:**
   - Add JWT authentication
   - Implement rate limiting
   - Add input validation and sanitization

3. **Scalability:**
   - Add Redis for session management across multiple server instances
   - Implement horizontal scaling with load balancers
   - Add WebSocket clustering support

4. **Additional Features:**
   - File system support (multiple files per session)
   - Language server integration
   - Code execution capabilities
   - Version control integration

This development guide should help you get started with developing the Real-Time Code Collaboration Tool!