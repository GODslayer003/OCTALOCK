const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String, // Cloudinary URL
    required: true
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
