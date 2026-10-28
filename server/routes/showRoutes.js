const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  holdSeats,
  releaseSeats,
  createShow,
  updateShow,
  deleteShow
} = require('../controllers/showController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getShows)
  .post(protect, adminOnly, createShow);

router.route('/:id')
  .get(getShowById)
  .put(protect, adminOnly, updateShow)
  .delete(protect, adminOnly, deleteShow);

router.post('/:id/hold', holdSeats);
router.post('/:id/release', releaseSeats);

module.exports = router;
