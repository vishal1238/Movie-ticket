const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Show = require('../models/Show');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();

    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title' },
          { path: 'theatre', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalMovies,
        totalShows,
        totalUsers,
        totalBookings,
        totalRevenue,
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
};
