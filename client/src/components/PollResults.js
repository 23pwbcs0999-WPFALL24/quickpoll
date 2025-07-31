import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import './PollResults.css';

const PollResults = ({ options: initialOptions, pollId }) => {
  const socket = useSocket();           // ✅ pull in the socket instance
  const [options, setOptions] = useState(initialOptions);

  // Calculate total votes
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  useEffect(() => {
    if (!socket || !pollId) return;

    // Join the room for this poll
    socket.emit('joinPoll', pollId);

    // Listen for updates
    socket.on('voteUpdate', (updatedPoll) => {
      // updatedPoll should be the full poll object
      if (updatedPoll.options) {
        setOptions(updatedPoll.options);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('voteUpdate');
      socket.emit('leavePoll', pollId);
    };
  }, [socket, pollId]);

  return (
    <div className="results-container">
      <ul className="results-list">
        {options.map((option, idx) => {
          const pct = totalVotes > 0
            ? Math.round((option.votes / totalVotes) * 100)
            : 0;

          return (
            <li key={idx} className="result-item">
              <div className="option-info">
                <span className="option-text">{option.text}</span>
                <span className="vote-count">
                  {option.votes} votes ({pct}%)
                </span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PollResults;
