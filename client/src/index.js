// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PollProvider } from './context/PollContext';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/global.css';

// Initialize the performance monitoring
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

// Configure axios defaults
const { REACT_APP_API_URL } = process.env;

// Create root and render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PollProvider>
        <App />
      </PollProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Performance monitoring (optional)
reportWebVitals(console.log);  // Can be sent to analytics service
