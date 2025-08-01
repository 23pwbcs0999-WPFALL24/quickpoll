import React, { useState } from 'react';
import '../styles/CreatePoll.css';
import { createPoll } from '../services/api';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [tokenVoting, setTokenVoting] = useState(true); // default ON
  const [ipRestriction, setIpRestriction] = useState(false);
  const [message, setMessage] = useState('');
  const [pollLink, setPollLink] = useState('');
  const [pollCode, setPollCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        question,
        options,
        settings: {
          tokenVoting,
          ipRestriction,
        },
      };
      const res = await createPoll(payload);
      const pollId = res.data.pollId;
      const link = `${window.location.origin}/poll/${pollId}`;
      setPollLink(link);
      setPollCode(pollId);
      setMessage('Poll created successfully!');
    } catch (err) {
      setMessage('Error creating poll');
    }
  };

  const handleCopy = () => {
    if (pollLink) {
      navigator.clipboard.writeText(pollLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleCopyCode = () => {
    if (pollCode) {
      navigator.clipboard.writeText(pollCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1500);
    }
  };

  return (
    <div className="create-poll-page">
      <div className="create-poll-container">
        <div className="form-wrapper">
          <form className="create-poll-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Create Your Poll</h2>
              <p>Create and share polls in seconds</p>
            </div>

            <div className="form-section">
              <label>
                <span className="label-text">Poll Question</span>
                <input
                  type="text"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  required
                  className="poll-input"
                  placeholder="What would you like to ask?"
                />
              </label>
            </div>

            <div className="form-section">
              <label>
                <span className="label-text">Poll Options</span>
                <div className="options-list">
                  {options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={e => handleOptionChange(idx, e.target.value)}
                      required
                      className="poll-input"
                    />
                  ))}
                </div>
              </label>
              <button type="button" onClick={addOption} className="add-btn">
                <span className="btn-icon">+</span> Add Option
              </button>
            </div>

            <div className="form-section">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={tokenVoting}
                  onChange={e => setTokenVoting(e.target.checked)}
                />
                Enable Token Voting (only users with tokens can vote)
              </label>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={ipRestriction}
                  onChange={e => setIpRestriction(e.target.checked)}
                />
                Restrict by IP (prevent votes from same IP)
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <span className="btn-icon">🚀</span> Create Poll
              </button>
            </div>
          </form>

          {pollCode && (
            <div className="poll-code-container">
              <div className="poll-code-label">Poll Code (share this code to join):</div>
              <div className="poll-code-box">
                <input
                  type="text"
                  value={pollCode}
                  readOnly
                  className="poll-code-input"
                  onFocus={e => e.target.select()}
                />
                <button className="copy-btn" onClick={handleCopyCode} type="button">
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>
          )}

          {pollLink && (
            <div className="poll-link-container">
              <div className="poll-link-label">Or share this link:</div>
              <div className="poll-link-box">
                <input
                  type="text"
                  value={pollLink}
                  readOnly
                  className="poll-link-input"
                  onFocus={e => e.target.select()}
                />
                <button className="copy-btn" onClick={handleCopy} type="button">
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}

          {message && !pollLink && (
            <div className="message-container">
              <p className="poll-message">{message}</p>
            </div>
          )}

          <div className="info-note">
            <p>💡 After creating a poll, share the code or link above so others can join and vote!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
