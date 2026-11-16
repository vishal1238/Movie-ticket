const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
      validate: [v => Array.isArray(v) && v.length > 0, 'Genre array cannot be empty']
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      default: 'English'
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required']
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required']
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required']
    },
    bannerUrl: {
      type: String,
      required: [true, 'Banner image URL is required']
    },
    rating: {
      type: Number,
      default: 8.5,
      min: 0,
      max: 10
    },
    status: {
      type: String,
      enum: ['now_showing', 'upcoming'],
      default: 'now_showing'
    },
    cast: {
      type: [String],
      default: []
    },
    director: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Movie', movieSchema);
