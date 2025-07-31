// client/src/pages/Features.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Create and share polls in seconds. No registration required.",
      color: "#FF6B6B"
    },
    {
      icon: "🔒",
      title: "Anonymous Voting",
      description: "Vote anonymously without revealing your identity.",
      color: "#4ECDC4"
    },
    {
      icon: "📊",
      title: "Real-time Results",
      description: "See results update instantly as votes come in.",
      color: "#45B7D1"
    },
    {
      icon: "🛡️",
      title: "Vote Security",
      description: "Advanced security measures to prevent vote manipulation.",
      color: "#96CEB4"
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Works perfectly on all devices and screen sizes.",
      color: "#FFEAA7"
    },
    {
      icon: "🎨",
      title: "Beautiful Design",
      description: "Modern, intuitive interface that's a joy to use.",
      color: "#DDA0DD"
    }
  ];

  return (
    <div className="features-page">
      <div className="features-hero">
        <h1>QuickPoll Features</h1>
        <p>Discover what makes QuickPoll the perfect choice for instant polling</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card"
            style={{ '--accent-color': feature.color }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="features-cta">
        <h2>Ready to Get Started?</h2>
        <p>Create your first poll in seconds</p>
        <Link to="/create" className="cta-button">
          Create Your First Poll
        </Link>
      </div>
    </div>
  );
};

export default Features; 