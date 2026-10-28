import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Film,
  Building2,
  Calendar,
  Users,
  DollarSign,
  Ticket,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertToast from '../components/AlertToast';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'movies', 'theatres', 'shows', 'bookings'
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Search in Bookings
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');

  // Add/Edit Movie Modal State
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genres: 'Action, Sci-Fi',
    language: 'English',
    duration: 120,
    rating: 8.5,
    certification: 'PG-13',
    director: '',
    poster: '',
    backdrop: '',
    trailerUrl: '',
    releaseDate: new Date().toISOString().slice(0, 10),
    status: 'now_showing',
    featured: false
  });

  // Schedule Show Modal State
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [showForm, setShowForm] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    showDate: new Date().toISOString().slice(0, 10),
    startTime: '07:00 PM',
    regularPrice: 12,
    premiumPrice: 16,
    vipPrice: 22
  });

  // Selected theatre's screens for show creation
  const [availableScreens, setAvailableScreens] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, theatresRes, bookingsRes] = await Promise.all([
        api.getAdminStats(),
        api.getMovies('?limit=100'),
        api.getTheatres(),
        api.getAllBookings()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (moviesRes.success) setMovies(moviesRes.movies || []);
      if (theatresRes.success) setTheatres(theatresRes.theatres || []);
      if (bookingsRes.success) setBookings(bookingsRes.bookings || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setAlert({ type: 'error', message: err.message || 'Failed to load admin data.' });
    } finally {
      setLoading(false);
    }
  };

  // Movie CRUD
  const handleOpenAddMovie = () => {
    setEditingMovieId(null);
    setMovieForm({
      title: '',
      description: '',
      genres: 'Action, Sci-Fi',
      language: 'English',
      duration: 120,
      rating: 8.5,
      certification: 'PG-13',
      director: '',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80',
      trailerUrl: '',
      releaseDate: new Date().toISOString().slice(0, 10),
      status: 'now_showing',
      featured: false
    });
    setIsMovieModalOpen(true);
  };

  const handleOpenEditMovie = (m) => {
    setEditingMovieId(m._id);
    setMovieForm({
      title: m.title,
      description: m.description,
      genres: m.genres ? m.genres.join(', ') : '',
      language: m.language,
      duration: m.duration,
      rating: m.rating,
      certification: m.certification || 'PG-13',
      director: m.director || '',
      poster: m.poster,
      backdrop: m.backdrop,
      trailerUrl: m.trailerUrl || '',
      releaseDate: m.releaseDate ? new Date(m.releaseDate).toISOString().slice(0, 10) : '',
      status: m.status,
      featured: m.featured || false
    });
    setIsMovieModalOpen(true);
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movieForm,
        genres: movieForm.genres.split(',').map(g => g.trim()).filter(Boolean),
        duration: Number(movieForm.duration),
        rating: Number(movieForm.rating)
      };

      if (editingMovieId) {
        await api.updateMovie(editingMovieId, payload);
        setAlert({ type: 'success', message: 'Movie updated successfully!' });
      } else {
        await api.createMovie(payload);
        setAlert({ type: 'success', message: 'New movie created and published!' });
      }
      setIsMovieModalOpen(false);
      loadDashboardData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to save movie.' });
    }
  };

  const handleDeleteMovie = async (movieId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? Associated showtimes will also be removed.`)) {
      return;
    }
    try {
      await api.deleteMovie(movieId);
      setAlert({ type: 'success', message: `Movie "${title}" deleted.` });
      loadDashboardData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete movie.' });
    }
  };

  // Schedule Show
  const handleOpenScheduleShow = async (theatreId) => {
    const t = theatres.find(item => item._id === theatreId) || theatres[0];
    if (!t) return;

    try {
      const theatreDetail = await api.getTheatreById(t._id);
      setAvailableScreens(theatreDetail.screens || []);
      setShowForm({
        movieId: movies[0]?._id || '',
        theatreId: t._id,
        screenId: theatreDetail.screens?.[0]?._id || '',
        showDate: new Date().toISOString().slice(0, 10),
        startTime: '07:00 PM',
        regularPrice: 12,
        premiumPrice: 16,
        vipPrice: 22
      });
      setIsShowModalOpen(true);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to fetch theatre screens.' });
    }
  };

  const handleSaveShow = async (e) => {
    e.preventDefault();
    try {
      await api.createShow({
        movie: showForm.movieId,
        theatre: showForm.theatreId,
        screen: showForm.screenId,
        showDate: showForm.showDate,
        startTime: showForm.startTime,
        pricing: {
          regular: Number(showForm.regularPrice),
          premium: Number(showForm.premiumPrice),
          vip: Number(showForm.vipPrice)
        }
      });
      setAlert({ type: 'success', message: 'New show scheduled successfully!' });
      setIsShowModalOpen(false);
      loadDashboardData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to schedule show.' });
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesRef = !bookingSearch || b.bookingReference?.toLowerCase().includes(bookingSearch.toLowerCase()) || b.user?.email?.toLowerCase().includes(bookingSearch.toLowerCase()) || b.movie?.title?.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesStatus = bookingStatusFilter === 'All' || b.bookingStatus === bookingStatusFilter;
    return matchesRef && matchesStatus;
  });

  if (loading) return <LoadingSpinner text="Authorizing and loading Admin Management Console..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-32">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Administrator Dashboard</h1>
            <p className="text-xs text-slate-400">
              Manage movies, theatres, screenings, seat allocations, and recorded revenue
            </p>
          </div>
        </div>

        {/* Global Action */}
        <button
          onClick={handleOpenAddMovie}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-glow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Movie</span>
        </button>
      </div>

      {alert && (
        <AlertToast message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        {[
          { id: 'overview', label: 'Platform Overview', icon: DollarSign },
          { id: 'movies', label: `Movies (${movies.length})`, icon: Film },
          { id: 'theatres', label: `Theatres (${theatres.length})`, icon: Building2 },
          { id: 'bookings', label: `Customer Bookings (${bookings.length})`, icon: Ticket }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-glow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Revenue (Confirmed)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-400">
                ${stats?.totalRevenue?.toFixed(2) || '0.00'}
              </p>
              <span className="text-[10px] text-slate-500 font-mono">From recorded ticket sales</span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Bookings</span>
                <Ticket className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-3xl font-black text-white">{stats?.totalBookings || 0}</p>
              <span className="text-[10px] text-slate-500 font-mono">{stats?.confirmedBookingsCount || 0} Confirmed</span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Movies</span>
                <Film className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats?.totalMovies || 0}</p>
              <span className="text-[10px] text-slate-500 font-mono">In catalog</span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Registered Users</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-black text-white">{stats?.totalUsers || 0}</p>
              <span className="text-[10px] text-slate-500 font-mono">Member accounts</span>
            </div>
          </div>

          {/* Recent Bookings Table Snapshot */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Recent Customer Transactions
              </h3>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                View All Bookings →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Movie</th>
                    <th className="py-3 px-4">Theatre</th>
                    <th className="py-3 px-4">Seats</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {bookings.slice(0, 5).map(b => (
                    <tr key={b._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-red-400">{b.bookingReference}</td>
                      <td className="py-3 px-4 font-semibold text-white">{b.user?.name || b.user?.email}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{b.movie?.title}</td>
                      <td className="py-3 px-4">{b.theatre?.name}</td>
                      <td className="py-3 px-4 font-bold text-red-400">{b.seats?.join(', ')}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">${b.totalAmount?.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.bookingStatus === 'CONFIRMED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MOVIES MANAGEMENT */}
      {activeTab === 'movies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">All Movies in System</h3>
            <button
              onClick={handleOpenAddMovie}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-glow"
            >
              <Plus className="w-4 h-4" /> Add Movie
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map(m => (
              <div
                key={m._id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4 hover:border-slate-700 transition"
              >
                <img
                  src={m.poster}
                  alt={m.title}
                  className="w-20 h-28 object-cover rounded-xl border border-slate-800 flex-shrink-0"
                />
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-red-400">
                        {m.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                      </span>
                      <span className="text-xs font-bold text-amber-400">★ {m.rating}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{m.title}</h4>
                    <p className="text-[11px] text-slate-400">{m.genres?.join(', ')}</p>
                    <p className="text-[10px] text-slate-500">{m.duration} mins • {m.language}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenEditMovie(m)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(m._id, m.title)}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 text-xs flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: THEATRES & SCHEDULE SHOW */}
      {activeTab === 'theatres' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Active Theatres & Screenings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {theatres.map(theatre => (
              <div
                key={theatre._id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-red-500" />
                      {theatre.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{theatre.city} • {theatre.location}</p>
                    <p className="text-[11px] text-slate-500">{theatre.address}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                    {theatre.city}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {theatre.amenities?.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-slate-400">
                        {a}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleOpenScheduleShow(theatre._id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule Show</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BOOKINGS SEARCH & RECORD MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          
          {/* Search and Filter */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search by ref ID, email, or movie..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-slate-400 font-medium">Status Filter:</span>
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Booking Reference</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Movie</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Seats</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(b => (
                      <tr key={b._id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-bold text-red-400">{b.bookingReference}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{b.user?.name || 'Customer'}</p>
                          <p className="text-[10px] text-slate-400">{b.user?.email}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-200">{b.movie?.title}</td>
                        <td className="py-3 px-4">
                          <span>{b.show?.showDate}</span>
                          <span className="block text-[10px] text-slate-500">{b.show?.startTime}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-red-400">{b.seats?.join(', ')}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400">${b.totalAmount?.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.bookingStatus === 'CONFIRMED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No bookings matching your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MOVIE */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-3xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingMovieId ? 'Edit Movie Details' : 'Add New Movie to Catalog'}
              </h3>
              <button
                onClick={() => setIsMovieModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4 pt-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="font-semibold text-slate-300">Movie Title</label>
                  <input
                    type="text"
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-semibold text-slate-300">Synopsis / Description</label>
                  <textarea
                    rows={3}
                    value={movieForm.description}
                    onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Genres (Comma separated)</label>
                  <input
                    type="text"
                    value={movieForm.genres}
                    onChange={(e) => setMovieForm({ ...movieForm, genres: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Language</label>
                  <input
                    type="text"
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Rating (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Certification</label>
                  <select
                    value={movieForm.certification}
                    onChange={(e) => setMovieForm({ ...movieForm, certification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Status</label>
                  <select
                    value={movieForm.status}
                    onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-semibold text-slate-300">Poster Image URL</label>
                  <input
                    type="url"
                    value={movieForm.poster}
                    onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-semibold text-slate-300">Backdrop Banner URL</label>
                  <input
                    type="url"
                    value={movieForm.backdrop}
                    onChange={(e) => setMovieForm({ ...movieForm, backdrop: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-semibold text-slate-300">YouTube Trailer Embed URL (Optional)</label>
                  <input
                    type="url"
                    value={movieForm.trailerUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMovieModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-glow"
                >
                  {editingMovieId ? 'Update Movie' : 'Save Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE SHOW */}
      {isShowModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Schedule New Screening</h3>
              <button
                onClick={() => setIsShowModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShow} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Movie</label>
                <select
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  required
                >
                  {movies.map(m => (
                    <option key={m._id} value={m._id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Auditorium / Screen</label>
                <select
                  value={showForm.screenId}
                  onChange={(e) => setShowForm({ ...showForm, screenId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  required
                >
                  {availableScreens.map(s => (
                    <option key={s._id} value={s._id}>{s.screenName} ({s.format})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Date</label>
                  <input
                    type="date"
                    value={showForm.showDate}
                    onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Start Time</label>
                  <select
                    value={showForm.startTime}
                    onChange={(e) => setShowForm({ ...showForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="01:45 PM">01:45 PM</option>
                    <option value="05:15 PM">05:15 PM</option>
                    <option value="08:30 PM">08:30 PM</option>
                    <option value="10:45 PM">10:45 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Regular ($)</label>
                  <input
                    type="number"
                    value={showForm.regularPrice}
                    onChange={(e) => setShowForm({ ...showForm, regularPrice: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Premium ($)</label>
                  <input
                    type="number"
                    value={showForm.premiumPrice}
                    onChange={(e) => setShowForm({ ...showForm, premiumPrice: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">VIP Recliner ($)</label>
                  <input
                    type="number"
                    value={showForm.vipPrice}
                    onChange={(e) => setShowForm({ ...showForm, vipPrice: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsShowModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-glow"
                >
                  Save Screening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
