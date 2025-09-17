# Real-Time Code Collaboration Tool — Development Guide

## Overview

Build a web-based platform for collaborative, real-time code editing. Users can join a room, edit code together, and chat. The MVP focuses on simplicity, stability, and core real-time features.

---

## 1. Technology Stack

- **Frontend:** React.js, [Monaco Editor](https://microsoft.github.io/monaco-editor/), Socket.IO-client
- **Backend:** Node.js, Express.js, Socket.IO-server
- **Database:** Not needed for MVP; in-memory storage is sufficient
- **Deployment:** Docker Compose (local), or Vercel/Heroku (cloud)

---

## 2. MVP Feature List

- **Room creation/joining:** Users can join a unique code room by entering a Room ID.
- **Real-time collaborative editing:** Code updates propagate instantly to all users in the same room.
- **In-room chat:** Users can send/receive chat messages in a sidebar.
- **Basic user identification:** Temporary username generated on join (no authentication in MVP).
- **Syntax highlighting:** Monaco Editor supports JavaScript syntax by default.

---

## 3. File Structure

```
realtime-code-collab/
├── backend/
│   ├── src/app.js
│   └── package.json
├── frontend/
│   ├── src/App.js
│   └── package.json
├── docker-compose.yml
├── README.md
└── DEVELOPMENT_GUIDE.md
```

---

## 4. Development Steps

### A. Backend Setup

1. **Initialize Node.js project**
   - Install `express`, `socket.io`, `cors`.
2. **Create Express server**
   - Set up HTTP server and attach Socket.IO.
3. **Implement Socket.IO events**
   - Handle `join-room`, `code-change`, and `chat-message` events.
   - Use in-memory JS objects for rooms and code states.
4. **Test locally with Postman or browser clients.**

### B. Frontend Setup

1. **Create React app**
   - Install `@monaco-editor/react`, `socket.io-client`.
2. **Build UI**
   - Simple page to join/create a room.
   - Editor panel (Monaco) and chat sidebar.
3. **Implement real-time events**
   - Connect to Socket.IO backend.
   - Listen for code/chat changes and update UI.
   - Emit code changes/chat to server.
4. **Test multi-user flows by opening multiple tabs.**

### C. Docker Compose (Optional for Local Dev)

- Set up services for backend and frontend.
- Map ports (`5000` for backend, `3000` for frontend).

---

## 5. Next Steps After MVP

- Add user authentication (Google OAuth, JWT, etc.)
- Use MongoDB for persistent rooms and chat history.
- Code execution (Judge0 API or similar).
- Multi-language support, file management.
- Enhanced UI/UX, user avatars, code versioning.

---

## 6. Resources

- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/)
- [Socket.IO Docs](https://socket.io/docs/)
- [React Docs](https://reactjs.org/)
- [Express Docs](https://expressjs.com/)

---

Happy building! 🚀