# Real-Time Code Collaboration Tool

A web-based platform for collaborative, real-time code editing where multiple users can join a room, edit code together, and chat in real-time.

## 🚀 Features

- **Real-time collaborative editing** - Multiple users can edit the same code simultaneously
- **Live chat** - Built-in chat system for team communication
- **Room-based collaboration** - Join or create rooms with simple room IDs
- **Monaco Editor** - Professional code editor with syntax highlighting
- **User presence** - See when users join and leave rooms
- **Responsive design** - Works on desktop and mobile devices

## 🛠 Technology Stack

- **Frontend**: React.js, Monaco Editor, Socket.IO Client
- **Backend**: Node.js, Express.js, Socket.IO Server
- **Styling**: Custom CSS with responsive design
- **Deployment**: Docker Compose for local development

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-time-code-collaboration
   ```

2. **Install and run Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend will be running at `http://localhost:5000`

3. **Install and run Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend will be running at `http://localhost:3000`

4. **Open your browser**
   Navigate to `http://localhost:3000` and start collaborating!

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```
   
2. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 📖 How to Use

1. **Join a Room**
   - Enter a room ID (or create a new one)
   - Your username will be automatically generated
   - Click "Join Room"

2. **Start Collaborating**
   - Write code in the Monaco editor
   - See real-time changes from other users
   - Use the chat panel to communicate

3. **Multiple Users**
   - Share your room ID with teammates
   - Everyone sees the same code in real-time
   - Chat messages appear instantly

## 🏗 Project Structure

```
real-time-code-collaboration/
├── backend/                 # Node.js backend server
│   ├── src/
│   │   └── app.js          # Main server file with Socket.IO
│   ├── package.json
│   └── Dockerfile
├── frontend/               # React frontend application  
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styling
│   │   └── index.js        # React entry point
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Docker orchestration
├── DEVELOPMENT_GUIDE.md    # Development guidelines
└── README.md              # This file
```

## 🔌 API Endpoints

### WebSocket Events (Socket.IO)

**Client to Server:**
- `join-room` - Join a collaboration room
- `code-change` - Send code changes to other users
- `chat-message` - Send chat messages

**Server to Client:**
- `init-code` - Receive initial code when joining
- `code-update` - Receive code changes from other users
- `chat-message` - Receive chat messages
- `user-joined` - Notification when user joins
- `user-left` - Notification when user leaves

### REST API

- `GET /` - Health check and API status
- `GET /rooms/:roomId` - Get room information (user count, participants)

## 🚧 Development

### Adding New Features

1. **Backend changes**: Edit `backend/src/app.js`
2. **Frontend changes**: Edit `frontend/src/App.js`
3. **Styling**: Update `frontend/src/App.css`

### Environment Variables

**Backend:**
- `PORT` - Server port (default: 5000)

**Frontend:**
- `REACT_APP_BACKEND_URL` - Backend URL for production builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔮 Future Enhancements

- [ ] User authentication (Google OAuth, JWT)
- [ ] Persistent room storage with MongoDB
- [ ] Code execution capabilities
- [ ] Multi-language syntax highlighting
- [ ] File management system
- [ ] User avatars and profiles
- [ ] Code version history
- [ ] Video/voice chat integration
- [ ] Screen sharing capabilities

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Issues

If you encounter any bugs or have feature requests, please create an issue on the GitHub repository.

---

**Happy Coding! 🎉**

Built with ❤️ for collaborative development