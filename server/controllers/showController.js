const Show = require('../models/Show');
const Screen = require('../models/Screen');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const SeatHold = require('../models/SeatHold');

// @desc    Get shows with filters (movie, theatre, date, city)
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, city, date } = req.query;
    const query = { status: 'active' };

    if (movieId) query.movie = movieId;
    if (theatreId) query.theatre = theatreId;
    if (date) query.showDate = date;

    let shows = await Show.find(query)
      .populate('movie', 'title poster backdrop rating genres language duration certification')
      .populate('theatre', 'name city location address')
      .populate('screen', 'screenName format soundSystem')
      .sort({ showDate: 1, startTime: 1 });

    // If city filter specified, filter by theatre.city
    if (city && city !== 'All') {
      shows = shows.filter(
        show => show.theatre && show.theatre.city.toLowerCase() === city.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: shows.length,
      shows
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get show details by ID (including full screen seat layout and real-time availability)
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title poster backdrop rating genres language duration certification')
      .populate('theatre', 'name city location address amenities phone')
      .populate('screen');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Clean up expired seat holds
    const now = new Date();
    await SeatHold.deleteMany({ show: show._id, expiresAt: { $lt: now } });

    // Fetch active seat holds
    const activeHolds = await SeatHold.find({
      show: show._id,
      expiresAt: { $gte: now }
    });

    // Gather all currently held seats
    const heldSeatsMap = {};
    activeHolds.forEach(hold => {
      hold.seats.forEach(seat => {
        heldSeatsMap[seat] = {
          userOrSessionId: hold.userOrSessionId,
          expiresAt: hold.expiresAt
        };
      });
    });

    res.status(200).json({
      success: true,
      show,
      bookedSeats: show.bookedSeats || [],
      heldSeats: heldSeatsMap
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Hold seats temporarily (10 min expiry)
// @route   POST /api/shows/:id/hold
// @access  Public (supports guest session or logged-in user)
exports.holdSeats = async (req, res, next) => {
  try {
    const { seats, userOrSessionId } = req.body;
    const showId = req.params.id;

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one seat.' });
    }

    if (!userOrSessionId) {
      return res.status(400).json({ success: false, message: 'Session identifier required.' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    // Check if any seat is already booked
    const alreadyBooked = seats.some(s => show.bookedSeats.includes(s));
    if (alreadyBooked) {
      return res.status(409).json({
        success: false,
        message: 'One or more of the selected seats are already booked.'
      });
    }

    // Clean up expired holds
    const now = new Date();
    await SeatHold.deleteMany({ show: showId, expiresAt: { $lt: now } });

    // Check if held by another session
    const existingHolds = await SeatHold.find({
      show: showId,
      expiresAt: { $gte: now },
      userOrSessionId: { $ne: userOrSessionId },
      seats: { $in: seats }
    });

    if (existingHolds.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'One or more selected seats are currently reserved by another customer. Please choose other seats.'
      });
    }

    // 10 minutes hold
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Remove any previous hold by this same session for this show
    await SeatHold.deleteMany({ show: showId, userOrSessionId });

    // Create new hold
    const hold = await SeatHold.create({
      show: showId,
      seats,
      userOrSessionId,
      expiresAt
    });

    res.status(200).json({
      success: true,
      message: 'Seats held successfully for 10 minutes.',
      holdId: hold._id,
      seats,
      expiresAt
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Release held seats
// @route   POST /api/shows/:id/release
// @access  Public
exports.releaseSeats = async (req, res, next) => {
  try {
    const { userOrSessionId, seats } = req.body;
    const showId = req.params.id;

    if (seats && Array.isArray(seats)) {
      await SeatHold.deleteMany({
        show: showId,
        userOrSessionId,
        seats: { $in: seats }
      });
    } else {
      await SeatHold.deleteMany({ show: showId, userOrSessionId });
    }

    res.status(200).json({
      success: true,
      message: 'Seats released successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Create new show
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
  try {
    const show = await Show.create(req.body);
    const populated = await Show.findById(show._id)
      .populate('movie', 'title')
      .populate('theatre', 'name city')
      .populate('screen', 'screenName');

    res.status(201).json({
      success: true,
      show: populated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Update show
// @route   PUT /api/shows/:id
// @access  Private/Admin
exports.updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.status(200).json({ success: true, show });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Delete show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    await Show.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Show deleted successfully' });
  } catch (err) {
    next(err);
  }
};
