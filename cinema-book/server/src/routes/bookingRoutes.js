const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.get('/', admin, getAllBookings);

module.exports = router;
