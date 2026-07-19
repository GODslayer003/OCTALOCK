const express = require('express');
const router = express.Router();
const { getPlayers, createPlayer, updatePlayer, deletePlayer } = require('../controllers/playerController');

router.get('/', getPlayers);
router.post('/', createPlayer);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

module.exports = router;
