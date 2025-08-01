import React, { useState } from 'react';
import { createPoll } from '../services/api';
import '../styles/CreatePoll.css';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [message, setMessage] = useState('');
  const [pollData, setPollData] = useState(null);
  const [tokenEnabled, setTokenEnabled] = useState(false);
  const [tokenCount, setTokenCount] = useState(10);
  const [ipRestricted, setIpRestricted] = useState(false); // ← NEW STATE

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validOptions = options.filter(opt => opt.trim());

    if (!question.trim() || validOptions.length < 2) {
      setMessage('Please provide a question and at least two valid options.');
      return;
    }

    try {
      const response = await createPoll({
        question,
        options: validOptions,
        settings: {
          ipRestriction: ipRestricted,
          tokenVoting: tokenEnabled,
          tokenCount: tokenEnabled ? tokenCount : undefined
        }
      });

      setPollData(response.data);
      setMessage('');
    } catch (err) {
      setMessage('Error creating poll: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="create-poll-page">
      <div className="create-poll-container">
        <form onSubmit={handleSubmit} className="create-poll-form">
          <div className="form-header">
            <h2>Create a New Poll</h2>
            <p>Collect votes securely and easily</p>
          </div>

          <div className="form-section">
            <label className="label-text">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="poll-input"
              placeholder="Type your question"
            />
          </div>

          <div className="form-section">
            <label className="label-text">Options</label>
            {options.map((option, idx) => (
              <input
                key={idx}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="poll-input"
                placeholder={`Option ${idx + 1}`}
              />
            ))}
            <button type="button" className="add-btn" onClick={handleAddOption}>
              <span className="btn-icon">+</span> Add Option
            </button>
          </div>

          <div className="form-section">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={ipRestricted}
                onChange={() => setIpRestricted(prev => !prev)}
                className="toggle-input"
              />
              Enable IP-based restriction
            </label>
          </div>

          <div className="form-section">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={tokenEnabled}
                onChange={() => setTokenEnabled(prev => !prev)}
                className="toggle-input"
              />
              Enable token-based voting
            </label>

            {tokenEnabled && (
              <div style={{ marginTop: '1rem' }}>
                <label className="label-text">Number of Tokens</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tokenCount}
                  onChange={(e) => setTokenCount(Number(e.target.value))}
                  className="poll-input"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Create Poll</button>
          </div>

          {message && <p className="poll-message">{message}</p>}
        </form>

        {pollData && (
          <>
            <div className="poll-link-container">
              <div className="poll-link-label">Poll Link</div>
              <div className="poll-link-box">
                <input
                  readOnly
                  value={`${window.location.origin}/poll/${pollData.pollId}`}
                  className="poll-link-input"
                />
                <button onClick={() => handleCopy(`${window.location.origin}/poll/${pollData.pollId}`)} className="copy-btn">
                  Copy
                </button>
              </div>
            </div>

            <div className="poll-code-container">
              <div className="poll-code-label">Poll Code</div>
              <div className="poll-code-box">
                <input
                  readOnly
                  value={pollData.pollId}
                  className="poll-code-input"
                />
                <button onClick={() => handleCopy(pollData.pollId)} className="copy-btn">
                  Copy
                </button>
              </div>
            </div>

            {pollData.settings.tokenVoting && pollData.settings.tokens?.length > 0 && (
              <div className="poll-code-container">
                <div className="poll-code-label">Voting Tokens</div>
                <div className="poll-code-box" style={{ flexDirection: 'column' }}>
                  <textarea
                    readOnly
                    rows="6"
                    value={pollData.settings.tokens.join('\n')}
                    className="poll-tokens-textarea"
                    style={{
                      width: '100%',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      resize: 'vertical',
                      marginBottom: '1rem'
                    }}
                  />
                  <button className="copy-btn" onClick={() => handleCopy(pollData.settings.tokens.join('\n'))}>
                    Copy All Tokens
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
