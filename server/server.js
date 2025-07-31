require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const pollController = require('./controllers/pollController'); // new

const app = express();
const server = http.createServer(app);

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware a
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api/', limiter);

// Environment vars
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickpoll';

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Poll model registration
require('./models/Poll');

// Routes
app.get('/', (req, res) => res.send('QuickPoll API'));

// Poll Routes
app.post('/api/polls', pollController.createPoll);
app.get('/api/polls/:id', pollController.getPoll);
app.post('/api/polls/:id/vote', pollController.votePoll(io)); // socket.io passed here
app.post('/api/polls/:id/close', pollController.closePoll);

// Socket.io logic
io.on('connection', (socket) => {
  socket.on('joinPoll', (pollId) => {
    socket.join(pollId);
  });
});

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server };
