const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/auth'); // Placeholder for actual middleware
const projectRoutes = require('./routes/projects'); // Placeholder for actual routes
const userRoutes = require('./routes/users'); // Placeholder for actual routes

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/realtime-collab', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware setup
app.use(bodyParser.json());
app.use(authMiddleware);

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Socket.IO logic for chat and code sync
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('code change', (code) => {
        socket.broadcast.emit('code change', code);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
