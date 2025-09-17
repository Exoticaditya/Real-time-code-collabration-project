# Real-Time Code Collaboration Tool — MVP Specification

## Goal

Deliver a web application where multiple users can join the same room and collaboratively edit code in real-time, with integrated chat functionality.

---

## MVP Features

1. **Join/Create Room:**
   - Users enter a Room ID to join (no signup/login required).

2. **Real-Time Collaborative Coding:**
   - All changes in the code editor instantly reflect for all users in the room.

3. **In-Room Chat:**
   - Basic chat sidebar for participants.
   - Messages show username (randomly assigned on join).

4. **Code Editing Experience:**
   - Syntax highlighting for JavaScript (Monaco Editor).

5. **Simple UI:**
   - Minimalist, responsive layout.
   - Editor and chat displayed side by side.

---

## Non-Goals (for MVP)

- Persistent storage of code or chat history.
- User authentication or profiles.
- Multi-file or multi-language editing.
- Code execution/running.
- Mobile optimization.

---

## User Flow

1. User lands on homepage.
2. User enters Room ID and clicks "Join".
3. User enters the editor; code area and chat are visible.
4. User edits code and chats; all changes are broadcast in real-time to other room participants.

---

## Success Criteria

- Two or more users in the same room see each other's code updates instantly.
- Chat messages appear instantly for all room participants.
- No page reload is required to see updates.

---

## Tech Stack

- **Frontend:** React, Monaco Editor, Socket.IO-client
- **Backend:** Node.js, Express, Socket.IO-server
- **Deployment:** Docker Compose (local), Vercel/Heroku (cloud)

---

## How to Run

1. Start backend: `cd backend && npm install && npm start`
2. Start frontend: `cd frontend && npm install && npm start`
3. Visit `http://localhost:3000` in browser.

---

## Stretch Goals (Post-MVP)

- Authentication
- Persistent storage (MongoDB)
- Code execution
- UI/UX improvements
- Multiple languages, themes

---