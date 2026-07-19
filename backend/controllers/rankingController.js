const Player = require('../models/Player');
const Club = require('../models/Club');

exports.getPlayerRankings = async (req, res) => {
  try {
    const players = await Player.find();
    const ranked = players
      .map(p => ({
        ...p.toObject(),
        pts: (p.wins || 0) * 3 + (p.draws || 0),
        gd: (p.goalsFor || 0) - (p.goalsAgainst || 0),
      }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd)
      .map((p, i) => ({ ...p, rank: i + 1 }));
    res.json({ success: true, data: ranked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getClubRankings = async (req, res) => {
  try {
    const clubs = await Club.find();
    const ranked = clubs
      .map(c => ({
        ...c.toObject(),
        pts: (c.wins || 0) * 3 + (c.draws || 0),
        gd: (c.goalsFor || 0) - (c.goalsAgainst || 0),
      }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd)
      .map((c, i) => ({ ...c, rank: i + 1 }));
    res.json({ success: true, data: ranked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
