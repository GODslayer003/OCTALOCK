const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: { type: String, default: '' },
  country: { type: String, required: true },
  club: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  photo: { type: String, default: '' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  matches: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  streak: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
