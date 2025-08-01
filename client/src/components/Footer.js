// filepath: src/components/Footer.js
import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">© 2025 QuickPoll. All rights reserved.</div>
        <div className="footer-social">
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter" />
          </a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github" />
          </a>
        </div>
      </div>
    </footer>
  );
}
