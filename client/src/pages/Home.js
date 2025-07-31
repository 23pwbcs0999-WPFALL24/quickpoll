import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              QuickPoll: 
              <span className="gradient-text"> Instant Anonymous Polls</span>
            </h1>
            <p className="hero-description">
              Create and share polls in seconds with real-time results. 
              No registration required, completely anonymous.
            </p>
            <div className="hero-actions">
              <Link to="/create" className="primary-btn">
                <span className="btn-icon">+</span>
                Create a Poll
              </Link>
              <Link to="/features" className="secondary-btn">
                <span className="btn-icon">⚡</span>
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-illustration">
              <svg viewBox="0 0 400 300" className="poll-illustration">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 0.6}} />
                  </linearGradient>
                </defs>
                {/* Background circles */}
                <circle cx="50" cy="50" r="30" fill="url(#chartGradient)" opacity="0.1"/>
                <circle cx="350" cy="80" r="25" fill="url(#chartGradient)" opacity="0.1"/>
                <circle cx="320" cy="250" r="35" fill="url(#chartGradient)" opacity="0.1"/>
                
                {/* Chart bars */}
                <rect x="120" y="200" width="40" height="80" fill="url(#barGradient)" rx="4"/>
                <rect x="170" y="160" width="40" height="120" fill="url(#barGradient)" rx="4"/>
                <rect x="220" y="180" width="40" height="100" fill="url(#barGradient)" rx="4"/>
                <rect x="270" y="140" width="40" height="140" fill="url(#barGradient)" rx="4"/>
                
                {/* Poll icons */}
                <circle cx="100" cy="100" r="15" fill="#667eea" opacity="0.8"/>
                <circle cx="100" cy="100" r="8" fill="white"/>
                <circle cx="100" cy="100" r="4" fill="#667eea"/>
                
                <circle cx="300" cy="120" r="12" fill="#764ba2" opacity="0.8"/>
                <circle cx="300" cy="120" r="6" fill="white"/>
                <circle cx="300" cy="120" r="3" fill="#764ba2"/>
                
                {/* Connection lines */}
                <path d="M115 100 Q200 50 285 120" stroke="url(#chartGradient)" strokeWidth="2" fill="none" opacity="0.6"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Why Choose QuickPoll?</h2>
          <p className="section-subtitle">Built for speed, privacy, and simplicity</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Create and share polls in under 30 seconds. No registration required.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Anonymous Voting</h3>
            <p>Completely anonymous feedback with no personal data collection.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Results</h3>
            <p>Live updating system for instant results as votes come in.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Vote Security</h3>
            <p>Prevent duplicate votes with smart tracking and security measures.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Simple steps to get started</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create your poll</h3>
              <p>Add your question and multiple choice options in seconds.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Share the link</h3>
              <p>Get a unique link to share with participants instantly.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Watch results</h3>
              <p>See real-time updates as votes come in with live charts.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
