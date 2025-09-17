import React, { useState, useEffect } from 'react';
import './RoomBrowser.css';

const RoomBrowser = ({ onJoinRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRooms();
    // Refresh room list every 5 seconds
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms);
      } else {
        setError('Failed to fetch rooms');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatLastActivity = (lastActivity) => {
    const now = new Date();
    const activity = new Date(lastActivity);
    const diffMinutes = Math.floor((now - activity) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return activity.toLocaleDateString();
  };

  return (
    <div className="room-browser">
      <div className="room-browser-header">
        <h3>Active Rooms</h3>
        <button onClick={fetchRooms} className="refresh-btn" disabled={loading}>
          {loading ? '↻' : '⟲'} Refresh
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {rooms.length === 0 && !loading && !error && (
        <div className="no-rooms">
          <p>No active rooms found</p>
          <p>Create a new room to get started!</p>
        </div>
      )}
      
      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room.roomId} className="room-card">
            <div className="room-info">
              <h4 className="room-id">{room.roomId}</h4>
              <div className="room-meta">
                <span className="user-count">
                  👥 {room.userCount} {room.userCount === 1 ? 'user' : 'users'}
                </span>
                <span className="last-activity">
                  🕐 {formatLastActivity(room.lastActivity)}
                </span>
              </div>
              {room.users.length > 0 && (
                <div className="room-users">
                  <strong>Users:</strong> {room.users.join(', ')}
                </div>
              )}
            </div>
            <button 
              onClick={() => onJoinRoom(room.roomId)}
              className="join-room-btn"
            >
              Join Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomBrowser;
