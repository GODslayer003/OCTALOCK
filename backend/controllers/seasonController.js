const Season = require('../models/Season');

exports.getSeasons = async (req, res) => {
  try {
    const seasons = await Season.find().sort({ createdAt: -1 });
    res.json({ success: true, data: seasons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSeason = async (req, res) => {
  try {
    const season = await Season.create(req.body);
    res.status(201).json({ success: true, data: season });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.toggleSeason = async (req, res) => {
  try {
    const season = await Season.findById(req.params.id);
    if (!season) return res.status(404).json({ success: false, message: 'Season not found' });
    season.status = season.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    await season.save();
    res.json({ success: true, data: season });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteSeason = async (req, res) => {
  try {
    const season = await Season.findByIdAndDelete(req.params.id);
    if (!season) return res.status(404).json({ success: false, message: 'Season not found' });
    res.json({ success: true, message: 'Season deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
