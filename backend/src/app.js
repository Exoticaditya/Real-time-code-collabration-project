const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  } 
});

app.use(cors());
app.use(express.json());

// Simple in-memory storage for rooms and code (for MVP)
const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('join-room', ({ roomId, username }) => {
    console.log(`${username} joining room: ${roomId}`);
    
    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username;
    
    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = { 
        code: '// Welcome to Real-time Code Collaboration!\n// Start coding together...\n\nfunction hello() {\n  console.log(\'Hello, World!\');\n}', 
        users: new Set(),
        lastActivity: new Date().toISOString()
      };
    }
    
    rooms[roomId].users.add(username);
    rooms[roomId].lastActivity = new Date().toISOString();
    
    // Send current code to the new user
    socket.emit('init-code', rooms[roomId].code);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', username);
    
    console.log(`Room ${roomId} now has ${rooms[roomId].users.size} users`);
  });

  socket.on('code-change', ({ roomId, code }) => {
    if (rooms[roomId]) {
      rooms[roomId].code = code;
      rooms[roomId].lastActivity = new Date().toISOString();
      // Broadcast to all other users in the room
      socket.to(roomId).emit('code-update', code);
    }
  });

  socket.on('chat-message', ({ roomId, message, username }) => {
    console.log(`Chat message in room ${roomId} from ${username}: ${message}`);
    if (rooms[roomId]) {
      rooms[roomId].lastActivity = new Date().toISOString();
    }
    // Send message to all users in the room (including sender)
    io.to(roomId).emit('chat-message', { message, username, timestamp: Date.now() });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    if (socket.roomId && socket.username && rooms[socket.roomId]) {
      rooms[socket.roomId].users.delete(socket.username);
      
      // Notify others in the room
      socket.to(socket.roomId).emit('user-left', socket.username);
      
      // Clean up empty rooms
      if (rooms[socket.roomId].users.size === 0) {
        console.log(`Cleaning up empty room: ${socket.roomId}`);
        delete rooms[socket.roomId];
      } else {
        console.log(`Room ${socket.roomId} now has ${rooms[socket.roomId].users.size} users`);
      }
    }
  });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Real-time Code Collaboration API is running!',
    activeRooms: Object.keys(rooms).length,
    timestamp: new Date().toISOString()
  });
});

// Get all active rooms
app.get('/rooms', (req, res) => {
  const activeRooms = Object.keys(rooms).map(roomId => ({
    roomId,
    userCount: rooms[roomId].users.size,
    users: Array.from(rooms[roomId].users),
    lastActivity: rooms[roomId].lastActivity || new Date().toISOString()
  }));
  res.json({ rooms: activeRooms, totalRooms: activeRooms.length });
});

// Get room info endpoint
app.get('/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  if (rooms[roomId]) {
    res.json({
      roomId,
      userCount: rooms[roomId].users.size,
      users: Array.from(rooms[roomId].users),
      lastActivity: rooms[roomId].lastActivity || new Date().toISOString()
    });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

// Create a new room with random ID
app.post('/rooms', (req, res) => {
  const roomId = 'room-' + Math.random().toString(36).substr(2, 9);
  rooms[roomId] = { 
    code: '// Welcome to your new collaboration room!\n// Share this room ID with your teammates\n\nfunction hello() {\n  console.log(\'Hello, World!\');\n}', 
    users: new Set(),
    lastActivity: new Date().toISOString()
  };
  res.json({ roomId, message: 'Room created successfully' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Real-time Code Collaboration Server running on port ${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}`);
});