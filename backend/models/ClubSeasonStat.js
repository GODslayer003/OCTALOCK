const mongoose = require('mongoose');

const clubSeasonStatSchema = new mongoose.Schema({
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season',
    required: true,
    index: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
    index: true
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
  rank: { type: Number, default: 0 }
}, { timestamps: true });

// Ensure a club only has one stat document per season
clubSeasonStatSchema.index({ season: 1, club: 1 }, { unique: true });

module.exports = mongoose.model('ClubSeasonStat', clubSeasonStatSchema);
