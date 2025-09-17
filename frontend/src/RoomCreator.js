import React, { useState } from 'react';
import './RoomCreator.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const RoomCreator = ({ onRoomCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createRandomRoom = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BACKEND_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        onRoomCreated(data.roomId);
      } else {
        setError('Failed to create room');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const generateRoomId = () => {
    const adjectives = ['awesome', 'cool', 'epic', 'super', 'mega', 'ultra', 'bright', 'swift', 'smart', 'quick'];
    const nouns = ['coders', 'devs', 'team', 'squad', 'crew', 'builders', 'makers', 'hackers', 'ninjas', 'wizards'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${randomAdj}-${randomNoun}-${randomNum}`;
  };

  return (
    <div className="room-creator">
      <h3>Create New Room</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="create-options">
        <div className="create-option">
          <button 
            onClick={createRandomRoom}
            disabled={loading}
            className="create-btn primary"
          >
            {loading ? 'Creating...' : '🎯 Create Random Room'}
          </button>
          <p className="option-description">
            Create a room with a randomly generated secure ID
          </p>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="create-option">
          <button 
            onClick={() => onRoomCreated(generateRoomId())}
            className="create-btn secondary"
          >
            🎲 Create Named Room
          </button>
          <p className="option-description">
            Create a room with a friendly, memorable name
          </p>
        </div>
      </div>

      <div className="create-tips">
        <h4>💡 Tips:</h4>
        <ul>
          <li>Share your room ID with teammates to collaborate</li>
          <li>Room IDs are case-sensitive</li>
          <li>Rooms are automatically cleaned up when empty</li>
        </ul>
      </div>
    </div>
  );
};

export default RoomCreator;
