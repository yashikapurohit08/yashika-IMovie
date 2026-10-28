const mongoose = require('mongoose');

const seatHoldSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
    index: true
  },
  seats: {
    type: [String], // e.g. ['B-3', 'B-4']
    required: true
  },
  userOrSessionId: {
    type: String,
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // MongoDB TTL index: automatically deletes document when expiresAt is reached
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SeatHold', seatHoldSchema);
