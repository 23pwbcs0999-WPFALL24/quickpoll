// client/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createPoll = (data) => axios.post(`${API_URL}/polls`, data);
export const getPoll = (id) => axios.get(`${API_URL}/polls/${id}`);
export const votePoll = (id, voteData) => axios.post(`${API_URL}/polls/${id}/vote`, voteData);
export const closePoll = (id) => axios.post(`${API_URL}/polls/${id}/close`);
