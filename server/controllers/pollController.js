const { v4: uuidv4 } = require('uuid');
const Poll = require('../models/Poll');
const generateTokens = require('/utils/tokenGenerator'); // Import token generator

// CREATE POLL
exports.createPoll = async (req, res) => {
  const { question, options, settings } = req.body;

  try {
    // Basic validation
    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Invalid poll data' });
    }

    const tokenVotingEnabled = settings?.tokenVoting || false;
    const tokenCount = settings?.tokenCount || 10;

    const newPoll = new Poll({
      question,
      options: options.map(option => ({ text: option })),
      pollId: uuidv4(),
      settings: {
        ipRestriction: settings?.ipRestriction || false,
        tokenVoting: tokenVotingEnabled,
        tokens: tokenVotingEnabled ? generateTokens(tokenCount) : []
      }
    });

    await newPoll.save();
    res.status(201).json(newPoll); // Includes tokens if tokenVoting is enabled
  } catch (err) {
    res.status(500).json({ error: 'Failed to create poll: ' + err.message });
  }
};

// GET POLL
exports.getPoll = async (req, res) => {
  try {
    const poll = await Poll.findOne({ pollId: req.params.id });
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VOTE ON POLL
exports.votePoll = (io) => async (req, res) => {
  const { optionIndex, token } = req.body;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  try {
    const poll = await Poll.findOne({ pollId: req.params.id });
    if (!poll || !poll.isOpen) {
      return res.status(400).json({ error: 'Poll not found or closed' });
    }

    // IP Restriction check
    if (poll.settings.ipRestriction && poll.voters.includes(ip)) {
      return res.status(403).json({ error: 'You have already voted (IP restricted)' });
    }

    // Token voting check
    if (poll.settings.tokenVoting) {
      if (!token) return res.status(400).json({ error: 'Token required' });
      if (!poll.settings.tokens.includes(token)) {
        return res.status(403).json({ error: 'Invalid or already used token' });
      }
      // Remove used token
      poll.settings.tokens = poll.settings.tokens.filter(t => t !== token);
    }

    // Option index check
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: 'Invalid option index' });
    }

    // Cast vote
    poll.options[optionIndex].votes++;

    // Track voter
    if (poll.settings.ipRestriction) {
      poll.voters.push(ip);
    } else if (poll.settings.tokenVoting) {
      poll.voters.push(token);
    }

    await poll.save();

    io.to(poll.pollId).emit('voteUpdate', poll);
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CLOSE POLL
exports.closePoll = async (req, res) => {
  try {
    const poll = await Poll.findOneAndUpdate(
      { pollId: req.params.id },
      { isOpen: false },
      { new: true }
    );
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
