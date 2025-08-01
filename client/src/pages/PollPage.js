import React, { useEffect, useState, useRef } from 'react';
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
  const [loading, setLoading] = useState(false);

  const tokenInputRef = useRef(null);

  useEffect(() => {
    getPoll(id)
      .then(res => setPoll(res.data))
      .catch(() => setMessage('Poll not found'));
  }, [id]);

  useEffect(() => {
    if (poll?.settings?.tokenVoting && tokenInputRef.current) {
      tokenInputRef.current.focus();
    }
  }, [poll]);

  const handleVote = async () => {
    if (selected === null) return;

    setLoading(true);
    try {
      const payload = { optionIndex: selected };
      if (poll.settings?.tokenVoting) {
        if (!token.trim()) {
          setMessage('Token is required to vote.');
          setLoading(false);
          return;
        }
        payload.token = token.trim();
      }

      const res = await votePoll(id, payload);
      setPoll(res.data); // update poll with new vote count
      setVoted(true);
      setMessage('Thank you for voting!');
    } catch (err) {
      setMessage('Error voting: ' + (err.response?.data?.error || 'Something went wrong.'));
    } finally {
      setLoading(false);
    }
  };

  if (!poll) return <div className="poll-page-container">{message || 'Loading poll...'}</div>;

  if (!poll.isOpen) {
    return (
      <div className="poll-page-container">
        <h2 className="poll-header">{poll.question}</h2>
        <p className="poll-message">This poll is closed.</p>
      </div>
    );
  }

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
                ref={tokenInputRef}
                type="text"
                placeholder="Enter your token"
                value={token}
                onChange={e => setToken(e.target.value)}
                className="token-input"
              />
            </div>
          )}

          <button
            className="vote-btn"
            onClick={handleVote}
            disabled={selected === null || loading}
          >
            {loading ? 'Submitting...' : 'Vote'}
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
