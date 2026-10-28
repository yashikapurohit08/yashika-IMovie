import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  Play,
  MapPin,
  Ticket,
  ChevronRight,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useCity } from '../context/CityContext';
import TrailerModal from '../components/TrailerModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCity } = useCity();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Generate 7 upcoming dates
  const nextDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayName, formatted };
  });

  useEffect(() => {
    if (nextDates.length > 0 && !selectedDate) {
      setSelectedDate(nextDates[0].dateStr);
    }
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.getMovieById(id);
        if (res.success && res.movie) {
          setMovie(res.movie);
          setShows(res.shows || []);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading cinematic presentation..." />;

  if (error || !movie) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <Film className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Movie Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'Could not locate this title in our database.'}</p>
        <Link to="/movies" className="inline-block px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-glow">
          Return to Movies Catalog
        </Link>
      </div>
    );
  }

  const hours = Math.floor((movie.duration || 120) / 60);
  const minutes = (movie.duration || 120) % 60;

  // Filter shows by selected date
  const filteredShows = shows.filter(s => s.showDate === selectedDate);

  // Group shows by Theatre
  const showsByTheatre = {};
  filteredShows.forEach(s => {
    const tId = s.theatre?._id;
    if (!tId) return;
    if (!showsByTheatre[tId]) {
      showsByTheatre[tId] = {
        theatre: s.theatre,
        screenShows: []
      };
    }
    showsByTheatre[tId].screenShows.push(s);
  });

  const theatreGroups = Object.values(showsByTheatre);

  return (
    <div className="space-y-12 pb-24">
      
      {/* Backdrop Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[480px] bg-slate-950 overflow-hidden">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/60 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col sm:flex-row items-end gap-6 sm:gap-8">
          
          {/* Poster Card */}
          <div className="w-32 sm:w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/80 bg-slate-900 flex-shrink-0 -mb-4 sm:-mb-6 z-10">
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          {/* Title and Badges */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-black uppercase text-[10px] tracking-wider shadow-glow">
                {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
              </span>
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/20 text-white font-bold text-xs">
                {movie.certification || 'PG-13'}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 border border-amber-500/30 text-amber-400 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'}</span>
                <span className="text-slate-400 text-[10px]">({movie.votesCount?.toLocaleString()} votes)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {hours}h {minutes}m
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                {movie.language}
              </span>
              <span>•</span>
              <span>Released {new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
            </div>
          </div>

          {/* Trailer Button */}
          {movie.trailerUrl && (
            <button
              onClick={() => setTrailerOpen(true)}
              className="px-5 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-red-500/50 text-white text-xs font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition"
            >
              <div className="w-6 h-6 rounded-full bg-red-600/30 text-red-500 flex items-center justify-center">
                <Play className="w-3 h-3 fill-red-500 ml-0.5" />
              </div>
              <span>Watch Trailer</span>
            </button>
          )}
        </div>
      </section>

      {/* Main Details and Showtime Booking Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Synopsis, Cast, Director */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* Synopsis */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Synopsis</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{movie.description}</p>
            
            <div className="pt-2 flex flex-wrap gap-1.5">
              {movie.genres?.map((g, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Director & Crew */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Director</h3>
            <p className="text-xs font-semibold text-white">{movie.director || 'Visionary Filmmakers'}</p>
          </div>

          {/* Cast Members */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Top Cast</h3>
              <div className="grid grid-cols-2 gap-3">
                {movie.cast.map((actor, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <img
                      src={actor.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                      alt={actor.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="space-y-0.5 overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{actor.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{actor.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Showtime & Theatres Booking Flow */}
        <div className="space-y-8 lg:col-span-2">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white">Select Date & Showtime</h2>
                <p className="text-xs text-slate-400 mt-0.5">Showing theatres near {selectedCity}</p>
              </div>

              {/* Notice */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 text-xs">
                <Info className="w-3.5 h-3.5" />
                <span>Real-Time Seat Locks Active</span>
              </div>
            </div>

            {/* Date Picker Chips */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Choose Date</span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {nextDates.map(item => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-red-600 border-red-500 text-white shadow-glow'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-[10px] uppercase font-bold tracking-wider">{item.dayName}</p>
                      <p className="text-xs font-black mt-0.5">{item.formatted}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theatre & Shows Listing */}
            <div className="space-y-6 pt-4">
              {movie.status === 'coming_soon' ? (
                <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
                  <Calendar className="w-10 h-10 text-amber-500 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Advanced Ticket Sales Opening Soon</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    This movie is scheduled for an upcoming release date ({new Date(movie.releaseDate).toLocaleDateString()}). Showtimes will be announced 3 days prior to release.
                  </p>
                </div>
              ) : theatreGroups.length > 0 ? (
                theatreGroups.map((group) => (
                  <div
                    key={group.theatre._id}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-4 hover:border-slate-700 transition"
                  >
                    {/* Theatre Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          {group.theatre.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 ml-5.5">{group.theatre.address}</p>
                      </div>

                      {/* Amenities Tags */}
                      <div className="flex flex-wrap gap-1">
                        {group.theatre.amenities?.slice(0, 2).map((a, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-400">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Shows for this theatre */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {group.screenShows.map((show) => {
                          return (
                            <button
                              key={show._id}
                              onClick={() => navigate(`/booking/${show._id}`)}
                              className="group px-4 py-3 rounded-2xl bg-slate-900 hover:bg-red-600/20 border border-slate-800 hover:border-red-500 text-left transition-all hover:shadow-glow"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-black text-white group-hover:text-red-400">
                                  {show.startTime}
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-red-400 border border-slate-700">
                                  {show.screen?.format || 'IMAX 3D'}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between gap-4">
                                <span>{show.screen?.screenName?.split('-')[1] || 'Main Hall'}</span>
                                <span className="text-emerald-400 font-semibold">From ${show.pricing?.regular || 12}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                  <Film className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-300">
                    No showtimes currently scheduled for {selectedDate}.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Please try selecting another date from the tabs above.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </div>
  );
}
