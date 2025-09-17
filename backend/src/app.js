const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'https://exoticaditya.github.io',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST"],
  credentials: true
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Socket.IO configuration
const io = new Server(server, { 
  cors: corsOptions,
  pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
  pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
});

// Simple in-memory storage for rooms and code (for MVP)
const rooms = {};

// Health monitoring
let serverStats = {
  startTime: new Date(),
  totalConnections: 0,
  activeConnections: 0,
  totalRooms: 0,
  totalMessages: 0
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  serverStats.totalConnections++;
  serverStats.activeConnections++;
  
  console.log(`User connected: ${socket.id}. Total active: ${serverStats.activeConnections}`);
  
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
    serverStats.totalRooms = Object.keys(rooms).length;
    
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
    serverStats.totalMessages++;
    if (rooms[roomId]) {
      rooms[roomId].lastActivity = new Date().toISOString();
    }
    // Send message to all users in the room (including sender)
    io.to(roomId).emit('chat-message', { message, username, timestamp: Date.now() });
  });

  socket.on('disconnect', () => {
    serverStats.activeConnections--;
    console.log(`User disconnected: ${socket.id}. Total active: ${serverStats.activeConnections}`);
    
    if (socket.roomId && socket.username && rooms[socket.roomId]) {
      rooms[socket.roomId].users.delete(socket.username);
      
      // Notify others in the room
      socket.to(socket.roomId).emit('user-left', socket.username);
      
      // Clean up empty rooms
      if (rooms[socket.roomId].users.size === 0) {
        console.log(`Cleaning up empty room: ${socket.roomId}`);
        delete rooms[socket.roomId];
        serverStats.totalRooms = Object.keys(rooms).length;
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
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Detailed health check with metrics
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
    },
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
    },
    server: {
      ...serverStats,
      activeRooms: Object.keys(rooms).length
    }
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong!'
    });
  } else {
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
      stack: err.stack
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource was not found'
  });
});

const PORT = process.env.PORT || 5000;
const serverInstance = server.listen(PORT, () => {
  console.log(`🚀 Real-time Code Collaboration Server running on port ${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  // Close server to stop accepting new connections
  serverInstance.close((err) => {
    if (err) {
      console.error('Error during server closure:', err);
      process.exit(1);
    }
    
    console.log('🔴 Server closed successfully');
    
    // Close Socket.IO server
    io.close(() => {
      console.log('🔴 Socket.IO server closed successfully');
      
      // Clean up resources
      console.log('🧹 Cleaning up resources...');
      
      process.exit(0);
    });
  });
  
  // Force close after 30 seconds
  setTimeout(() => {
    console.error('⚠️  Forcefully shutting down after 30s timeout');
    process.exit(1);
  }, 30000);
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});