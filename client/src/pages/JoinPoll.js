import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinPoll.css';

export default function JoinPoll() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a poll code.');
      return;
    }
    setError('');
    navigate(`/poll/${code.trim()}`);
  };

  return (
    <div className="join-poll-page">
      <div className="join-poll-container">
        <h2>Join a Poll</h2>
        <form className="join-poll-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="join-input"
            placeholder="Enter poll code..."
            value={code}
            onChange={e => setCode(e.target.value)}
            autoFocus
          />
          <button type="submit" className="join-btn">Join Poll</button>
        </form>
        {error && <div className="join-error">{error}</div>}
        <div className="join-hint">Ask the poll creator for the code or link.</div>
      </div>
    </div>
  );
}