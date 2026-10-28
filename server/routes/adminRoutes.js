const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllBookings,
  getAllUsers
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);

module.exports = router;
