# Real-Time Code Collaboration Tool

## Project Overview
The Real-Time Code Collaboration Tool is a web-based application that enables multiple developers to work on the same codebase simultaneously. It provides real-time code synchronization, integrated chat, and session-based collaboration features.

## ✨ Features
- **Real-Time Code Editing**: Multiple users can edit code simultaneously with instant synchronization
- **Monaco Editor**: Professional code editor with syntax highlighting and modern features
- **Integrated Chat**: Built-in messaging system for communication during collaboration
- **Session Management**: Join specific coding sessions using session IDs
- **User Awareness**: See who's currently collaborating in your session
- **Responsive Design**: Works on desktop and tablet devices
- **Docker Support**: Complete containerization for easy deployment

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
git clone https://github.com/Exoticaditya/Real-time-code-collabration-project.git
cd Real-time-code-collabration-project/realtime-code-collab
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Local Development
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Exoticaditya/Real-time-code-collabration-project.git
   cd Real-time-code-collabration-project/realtime-code-collab
   ```

2. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Start the frontend (new terminal):**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📖 How to Use

1. **Open the application** in your web browser at http://localhost:3000
2. **Set your username** in the sidebar (optional)
3. **Join a session** by entering a session ID (or use the default)
4. **Start coding!** Your changes will appear in real-time for all collaborators
5. **Use the chat** to communicate with your team while coding
6. **Invite others** by sharing your session ID

## 🏗 Architecture

### Frontend
- **React 18**: Modern UI framework
- **Monaco Editor**: VS Code editor component
- **Socket.IO Client**: Real-time communication

### Backend
- **Express.js**: Web server framework
- **Socket.IO**: WebSocket communication
- **Node.js**: JavaScript runtime

### Infrastructure
- **Docker & Docker Compose**: Containerization
- **CORS**: Cross-origin resource sharing

## 📁 Project Structure
```
realtime-code-collab/
├── backend/
│   ├── src/
│   │   └── app.js          # Express server with Socket.IO
│   ├── package.json        # Backend dependencies
│   └── Dockerfile          # Backend container config
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styling
│   │   └── ...             # Other React files
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── package.json        # Frontend dependencies
│   └── Dockerfile          # Frontend container config
├── docker-compose.yml      # Docker Compose configuration
├── README.md              # This file
├── DEVELOPMENT_GUIDE.md   # Detailed development guide
└── MVP.md                 # MVP specifications
```

## 🔧 Development

For detailed development instructions, see [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md).

For MVP specifications and features, see [MVP.md](./MVP.md).

## 🌟 Key Features Demo

### Real-Time Collaboration
- Open the app in multiple browser tabs
- Join the same session ID
- Type in one tab and see changes appear instantly in others

### Chat System
- Use the integrated chat to discuss code changes
- Messages are scoped to each session
- See username and timestamp for each message

### Session Management
- Create or join sessions using custom session IDs
- Switch between sessions without losing work
- See connected users count and identifiers

## 🔧 Configuration

### Environment Variables

#### Backend
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode

#### Frontend
- `REACT_APP_BACKEND_URL`: Backend URL for API calls

### Port Configuration
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Backend API: http://localhost:5000/api/*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test with multiple browser tabs to ensure real-time sync works
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚀 Future Enhancements

- User authentication and persistent accounts
- Multiple file support within sessions  
- Code execution capabilities
- Integration with version control systems
- Advanced editor features (IntelliSense, debugging)
- Video/voice chat integration
- Project management features

## 👥 Authors

- **Aditya Malik** - Initial work and MVP implementation

## 🙏 Acknowledgments

- Monaco Editor team for the excellent code editor
- Socket.IO team for real-time communication capabilities
- React team for the fantastic UI framework

---

**Happy Collaborating! 🎉**

For technical support or questions, please open an issue in the GitHub repository.