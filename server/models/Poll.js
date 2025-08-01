const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [OptionSchema],
    validate: [arr => arr.length >= 2, 'Poll must have at least two options']
  },
  creatorId: { type: String }, // Optional: used if user system is implemented
  isOpen: { type: Boolean, default: true },
  pollId: { type: String, unique: true, required: true },

  settings: {
    ipRestriction: { type: Boolean, default: false },
    tokenVoting: { type: Boolean, default: false },
    tokens: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
  },

  voters: { type: [String], default: [] }
});

module.exports = mongoose.model('Poll', PollSchema);
