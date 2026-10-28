const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a movie title'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a movie description']
  },
  genres: {
    type: [String],
    required: [true, 'Please specify at least one genre']
  },
  language: {
    type: String,
    required: [true, 'Please specify the movie language'],
    default: 'English'
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please specify duration in minutes']
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 8.0
  },
  votesCount: {
    type: Number,
    default: 1200
  },
  poster: {
    type: String,
    required: [true, 'Please provide a movie poster image URL']
  },
  backdrop: {
    type: String,
    required: [true, 'Please provide a movie backdrop banner URL']
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: Date,
    required: [true, 'Please add release date']
  },
  status: {
    type: String,
    enum: ['now_showing', 'coming_soon', 'archived'],
    default: 'now_showing'
  },
  certification: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'UA', 'A'],
    default: 'PG-13'
  },
  director: {
    type: String,
    default: 'Unknown'
  },
  cast: [
    {
      name: { type: String, required: true },
      role: { type: String, default: '' },
      image: { type: String, default: '' }
    }
  ],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

movieSchema.index({ title: 'text', genres: 'text', language: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
