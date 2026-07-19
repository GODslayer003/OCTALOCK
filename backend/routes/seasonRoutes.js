const express = require('express');
const router = express.Router();
const { getSeasons, createSeason, toggleSeason, deleteSeason } = require('../controllers/seasonController');

router.get('/', getSeasons);
router.post('/', createSeason);
router.patch('/:id/toggle', toggleSeason);
router.delete('/:id', deleteSeason);

module.exports = router;
