const Movie = require('../models/Movie');
const Show = require('../models/Show');

// @desc    Get all movies with search, filter, sort, and pagination
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const {
      search,
      genre,
      language,
      status,
      minRating,
      sort,
      page = 1,
      limit = 12,
      featured
    } = req.query;

    const query = {};

    // Filter by status (now_showing, coming_soon)
    if (status) {
      query.status = status;
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by genre
    if (genre && genre !== 'All') {
      query.genres = { $in: [new RegExp(`^${genre}$`, 'i')] };
    }

    // Filter by language
    if (language && language !== 'All') {
      query.language = { $regex: new RegExp(`^${language}$`, 'i') };
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Search by title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { genres: { $in: [new RegExp(search.trim(), 'i')] } }
      ];
    }

    // Sorting
    let sortOption = { releaseDate: -1 };
    if (sort === 'rating_desc') {
      sortOption = { rating: -1, votesCount: -1 };
    } else if (sort === 'release_desc') {
      sortOption = { releaseDate: -1 };
    } else if (sort === 'release_asc') {
      sortOption = { releaseDate: 1 };
    } else if (sort === 'title_asc') {
      sortOption = { title: 1 };
    } else if (sort === 'popularity') {
      sortOption = { votesCount: -1, rating: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      movies
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single movie by ID with upcoming shows
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Retrieve active shows for this movie
    const today = new Date().toISOString().slice(0, 10);
    const shows = await Show.find({
      movie: movie._id,
      status: 'active',
      showDate: { $gte: today }
    })
      .populate('theatre', 'name city location address amenities')
      .populate('screen', 'screenName format soundSystem seatLayout totalSeats')
      .sort({ showDate: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      movie,
      shows
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      movie
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      movie
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    await Movie.findByIdAndDelete(req.params.id);

    // Also remove associated shows
    await Show.deleteMany({ movie: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Movie and associated shows deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
