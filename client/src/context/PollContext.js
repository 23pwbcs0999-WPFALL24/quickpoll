import React, { createContext, useState, useEffect } from 'react';

export const PollContext = createContext();

export const PollProvider = ({ children }) => {
  const [recentPolls, setRecentPolls] = useState([]);

  // Load polls from localStorage on initial load
  useEffect(() => {
    const storedPolls = localStorage.getItem('recentPolls');
    if (storedPolls) {
      setRecentPolls(JSON.parse(storedPolls));
    }
  }, []);

  // Save polls to localStorage whenever recentPolls changes
  useEffect(() => {
    localStorage.setItem('recentPolls', JSON.stringify(recentPolls));
  }, [recentPolls]);

  return (
    <PollContext.Provider value={{ recentPolls, setRecentPolls }}>
      {children}
    </PollContext.Provider>
  );
};
