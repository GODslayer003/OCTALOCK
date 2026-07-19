const mongoose = require('mongoose');

const playerSeasonStatSchema = new mongoose.Schema({
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
    required: true,
    index: true
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
    index: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    default: null
  },
  matchesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  goalDifference: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  currentStreak: { type: [String], default: [] },
  rank: { type: Number, default: 0 }
}, { timestamps: true });

// Ensure a player only has one stat document per season
playerSeasonStatSchema.index({ season: 1, player: 1 }, { unique: true });

module.exports = mongoose.model('PlayerSeasonStat', playerSeasonStatSchema);
