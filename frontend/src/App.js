import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import LandingPage from "./LandingPage";
import './App.css';

// Get backend URL from environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const socket = io(BACKEND_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000
});

function App() {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [code, setCode] = useState("// Welcome to Real-time Code Collaboration!\n// Start coding together...\n\nfunction hello() {\n  console.log('Hello, World!');\n}");
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const username = useRef("User" + Math.floor(Math.random() * 1000));
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    socket.on("init-code", (code) => {
      if (code) {
        setCode(code);
      }
    });

    socket.on("code-update", (code) => setCode(code));
    
    socket.on("chat-message", ({ message, username }) =>
      setChat((prev) => [...prev, { type: 'message', content: `${username}: ${message}`, timestamp: Date.now() }])
    );
    
    socket.on("user-joined", (u) =>
      setChat((prev) => [...prev, { type: 'system', content: `${u} joined the room`, timestamp: Date.now() }])
    );

    socket.on("user-left", (u) =>
      setChat((prev) => [...prev, { type: 'system', content: `${u} left the room`, timestamp: Date.now() }])
    );

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const joinRoom = (roomId) => {
    if (!roomId.trim()) {
      alert("Please enter a room ID");
      return;
    }
    setRoomId(roomId);
    socket.emit("join-room", { roomId, username: username.current });
    setJoined(true);
  };

  const onCodeChange = (value) => {
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("chat-message", { roomId, message, username: username.current });
    setMessage("");
  };

  const leaveRoom = () => {
    socket.disconnect();
    socket.connect();
    setJoined(false);
    setRoomId("");
    setChat([]);
    setCode("// Welcome to Real-time Code Collaboration!\n// Start coding together...\n\nfunction hello() {\n  console.log('Hello, World!');\n}");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      alert('Room ID copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = roomId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Room ID copied to clipboard!');
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      joinRoom();
    }
  };

  const handleMessageKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!joined) {
    return (
      <LandingPage 
        onJoinRoom={joinRoom}
        connected={connected}
        username={username.current}
      />
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-left">
          <h2>Room: {roomId}</h2>
          <button onClick={copyRoomId} className="copy-btn" title="Copy room ID">
            📋 Copy ID
          </button>
        </div>
        <div className="header-center">
          <span className="room-share-text">Share this ID with teammates: <strong>{roomId}</strong></span>
        </div>
        <div className="header-right">
          <div className="user-info">
            {username.current} | Status: {connected ? 
              <span className="connected">Connected</span> : 
              <span className="disconnected">Disconnected</span>
            }
          </div>
          <button onClick={leaveRoom} className="leave-btn">
            🚪 Leave Room
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <div className="editor-panel">
          <Editor
            height="100%"
            language="javascript"
            value={code}
            onChange={onCodeChange}
            theme="vs-dark"
            options={{
              fontSize: 14,
              wordWrap: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>
        
        <div className="chat-panel">
          <div className="chat-header">
            <h3>Chat</h3>
          </div>
          <div className="chat-messages">
            {chat.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.type}`}>
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={handleMessageKeyPress}
            />
            <button onClick={sendMessage} disabled={!message.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;