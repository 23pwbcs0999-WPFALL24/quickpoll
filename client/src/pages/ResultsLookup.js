import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultsLookup.css';

export default function ResultsLookup() {
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
    navigate(`/poll/${code.trim()}/results`);
  };

  return (
    <div className="results-lookup-page">
      <div className="results-lookup-container">
        <h2>View Poll Results</h2>
        <form className="results-lookup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="results-input"
            placeholder="Enter poll code..."
            value={code}
            onChange={e => setCode(e.target.value)}
            autoFocus
          />
          <button type="submit" className="results-btn">View Results</button>
        </form>
        {error && <div className="results-error">{error}</div>}
        <div className="results-hint">Ask the poll creator for the code or link.</div>
      </div>
    </div>
  );
}