const { v4: uuidv4 } = require('uuid');
const Poll = require('../models/Poll');

exports.createPoll = async (req, res) => {
  const { question, options, settings } = req.body;

  try {
    const newPoll = new Poll({
      question,
      options: options.map(option => ({ text: option })),
      pollId: uuidv4(),
      settings: {
        ipRestriction: settings?.ipRestriction || false,
        tokenVoting: settings?.tokenVoting || false,
        tokens: settings?.tokenVoting
          ? Array(settings.tokenCount || 10).fill().map(() => uuidv4())
          : []
      }
    });

    await newPoll.save();
    res.json(newPoll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPoll = async (req, res) => {
  try {
    const poll = await Poll.findOne({ pollId: req.params.id });
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.votePoll = (io) => async (req, res) => {
  const { optionIndex, token } = req.body;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  try {
    const poll = await Poll.findOne({ pollId: req.params.id });
    if (!poll || !poll.isOpen) return res.status(400).json({ error: 'Poll not found or closed' });

    if (poll.settings.ipRestriction && poll.voters.includes(ip)) {
      return res.status(403).json({ error: 'You have already voted' });
    }

    if (poll.settings.tokenVoting) {
      if (!token) return res.status(400).json({ error: 'Token required' });
      if (!poll.settings.tokens.includes(token)) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      poll.settings.tokens = poll.settings.tokens.filter(t => t !== token);
    }

    poll.options[optionIndex].votes++;
    poll.voters.push(ip || token);
    await poll.save();

    io.to(poll.pollId).emit('voteUpdate', poll);
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
