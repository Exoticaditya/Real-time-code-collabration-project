import React, { useState, useRef } from 'react';
import RoomBrowser from './RoomBrowser';
import RoomCreator from './RoomCreator';
import RecentRooms from './RecentRooms';
import './LandingPage.css';

const LandingPage = ({ onJoinRoom, connected, username }) => {
  const [customRoomId, setCustomRoomId] = useState('');
  const [activeTab, setActiveTab] = useState('join');
  const recentRoomsRef = useRef();

  const handleJoinRoom = (roomId) => {
    if (!roomId.trim()) {
      alert("Please enter a room ID");
      return;
    }
    
    // Add to recent rooms
    if (recentRoomsRef.current?.addRecentRoom) {
      recentRoomsRef.current.addRecentRoom(roomId);
    } else {
      // Fallback if ref doesn't work
      const existingRooms = JSON.parse(localStorage.getItem('recentRooms') || '[]');
      const updatedRooms = [
        {
          id: roomId,
          joinedAt: new Date().toISOString(),
          name: roomId
        },
        ...existingRooms.filter(room => room.id !== roomId)
      ].slice(0, 5);
      localStorage.setItem('recentRooms', JSON.stringify(updatedRooms));
    }
    
    onJoinRoom(roomId);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinRoom(customRoomId);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-header">
          <h1>🚀 Real-time Code Collaboration</h1>
          <p className="subtitle">Code together, create together</p>
          
          <div className="status-bar">
            <div className="connection-status">
              Status: {connected ? 
                <span className="connected">✅ Connected</span> : 
                <span className="disconnected">❌ Disconnected</span>
              }
            </div>
            <div className="user-info">
              👤 {username}
            </div>
          </div>
        </div>

        <div className="landing-content">
          <RecentRooms 
            ref={recentRoomsRef}
            onJoinRoom={handleJoinRoom} 
          />
          
          <div className="main-actions">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'join' ? 'active' : ''}`}
                onClick={() => handleTabChange('join')}
              >
                🔗 Join Room
              </button>
              <button 
                className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => handleTabChange('create')}
              >
                ➕ Create Room
              </button>
              <button 
                className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
                onClick={() => handleTabChange('browse')}
              >
                📋 Browse Rooms
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'join' && (
                <div className="join-room-section">
                  <h3>Join Existing Room</h3>
                  <div className="custom-room-input">
                    <input
                      type="text"
                      placeholder="Enter room ID (e.g., awesome-coders-123)"
                      value={customRoomId}
                      onChange={e => setCustomRoomId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="room-id-input"
                    />
                    <button 
                      onClick={() => handleJoinRoom(customRoomId)}
                      disabled={!connected || !customRoomId.trim()}
                      className="join-btn"
                    >
                      Join Room
                    </button>
                  </div>
                  <p className="input-help">
                    💡 Get a room ID from a teammate or create a new room below
                  </p>
                </div>
              )}

              {activeTab === 'create' && (
                <RoomCreator onRoomCreated={handleJoinRoom} />
              )}

              {activeTab === 'browse' && (
                <RoomBrowser onJoinRoom={handleJoinRoom} />
              )}
            </div>
          </div>
        </div>

        <div className="landing-footer">
          <div className="features-list">
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Real-time editing</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💬</span>
              <span>Live chat</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎨</span>
              <span>Syntax highlighting</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👥</span>
              <span>Multi-user support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
