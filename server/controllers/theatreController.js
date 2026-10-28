const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');

// @desc    Get all theatres (optional city filter)
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = {};
    if (city && city !== 'All') {
      query.city = new RegExp(`^${city}$`, 'i');
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: theatres.length,
      theatres
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single theatre with its screens
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const screens = await Screen.find({ theatre: theatre._id });

    res.status(200).json({
      success: true,
      theatre,
      screens
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new theatre
// @route   POST /api/theatres
// @access  Private/Admin
exports.createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({
      success: true,
      theatre
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
exports.updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }
    res.status(200).json({
      success: true,
      theatre
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete theatre
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }
    await Theatre.findByIdAndDelete(req.params.id);
    await Screen.deleteMany({ theatre: req.params.id });
    res.status(200).json({
      success: true,
      message: 'Theatre and its screens deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
