const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide theatre name'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please specify city'],
    trim: true,
    index: true
  },
  location: {
    type: String,
    required: [true, 'Please specify location/area'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please provide full address']
  },
  amenities: {
    type: [String],
    default: ['Dolby Atmos', '4K Projection', 'Recliner Seats', 'Food & Beverages']
  },
  phone: {
    type: String,
    default: '+1 (800) 555-4668'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Theatre', theatreSchema);
