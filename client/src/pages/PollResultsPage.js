import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPoll } from '../services/api';
import PollResults from '../components/PollResults';
import './PollResultsPage.css';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const PollResultsPage = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let socket;
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getPoll(id);
        setPoll(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Poll not found. It may have been deleted or the link is incorrect.');
        } else if (err.response?.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Failed to load poll results. Please check your connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();

    // --- SOCKET.IO REAL-TIME ---
    socket = io(SOCKET_URL);
    socket.emit('joinPoll', id);
    socket.on('voteUpdate', (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [id]);

  // Calculate total votes robustly
  const totalVotes = poll?.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  if (loading) {
    return (
      <div className="results-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading poll results...</p>
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="results-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error || 'Poll not found'}</p>
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-header">
        <h1>Poll Results</h1>
        <p className="poll-question">{poll.question}</p>
        <div className="poll-stats">
          <span className="stat">
            <span className="stat-number">{totalVotes}</span>
            <span className="stat-label">Total Votes</span>
          </span>
          <span className="stat">
            <span className="stat-number">{poll.options?.length || 0}</span>
            <span className="stat-label">Options</span>
          </span>
        </div>
      </div>
      <div className="results-content">
        <PollResults options={poll.options} totalVotes={totalVotes} />
      </div>
      <div className="results-actions">
        <Link to={`/poll/${id}`} className="action-btn">
          ← Back to Poll
        </Link>
        <Link to="/create" className="action-btn primary">
          Create New Poll
        </Link>
      </div>
    </div>
  );
};

export default PollResultsPage;
