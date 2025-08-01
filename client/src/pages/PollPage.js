import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPoll, votePoll } from '../services/api';
import '../styles/PollPage.css';

export default function PollPage() {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [voted, setVoted] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    getPoll(id)
      .then(res => setPoll(res.data))
      .catch(() => setMessage('Poll not found'));
  }, [id]);

  const handleVote = async () => {
    try {
      const payload = { optionIndex: selected };
      if (poll.settings?.tokenVoting) {
        payload.token = token;
      }
      await votePoll(id, payload);
      setMessage('Thank you for voting!');
      setVoted(true);
    } catch (err) {
      setMessage('Error voting: ' + (err.response?.data?.error || ''));
    }
  };

  if (!poll) return <div className="poll-page-container">{message || 'Loading poll...'}</div>;

  return (
    <div className="poll-page-container">
      <h2 className="poll-header">{poll.question}</h2>
      {!voted ? (
        <>
          <div className="options-list">
            {poll.options.map((opt, idx) => (
              <button
                key={idx}
                className={`option-btn ${selected === idx ? 'selected' : ''}`}
                onClick={() => setSelected(idx)}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {poll.settings?.tokenVoting && (
            <div className="token-input-wrapper">
              <input
                type="text"
                placeholder="Enter your token"
                value={token}
                onChange={e => setToken(e.target.value)}
                className="token-input"
              />
            </div>
          )}

          <button className="vote-btn" onClick={handleVote} disabled={selected === null}>
            Vote
          </button>
        </>
      ) : (
        <div className="thank-you-message">
          <span role="img" aria-label="thanks">🎉</span> Thank you for voting!
        </div>
      )}
      {message && <p className="poll-message">{message}</p>}
    </div>
  );
}
