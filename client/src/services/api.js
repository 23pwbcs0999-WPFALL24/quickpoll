// client/src/services/api.js
import axios from 'axios';

// Use the deployed backend URL, fallback to localhost for local dev
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('Using API URL:', API_URL); // Optional: for debugging

// API calls
export const createPoll = (data) => axios.post(`${API_URL}/polls`, data);
export const getPoll = (id) => axios.get(`${API_URL}/polls/${id}`);
export const votePoll = (id, voteData) => axios.post(`${API_URL}/polls/${id}/vote`, voteData);
export const closePoll = (id) => axios.post(`${API_URL}/polls/${id}/close`);
