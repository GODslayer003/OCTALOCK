const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, default: '' },
  status: { type: String, enum: ['ACTIVE', 'LOCKED'], default: 'ACTIVE' },
  matches: { type: Number, default: 0 },
  soloChamp: { type: String, default: null },
  clubChamp: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Season', seasonSchema);
