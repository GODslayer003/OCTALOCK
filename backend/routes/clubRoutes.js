const express = require('express');
const router = express.Router();
const { getClubs, createClub, updateClub, deleteClub } = require('../controllers/clubController');

router.get('/', getClubs);
router.post('/', createClub);
router.put('/:id', updateClub);
router.delete('/:id', deleteClub);

module.exports = router;
