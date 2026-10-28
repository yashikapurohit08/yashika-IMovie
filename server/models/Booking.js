const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
    index: true
  },
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
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  seats: {
    type: [String], // ['B-4', 'B-5']
    required: true
  },
  seatDetails: [
    {
      seat: { type: String, required: true },
      category: { type: String, enum: ['VIP', 'Premium', 'Regular'], default: 'Regular' },
      price: { type: Number, required: true }
    }
  ],
  snacks: [
    {
      id: { type: String },
      name: { type: String },
      quantity: { type: Number, default: 1 },
      price: { type: Number, default: 0 }
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  convenienceFee: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'Credit/Debit Card (Mock)'
  },
  paymentStatus: {
    type: String,
    enum: ['PAID', 'PENDING', 'FAILED', 'REFUNDED'],
    default: 'PAID'
  },
  bookingStatus: {
    type: String,
    enum: ['CONFIRMED', 'CANCELLED'],
    default: 'CONFIRMED',
    index: true
  },
  qrCode: {
    type: String, // Data URL
    default: ''
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  cancelledAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
