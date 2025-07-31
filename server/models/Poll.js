const mongoose = require('mongoose');

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
  voters: [String]
});

module.exports = mongoose.model('Poll', PollSchema);
