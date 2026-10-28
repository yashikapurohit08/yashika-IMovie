const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: true
  },
  showDate: {
    type: String, // Stored as 'YYYY-MM-DD' for exact day filtering across timezones
    required: true,
    index: true
  },
  startTime: {
    type: String, // '10:30 AM', '02:15 PM', '06:00 PM', '09:30 PM'
    required: true
  },
  pricing: {
    regular: { type: Number, default: 12 },
    premium: { type: Number, default: 16 },
    vip: { type: Number, default: 22 }
  },
  bookedSeats: {
    type: [String], // Array of seat IDs, e.g. ['A-1', 'A-2', 'C-4']
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

showSchema.index({ movie: 1, theatre: 1, showDate: 1 });

module.exports = mongoose.model('Show', showSchema);
