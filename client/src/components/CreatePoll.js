import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePollContext } from '../context/PollContext';
import api from '../services/api';
import '../styles/CreatePoll.css';

const CreatePoll = () => {
  const navigate = useNavigate();
  const { addRecentPoll } = usePollContext();

  const [pollData, setPollData] = useState({
    question: '',
    options: ['', ''],
    settings: {
      ipRestriction: false,
      tokenVoting: false,
      tokenCount: 10
    }
  });

  const [error, setError] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData({ ...pollData, options: newOptions });
  };

  const addOption = () => {
    if (pollData.options.length < 6) {
      setPollData({
        ...pollData,
        options: [...pollData.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (pollData.options.length > 2) {
      setPollData({
        ...pollData,
        options: pollData.options.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredOptions = pollData.options.filter(opt => opt.trim() !== '');
      if (filteredOptions.length < 2) {
        setError('At least 2 options are required');
        return;
      }

      const response = await api.createPoll({
        ...pollData,
        options: filteredOptions
      });

      addRecentPoll(response);
      navigate(`/poll/${response.pollId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create poll');
      console.error('Create poll error:', err);
    }
  };

  return (
    <div className="create-poll-container">
      <h2>Create New Poll</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="poll-question">Your Question</label>
          <input
            id="poll-question"
            type="text"
            value={pollData.question}
            onChange={(e) => setPollData({ ...pollData, question: e.target.value })}
            placeholder="What's your question?"
            required
          />
        </div>

        <div className="form-group">
          <label>Options</label>
          {pollData.options.map((option, index) => (
            <div key={index} className="option-row">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {pollData.options.length > 2 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeOption(index)}
                  aria-label={`Remove option ${index + 1}`}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          {pollData.options.length < 6 && (
            <button
              type="button"
              className="add-option-btn"
              onClick={addOption}
            >
              + Add Option
            </button>
          )}
        </div>

        <div className="settings-section">
          <h3 style={{ marginBottom: '10px' }}>Poll Settings</h3>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <input
              type="checkbox"
              id="ip-restriction"
              checked={pollData.settings.ipRestriction}
              onChange={(e) => setPollData({
                ...pollData,
                settings: { ...pollData.settings, ipRestriction: e.target.checked }
              })}
              style={{ marginRight: '10px', width: '18px', height: '18px' }}
            />
            <label htmlFor="ip-restriction" style={{ fontSize: '16px' }}>
              Enable IP-based restriction
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <input
                type="checkbox"
                id="token-voting"
                checked={pollData.settings.tokenVoting}
                onChange={(e) => setPollData({
                  ...pollData,
                  settings: { ...pollData.settings, tokenVoting: e.target.checked }
                })}
                style={{ marginRight: '10px', width: '18px', height: '18px' }}
              />
              <label htmlFor="token-voting" style={{ fontSize: '16px' }}>
                Enable token-based voting
              </label>
            </div>

            {pollData.settings.tokenVoting && (
              <div style={{ marginLeft: '28px' }}>
                <label htmlFor="token-count" style={{ fontSize: '15px', marginRight: '10px' }}>
                  Number of tokens:
                </label>
                <input
                  id="token-count"
                  type="number"
                  min="1"
                  max="100"
                  value={pollData.settings.tokenCount}
                  onChange={(e) => setPollData({
                    ...pollData,
                    settings: {
                      ...pollData.settings,
                      tokenCount: Math.max(1, Math.min(100, parseInt(e.target.value) || 10))
                    }
                  })}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '80px',
                    fontSize: '15px'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
