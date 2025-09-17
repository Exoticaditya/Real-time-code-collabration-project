import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import './App.css';

const BACKEND_URL = 'http://localhost:5000';

function App() {
  const [code, setCode] = useState('// Welcome to Real-time Code Collaboration!\n// Start coding and see changes in real-time\n\nfunction hello() {\n  console.log("Hello, collaborative world!");\n}');
  const [sessionId, setSessionId] = useState('default-session');
  const [username, setUsername] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef();
  const editorRef = useRef();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(BACKEND_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      
      // Join the default session
      socketRef.current.emit('join-session', sessionId);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Handle code synchronization
    socketRef.current.on('code-sync', (newCode) => {
      setCode(newCode);
    });

    // Handle chat messages
    socketRef.current.on('chat-message', (messageData) => {
      setChatMessages(prev => [...prev, messageData]);
    });

    // Handle user events
    socketRef.current.on('user-joined', (data) => {
      console.log('User joined:', data.userId);
      setConnectedUsers(prev => [...prev, data.userId]);
    });

    socketRef.current.on('user-left', (data) => {
      console.log('User left:', data.userId);
      setConnectedUsers(prev => prev.filter(id => id !== data.userId));
    });

    // Cleanup on unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, [sessionId]);

  const handleEditorChange = (value) => {
    setCode(value);
    
    // Emit code changes to other users
    if (socketRef.current && value !== undefined) {
      socketRef.current.emit('code-change', {
        sessionId,
        code: value
      });
    }
  };

  const sendChatMessage = () => {
    if (currentMessage.trim() && socketRef.current) {
      socketRef.current.emit('chat-message', {
        sessionId,
        message: currentMessage.trim(),
        username: username || `User-${socketRef.current.id?.substring(0, 6)}`
      });
      setCurrentMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  };

  const joinNewSession = () => {
    const newSessionId = document.getElementById('session-input').value.trim();
    if (newSessionId && newSessionId !== sessionId) {
      setSessionId(newSessionId);
      setChatMessages([]);
      setConnectedUsers([]);
      
      // Join new session
      if (socketRef.current) {
        socketRef.current.emit('join-session', newSessionId);
      }
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Real-time Code Collaboration</h1>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </header>

      <div className="main-container">
        <div className="sidebar">
          <div className="user-section">
            <h3>User Settings</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
            />
          </div>

          <div className="session-section">
            <h3>Session</h3>
            <div className="session-controls">
              <input
                id="session-input"
                type="text"
                placeholder="Session ID"
                defaultValue={sessionId}
                className="session-input"
              />
              <button onClick={joinNewSession} className="join-btn">
                Join
              </button>
            </div>
            <div className="current-session">
              Current: <strong>{sessionId}</strong>
            </div>
          </div>

          <div className="users-section">
            <h3>Connected Users ({connectedUsers.length + 1})</h3>
            <div className="users-list">
              <div className="user-item">You</div>
              {connectedUsers.map(userId => (
                <div key={userId} className="user-item">
                  User-{userId.substring(0, 6)}
                </div>
              ))}
            </div>
          </div>

          <div className="chat-section">
            <h3>Chat</h3>
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <strong>{msg.username}:</strong> {msg.message}
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
              />
              <button onClick={sendChatMessage} className="send-btn">
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="editor-container">
          <div className="editor-header">
            <h3>Code Editor</h3>
            <div className="editor-info">
              Language: JavaScript | Session: {sessionId}
            </div>
          </div>
          <Editor
            ref={editorRef}
            height="70vh"
            defaultLanguage="javascript"
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              wordWrap: 'on',
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;