// client/src/components/PollResults.js
import './PollResults.css';

const PollResults = ({ options, totalVotes }) => {
  // Calculate total votes if not provided
  const calculatedTotal = totalVotes || 
    options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="results-container">
      <ul className="results-list">
        {options.map((option, index) => {
          const percentage = calculatedTotal > 0 
            ? Math.round((option.votes / calculatedTotal) * 100) 
            : 0;
            
          return (
            <li key={index} className="result-item">
              <div className="option-info">
                <span className="option-text">{option.text}</span>
                <span className="vote-count">{option.votes} votes ({percentage}%)</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${percentage}%` }}
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
