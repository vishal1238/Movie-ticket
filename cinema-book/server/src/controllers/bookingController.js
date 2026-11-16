const Booking = require('../models/Booking');
const Show = require('../models/Show');

// Helper to determine seat category (Rows A, B are premium, rest regular)
const getSeatType = (seatNumber) => {
  const row = seatNumber.charAt(0).toUpperCase();
  if (row === 'A' || row === 'B') {
    return 'premium';
  }
  return 'regular';
};

// Generate random unique booking ID
const generateBookingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CB-${randomStr}`;
};

// @desc    Create a new booking with backend seat validation & mock payment
// @route   POST /api/bookings
// @access  Private (User/Admin)
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats, paymentMethod = 'Credit / Debit Card' } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid showId and select at least one seat'
      });
    }

    // 1. Fetch Show
    const show = await Show.findById(showId).populate('movie', 'title').populate('theatre', 'name');
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // 2. Validate Seat Availability on the backend
    const alreadyBooked = seats.filter(seat => show.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats [${alreadyBooked.join(', ')}] are already booked. Please choose other seats.`
      });
    }

    // 3. Atomically reserve seats using MongoDB conditional update to prevent race conditions
    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        bookedSeats: { $nin: seats } // Ensures none of the requested seats were booked in the split second
      },
      {
        $push: { bookedSeats: { $each: seats } }
      },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(409).json({
        success: false,
        message: 'One or more of the selected seats were just booked by another user. Please choose different seats.'
      });
    }

    // 4. Calculate Seat Prices and Total
    const regularPrice = show.price?.regular || 200;
    const premiumPrice = show.price?.premium || 350;

    let subtotal = 0;
    const seatDetails = seats.map(seat => {
      const type = getSeatType(seat);
      const price = type === 'premium' ? premiumPrice : regularPrice;
      subtotal += price;
      return {
        seatNumber: seat,
        type,
        price
      };
    });

    const convenienceFee = seats.length * 25; // 25 per ticket
    const totalAmount = subtotal + convenienceFee;

    // 5. Generate mock payment confirmation
    const paymentId = `MOCK-TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const bookingId = generateBookingId();

    // 6. Save Booking in MongoDB
    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      show: showId,
      seats,
      seatDetails,
      subtotal,
      convenienceFee,
      totalAmount,
      paymentStatus: 'completed',
      paymentMethod,
      paymentId
    });

    // Populate for clean response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl duration language' },
          { path: 'theatre', select: 'name location city' }
        ]
      });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl bannerUrl duration language genre' },
          { path: 'theatre', select: 'name location city' }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl bannerUrl duration language genre' },
          { path: 'theatre', select: 'name location city' }
        ]
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership unless admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl duration' },
          { path: 'theatre', select: 'name city' }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};
