const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required']
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required']
    },
    screenNumber: {
      type: Number,
      default: 1
    },
    showDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Show date is required']
    },
    showTime: {
      type: String, // Format: e.g. "07:30 PM"
      required: [true, 'Show time is required']
    },
    price: {
      regular: {
        type: Number,
        default: 200
      },
      premium: {
        type: Number,
        default: 350
      }
    },
    totalSeats: {
      type: Number,
      default: 70 // Rows A to G, 10 columns each
    },
    bookedSeats: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Show', showSchema);
