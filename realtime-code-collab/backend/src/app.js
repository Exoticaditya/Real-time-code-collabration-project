const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Frontend URL
        methods: ["GET", "POST"]
    }
});

// Middleware setup
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Real-time Code Collaboration Server is running' });
});

// Store for active sessions and code state
const sessions = new Map();
const codeState = new Map();

// Socket.IO logic for real-time collaboration
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a coding session
    socket.on('join-session', (sessionId) => {
        socket.join(sessionId);
        
        // Add user to session
        if (!sessions.has(sessionId)) {
            sessions.set(sessionId, new Set());
        }
        sessions.get(sessionId).add(socket.id);
        
        console.log(`Client ${socket.id} joined session: ${sessionId}`);
        
        // Send current code state if exists
        if (codeState.has(sessionId)) {
            socket.emit('code-sync', codeState.get(sessionId));
        }
        
        // Notify others about new user
        socket.to(sessionId).emit('user-joined', { userId: socket.id });
    });

    // Handle code changes
    socket.on('code-change', (data) => {
        const { sessionId, code } = data;
        
        // Update code state
        codeState.set(sessionId, code);
        
        // Broadcast to all other clients in the session
        socket.to(sessionId).emit('code-sync', code);
    });

    // Handle chat messages
    socket.on('chat-message', (data) => {
        const { sessionId, message, username } = data;
        
        // Broadcast message to all clients in the session
        io.to(sessionId).emit('chat-message', {
            message,
            username: username || `User-${socket.id.substring(0, 6)}`,
            timestamp: new Date().toISOString()
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Remove user from all sessions
        sessions.forEach((users, sessionId) => {
            if (users.has(socket.id)) {
                users.delete(socket.id);
                socket.to(sessionId).emit('user-left', { userId: socket.id });
                
                // Clean up empty sessions
                if (users.size === 0) {
                    sessions.delete(sessionId);
                    codeState.delete(sessionId);
                }
            }
        });
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Real-time Code Collaboration Server is running on port ${PORT}`);
});