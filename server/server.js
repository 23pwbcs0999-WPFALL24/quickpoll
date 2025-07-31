const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting for API endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quickpoll', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Poll model
const PollSchema = new mongoose.Schema({
  question: String,
  options: [{
    text: String,
    votes: { type: Number, default: 0 }
  }],
  creatorId: String,
  isOpen: { type: Boolean, default: true },
  pollId: { type: String, unique: true },
  settings: {
    ipRestriction: { type: Boolean, default: false },
    tokenVoting: { type: Boolean, default: false },
    tokens: [String],
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
  },
  voters: [String] // stores IPs or token IDs
});

const Poll = mongoose.model('Poll', PollSchema);

// --- SOCKET.IO REAL-TIME LOGIC ---
io.on('connection', (socket) => {
  // Join a poll room
  socket.on('joinPoll', (pollId) => {
    socket.join(pollId);
  });
  // Optionally, handle disconnects or logging
});

// API Routes
app.get('/', (req, res) => res.send('QuickPoll API'));

// Create new poll
app.post('/api/polls', async (req, res) => {
  const { question, options, settings } = req.body;
  try {
    const newPoll = new Poll({
      question,
      options: options.map(option => ({ text: option })),
      pollId: uuidv4(),
      settings: {
        ipRestriction: settings?.ipRestriction || false,
        tokenVoting: settings?.tokenVoting || false,
        tokens: settings?.tokenVoting ? Array(settings.tokenCount || 10).fill().map(() => uuidv4()) : []
      }
    });
    await newPoll.save();
    res.json(newPoll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get poll by ID
app.get('/api/polls/:id', async (req, res) => {
  try {
    const poll = await Poll.findOne({ pollId: req.params.id });
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vote on poll
app.post('/api/polls/:id/vote', async (req, res) => {
  const { optionIndex, token } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const poll = await Poll.findOne({ pollId: req.params.id });
    if (!poll || !poll.isOpen) return res.status(400).json({ error: 'Poll not found or closed' });
    // Check voting restrictions
    if (poll.settings.ipRestriction && poll.voters.includes(ip)) {
      return res.status(403).json({ error: 'You have already voted' });
    }
    if (poll.settings.tokenVoting) {
      if (!token) return res.status(400).json({ error: 'Token required' });
      if (!poll.settings.tokens.includes(token)) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      // Remove used token
      poll.settings.tokens = poll.settings.tokens.filter(t => t !== token);
    }
    // Record vote
    poll.options[optionIndex].votes++;
    poll.voters.push(ip || token);
    await poll.save();
    // --- EMIT REAL-TIME UPDATE ---
    io.to(poll.pollId).emit('voteUpdate', poll);
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Close poll
app.post('/api/polls/:id/close', async (req, res) => {
  try {
    const poll = await Poll.findOneAndUpdate(
      { pollId: req.params.id },
      { $set: { isOpen: false } },
      { new: true }
    );
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server };

