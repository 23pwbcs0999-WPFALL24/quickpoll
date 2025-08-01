import React, { useState } from 'react';
import { createPoll } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/CreatePoll.css';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [message, setMessage] = useState('');
  const [pollData, setPollData] = useState(null);
  const [tokenEnabled, setTokenEnabled] = useState(false);
  const [tokenCount, setTokenCount] = useState(10);

  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length >= 10) return;
    setOptions([...options, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || options.filter(opt => opt.trim()).length < 2) {
      setMessage('Please enter a question and at least two valid options.');
      return;
    }

    try {
      const response = await createPoll({
        question,
        options,
        settings: {
          ipRestriction: true,
          tokenVoting: tokenEnabled,
          tokenCount: tokenEnabled ? tokenCount : undefined
        }
      });
      setPollData(response.data);
      setMessage('');
    } catch (err) {
      setMessage('Error creating poll: ' + (err.response?.data?.error || ''));
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="create-poll-page">
      <div className="create-poll-container">
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="create-poll-form">
            <div className="form-header">
              <h2>Create a New Poll</h2>
              <p>Get instant votes with secure access</p>
            </div>

            <div className="form-section">
              <label className="label-text">Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here"
                className="poll-input"
              />
            </div>

            <div className="form-section">
              <label className="label-text">Options</label>
              <div className="options-list">
                {options.map((option, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="poll-input"
                  />
                ))}
              </div>
              <button type="button" className="add-btn" onClick={handleAddOption}>
                <span className="btn-icon">+</span> Add Option
              </button>
            </div>

            <div className="form-section">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={tokenEnabled}
                  onChange={() => setTokenEnabled(!tokenEnabled)}
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
                    placeholder="Enter number of tokens"
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Create Poll</button>
            </div>

            {message && (
              <div className="message-container">
                <p className="poll-message">{message}</p>
              </div>
            )}
          </form>

          {pollData && (
            <>
              <div className="poll-link-container">
                <div className="poll-link-label">Your Poll Link</div>
                <div className="poll-link-box">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/poll/${pollData.pollId}`}
                    className="poll-link-input"
                  />
                  <button className="copy-btn" onClick={() => handleCopy(`${window.location.origin}/poll/${pollData.pollId}`)}>Copy</button>
                </div>
              </div>

              <div className="poll-code-container">
                <div className="poll-code-label">Poll Code</div>
                <div className="poll-code-box">
                  <input
                    type="text"
                    readOnly
                    value={pollData.pollId}
                    className="poll-code-input"
                  />
                  <button className="copy-btn" onClick={() => handleCopy(pollData.pollId)}>Copy</button>
                </div>
              </div>

              {pollData.settings.tokenVoting && pollData.settings.tokens?.length > 0 && (
                <div className="poll-code-container">
                  <div className="poll-code-label">Voting Tokens</div>
                  <div className="poll-code-box" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <textarea
                      readOnly
                      rows="6"
                      value={pollData.settings.tokens.join('\n')}
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
    </div>
  );
}
