const Booking = require('../models/Booking');
const Show = require('../models/Show');

const getSeatType = (seatNumber) => {
  const row = seatNumber.charAt(0).toUpperCase();
  return (row === 'A' || row === 'B') ? 'premium' : 'regular';
};

const generateBookingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CB-${randomStr}`;
};

exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats, paymentMethod = 'Razorpay', paymentId } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid showId and select at least one seat'
      });
    }

    const show = await Show.findById(showId).populate('movie', 'title').populate('theatre', 'name');
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    const alreadyBooked = seats.filter(seat => show.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats [${alreadyBooked.join(', ')}] are already booked. Please choose other seats.`
      });
    }

    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        bookedSeats: { $nin: seats }
      },
      {
        $push: { bookedSeats: { $each: seats } }
      },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(409).json({
        success: false,
        message: 'One or more of the selected seats were just booked. Please choose different seats.'
      });
    }

    const regularPrice = show.price?.regular || 200;
    const premiumPrice = show.price?.premium || 350;

    let subtotal = 0;
    const seatDetails = seats.map(seat => {
      const type = getSeatType(seat);
      const price = type === 'premium' ? premiumPrice : regularPrice;
      subtotal += price;
      return { seatNumber: seat, type, price };
    });

    const convenienceFee = seats.length * 25;
    const totalAmount = subtotal + convenienceFee;

    const txnId = paymentId || `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    const bookingId = generateBookingId();

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
      paymentId: txnId
    });

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
