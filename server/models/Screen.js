const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true
  },
  screenName: {
    type: String,
    required: [true, 'Please provide screen name'],
    trim: true
  },
  format: {
    type: String,
    enum: ['IMAX 3D', 'Dolby Cinema', '4DX', 'Standard 2D', 'RealD 3D'],
    default: 'Dolby Cinema'
  },
  soundSystem: {
    type: String,
    default: 'Dolby Atmos 64-Channel'
  },
  seatLayout: {
    rows: [
      {
        rowLabel: { type: String, required: true }, // 'A', 'B', 'C', ...
        category: {
          type: String,
          enum: ['VIP', 'Premium', 'Regular'],
          default: 'Regular'
        },
        seatsCount: { type: Number, default: 12 },
        // optional aisles or gaps, e.g. gap after seat 4 and 8
        aisles: { type: [Number], default: [4, 8] }
      }
    ]
  },
  totalSeats: {
    type: Number,
    default: 96
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Screen', screenSchema);
