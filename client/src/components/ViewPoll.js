import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePollContext } from '../context/PollContext';
import api from '../services/api';
import PollResults from './PollResults';
import ShareButton from './ShareButton';
import LoadingSpinner from './LoadingSpinner';
import '../styles/ViewPoll.css';

const ViewPoll = () => {
  const { id } = useParams();
  const { updatePoll } = usePollContext();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [token, setToken] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Real-time poll data fetching
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const pollData = await api.getPoll(id);
        setPoll(pollData);
        
        // Check local storage for existing vote
        const votedPolls = JSON.parse(localStorage.getItem('quickpoll_votes') || '{}');
        if (votedPolls[id]) {
          setHasVoted(true);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load poll');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
    
    // Set up polling for live updates
    const intervalId = setInterval(fetchPoll, 5000);
    return () => clearInterval(intervalId);
  }, [id]);

  const handleVote = async () => {
    try {
      setIsLoading(true);
      const updatedPoll = await api.vote(id, selectedOption, token);
      
      // Update state and local storage
      setPoll(updatedPoll);
      setHasVoted(true);
      updatePoll(updatedPoll);
      
      const votedPolls = JSON.parse(localStorage.getItem('quickpoll_votes') || '{}');
      localStorage.setItem('quickpoll_votes', JSON.stringify({
        ...votedPolls,
        [id]: true
      }));
      
    } catch (err) {
      setError(err.response?.data?.error || 'Voting failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePoll = async () => {
    try {
      setIsLoading(true);
      const closedPoll = await api.closePoll(id);
      setPoll(closedPoll);
      updatePoll(closedPoll);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to close poll');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !poll) return <LoadingSpinner />;

  if (!poll) {
    return (
      <div className="error-container">
        <h2>Poll Not Found</h2>
        <p>{error || 'The requested poll does not exist or has expired.'}</p>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const isCreator = localStorage.getItem('quickpoll_creator') === poll.creatorId;

  return (
    <div className="view-poll-container">
      <header className="poll-header">
        <h1>{poll.question}</h1>
        <div className="poll-meta">
          <span className="status-badge" data-status={poll.isOpen ? 'open' : 'closed'}>
            {poll.isOpen ? 'Live' : 'Closed'}
          </span>
          {totalVotes > 0 && (
            <span className="votes-count">{totalVotes} votes</span>
          )}
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}

      {poll.isOpen ? (
        hasVoted ? (
          <div className="results-section">
            <h2>Your Vote Has Been Recorded</h2>
            <PollResults options={poll.options} />
          </div>
        ) : (
          <div className="voting-section">
            <h2>Cast Your Vote</h2>
            
            {poll.settings?.tokenVoting && (
              <div className="token-input">
                <label>Enter Voting Token:</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Your single-use token"
                  required
                />
              </div>
            )}
            
            <div className="options-grid">
              {poll.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-card ${selectedOption === index ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(index)}
                >
                  {option.text}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleVote}
              disabled={selectedOption === null || (poll.settings?.tokenVoting && !token)}
              className="vote-button"
            >
              Submit Vote
            </button>
          </div>
        )
      ) : (
        <div className="results-section">
          <h2>Final Results</h2>
          <PollResults options={poll.options} />
        </div>
      )}

      <div className="action-panel">
        <ShareButton pollId={id} />
        
        {isCreator && poll.isOpen && (
          <button
            onClick={handleClosePoll}
            disabled={isLoading}
            className="close-button"
          >
            {isLoading ? 'Closing...' : 'Close Poll'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewPoll;
