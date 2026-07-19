const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  season: { type: String, default: '' },
  clubA: { type: String, default: '' },
  clubB: { type: String, default: '' },
  playerA: { type: String, default: '' },
  playerB: { type: String, default: '' },
  winner: { type: String, default: '' },
  goalsA: { type: Number, default: 0 },
  goalsB: { type: Number, default: 0 },
  mvp: { type: String, default: '' },
  date: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
