// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PollProvider } from './context/PollContext';
import { SocketProvider } from './context/SocketContext'; // ✅ added
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/global.css';

// Optional: silence logs in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

// Create root and render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>           {/* ✅ SocketContext wraps everything */}
        <PollProvider>
          <App />
        </PollProvider>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Performance monitoring (optional)
reportWebVitals(console.log); // You can replace this with an analytics function
