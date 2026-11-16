const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location/Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      default: 'New York'
    },
    totalScreens: {
      type: Number,
      default: 4
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Theatre', theatreSchema);
