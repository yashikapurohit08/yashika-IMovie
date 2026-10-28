const QRCode = require('qrcode');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Screen = require('../models/Screen');
const SeatHold = require('../models/SeatHold');
const { generateBookingReference } = require('../utils/bookingReference');
const { broadcastBookingUpdate, broadcastCancellationUpdate } = require('../utils/socketHandler');

// @desc    Create and confirm booking with atomic seat reservation & server price recalculation
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const {
      showId,
      seats, // e.g. ['A-3', 'A-4']
      snacks = [],
      paymentMethod = 'Credit/Debit Card (Mock)',
      simulateFailure = false
    } = req.body;

    // Check payment failure simulation
    if (simulateFailure) {
      return res.status(402).json({
        success: false,
        message: 'Payment simulation failed: Transaction declined by bank. Please try another payment method.'
      });
    }

    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and at least one seat.'
      });
    }

    // 1. Fetch Show and Screen details to calculate true pricing
    const show = await Show.findById(showId)
      .populate('movie')
      .populate('theatre')
      .populate('screen');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    if (show.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This show is no longer active for booking.' });
    }

    // 2. Build seat category map from Screen seatLayout
    const screen = show.screen;
    const seatCategoryMap = {};
    if (screen && screen.seatLayout && screen.seatLayout.rows) {
      screen.seatLayout.rows.forEach(row => {
        for (let i = 1; i <= row.seatsCount; i++) {
          const seatId = `${row.rowLabel}-${i}`;
          seatCategoryMap[seatId] = row.category || 'Regular';
        }
      });
    }

    // 3. Recalculate ticket prices on server (NEVER TRUST CLIENT TOTALS)
    let subtotal = 0;
    const seatDetails = [];

    for (const seat of seats) {
      const category = seatCategoryMap[seat] || 'Regular';
      let price = show.pricing.regular || 12;
      if (category === 'VIP') price = show.pricing.vip || 22;
      else if (category === 'Premium') price = show.pricing.premium || 16;

      subtotal += price;
      seatDetails.push({ seat, category, price });
    }

    // Calculate snacks total
    let snacksTotal = 0;
    const validatedSnacks = [];
    if (Array.isArray(snacks)) {
      snacks.forEach(item => {
        const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
        const price = Number(item.price) || 0;
        snacksTotal += price * qty;
        validatedSnacks.push({
          id: item.id,
          name: item.name,
          quantity: qty,
          price: price
        });
      });
    }

    // Fixed / percentage fees: e.g. $1.50 convenience fee per ticket, 8% tax
    const convenienceFee = Number((seats.length * 1.5).toFixed(2));
    const taxes = Number(((subtotal + snacksTotal + convenienceFee) * 0.08).toFixed(2));
    const totalAmount = Number((subtotal + snacksTotal + convenienceFee + taxes).toFixed(2));

    // 4. ATOMIC SEAT ALLOCATION
    // Atomically push seats into bookedSeats ONLY IF NONE OF THEM ARE IN bookedSeats ALREADY
    const atomicShowUpdate = await Show.findOneAndUpdate(
      {
        _id: show._id,
        bookedSeats: { $nin: seats } // Ensures zero conflict!
      },
      {
        $push: { bookedSeats: { $each: seats } }
      },
      { new: true }
    );

    if (!atomicShowUpdate) {
      return res.status(409).json({
        success: false,
        message: 'Conflict: One or more selected seats were just booked by another user. Please select other seats.'
      });
    }

    // 5. Generate Unique Booking Reference & QR Code
    const bookingReference = generateBookingReference();
    const qrData = JSON.stringify({
      ref: bookingReference,
      movie: show.movie.title,
      theatre: show.theatre.name,
      date: show.showDate,
      time: show.startTime,
      seats: seats.join(','),
      total: `$${totalAmount}`
    });
    const qrCode = await QRCode.toDataURL(qrData, {
      color: { dark: '#e50914', light: '#ffffff' },
      margin: 1,
      width: 240
    });

    // 6. Create Booking Document in MongoDB
    const booking = await Booking.create({
      user: req.user.id,
      show: show._id,
      movie: show.movie._id,
      theatre: show.theatre._id,
      screen: show.screen._id,
      bookingReference,
      seats,
      seatDetails,
      snacks: validatedSnacks,
      subtotal,
      convenienceFee,
      taxes,
      totalAmount,
      paymentMethod,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      qrCode
    });

    // 7. Clean up seat holds for this user
    await SeatHold.deleteMany({ show: show._id, userOrSessionId: req.user.id.toString() });

    // 8. Real-time Socket.IO Broadcast to all viewers of this show
    broadcastBookingUpdate(show._id.toString(), seats);

    // 9. Populate response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title poster backdrop duration language certification')
      .populate('theatre', 'name city location address phone')
      .populate('screen', 'screenName format soundSystem')
      .populate('show', 'showDate startTime');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: populatedBooking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bookings of current logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('movie', 'title poster backdrop duration language certification genres')
      .populate('theatre', 'name city location address')
      .populate('screen', 'screenName format soundSystem')
      .populate('show', 'showDate startTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking by ID or reference
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const isReference = req.params.id.startsWith('IMV-');
    const query = isReference
      ? { bookingReference: req.params.id }
      : { _id: req.params.id };

    const booking = await Booking.findOne(query)
      .populate('movie')
      .populate('theatre')
      .populate('screen')
      .populate('show')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Check authorization: user can only view their own booking unless admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own bookings.'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking and release seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Verify ownership or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.'
      });
    }

    if (booking.bookingStatus === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.'
      });
    }

    // Remove seats from Show's bookedSeats
    await Show.findByIdAndUpdate(booking.show, {
      $pull: { bookedSeats: { $in: booking.seats } }
    });

    // Mark booking as cancelled
    booking.bookingStatus = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    booking.refundAmount = Number((booking.totalAmount * 0.9).toFixed(2)); // 90% refund (10% nominal fee)
    booking.cancellationReason = req.body.reason || 'User requested cancellation';
    booking.cancelledAt = new Date();
    await booking.save();

    // Broadcast seat restoration via socket
    broadcastCancellationUpdate(booking.show.toString(), booking.seats);

    res.status(200).json({
      success: true,
      message: `Booking cancelled successfully. Simulated refund of $${booking.refundAmount} initiated.`,
      booking
    });
  } catch (err) {
    next(err);
  }
};
