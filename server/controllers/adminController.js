const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get Admin Dashboard statistics and analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalTheatres = await Theatre.countDocuments();
    const totalShows = await Show.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();

    // Calculate total revenue from confirmed bookings
    const confirmedBookings = await Booking.find({ bookingStatus: 'CONFIRMED' });
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Recent 10 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('movie', 'title poster')
      .populate('theatre', 'name city')
      .sort({ createdAt: -1 })
      .limit(8);

    // Revenue by movie
    const revenueByMovie = await Booking.aggregate([
      { $match: { bookingStatus: 'CONFIRMED' } },
      {
        $group: {
          _id: '$movie',
          revenue: { $sum: '$totalAmount' },
          ticketsCount: { $sum: { $size: '$seats' } },
          bookingsCount: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: '_id',
          as: 'movieDetails'
        }
      },
      { $unwind: '$movieDetails' },
      {
        $project: {
          movieId: '$_id',
          title: '$movieDetails.title',
          poster: '$movieDetails.poster',
          revenue: 1,
          ticketsCount: 1,
          bookingsCount: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalMovies,
        totalTheatres,
        totalShows,
        totalUsers,
        totalBookings,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        confirmedBookingsCount: confirmedBookings.length
      },
      recentBookings,
      topMovies: revenueByMovie
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings with search, filter, and pagination
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.bookingStatus = status;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { bookingReference: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('movie', 'title poster')
      .populate('theatre', 'name city')
      .populate('screen', 'screenName')
      .populate('show', 'showDate startTime')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    next(err);
  }
};
