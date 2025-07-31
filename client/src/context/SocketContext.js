// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to backend socket
    socketRef.current = io('http://localhost:5000'); // or your deployed URL

    // Log for debugging
    socketRef.current.on('connect', () => {
      console.log('✅ Socket.io connected:', socketRef.current.id);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
