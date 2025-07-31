// client/src/components/Header.js
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" className="logo-svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <span className="logo-text">QuickPoll</span>
          </div>
        </Link>
        <nav className="main-nav">
          <Link to="/create" className="nav-link">
            <span className="nav-icon">+</span>
            Create Poll
          </Link>
          <Link to="/join" className="nav-link">
            <span className="nav-icon">🔗</span>
            Join Poll
          </Link>
          <Link to="/results" className="nav-link">
            <span className="nav-icon">📊</span>
            Poll Results
          </Link>
          <Link to="/features" className="nav-link">
            <span className="nav-icon">⚡</span>
            Features
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
