import React, { useState, useEffect } from 'react';
import './RecentRooms.css';

const RecentRooms = ({ onJoinRoom }) => {
  const [recentRooms, setRecentRooms] = useState([]);

  useEffect(() => {
    loadRecentRooms();
  }, []);

  const loadRecentRooms = () => {
    const stored = localStorage.getItem('recentRooms');
    if (stored) {
      try {
        const rooms = JSON.parse(stored);
        setRecentRooms(rooms.slice(0, 5)); // Keep only last 5 rooms
      } catch (error) {
        console.error('Failed to parse recent rooms:', error);
        localStorage.removeItem('recentRooms');
      }
    }
  };

  const addRecentRoom = (roomId) => {
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
    setRecentRooms(updatedRooms);
  };

  const removeRecentRoom = (roomId) => {
    const existingRooms = JSON.parse(localStorage.getItem('recentRooms') || '[]');
    const updatedRooms = existingRooms.filter(room => room.id !== roomId);
    localStorage.setItem('recentRooms', JSON.stringify(updatedRooms));
    setRecentRooms(updatedRooms);
  };

  const handleJoinRoom = (roomId) => {
    addRecentRoom(roomId);
    onJoinRoom(roomId);
  };

  const formatJoinTime = (joinedAt) => {
    const now = new Date();
    const joined = new Date(joinedAt);
    const diffMinutes = Math.floor((now - joined) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return joined.toLocaleDateString();
  };

  // Expose the addRecentRoom function so parent can call it
  React.useImperativeHandle(React.forwardRef((props, ref) => ({
    addRecentRoom
  })), []);

  if (recentRooms.length === 0) {
    return null;
  }

  return (
    <div className="recent-rooms">
      <h3>Recent Rooms</h3>
      <div className="recent-rooms-list">
        {recentRooms.map((room) => (
          <div key={room.id} className="recent-room-item">
            <div className="room-info">
              <span className="room-name">{room.name}</span>
              <span className="join-time">{formatJoinTime(room.joinedAt)}</span>
            </div>
            <div className="room-actions">
              <button 
                onClick={() => handleJoinRoom(room.id)}
                className="rejoin-btn"
                title="Rejoin room"
              >
                ↩️ Rejoin
              </button>
              <button 
                onClick={() => removeRecentRoom(room.id)}
                className="remove-btn"
                title="Remove from recent"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={() => {
          localStorage.removeItem('recentRooms');
          setRecentRooms([]);
        }}
        className="clear-all-btn"
      >
        Clear All
      </button>
    </div>
  );
};

export default RecentRooms;
