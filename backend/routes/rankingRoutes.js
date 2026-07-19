const express = require('express');
const router = express.Router();
const { getPlayerRankings, getClubRankings } = require('../controllers/rankingController');

router.get('/players', getPlayerRankings);
router.get('/clubs', getClubRankings);

module.exports = router;
