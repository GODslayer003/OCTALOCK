const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'LOCKED', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  soloChampion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  clubChampion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    default: null
  },
  finalMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Season', seasonSchema);
