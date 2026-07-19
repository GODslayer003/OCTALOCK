const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  captain: { type: String, default: '' },
  members: { type: Number, default: 0 },
  logo: { type: String, default: '' },
  matches: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  streak: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
