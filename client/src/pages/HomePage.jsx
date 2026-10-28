import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Sparkles, TrendingUp, Calendar, ChevronRight, Award, Shield, Zap, HeartHandshake } from 'lucide-react';
import { api } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('now_showing'); // 'now_showing', 'trending', 'coming_soon'
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, url: '', title: '' });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await api.getMovies('?limit=20');
        if (res.success && res.movies) {
          setMovies(res.movies);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleOpenTrailer = (url, title) => {
    setTrailerModal({ isOpen: true, url, title });
  };

  const nowShowingMovies = movies.filter(m => m.status === 'now_showing');
  const comingSoonMovies = movies.filter(m => m.status === 'coming_soon');
  const trendingMovies = [...movies].sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0));

  let displayedMovies = nowShowingMovies;
  if (activeTab === 'trending') displayedMovies = trendingMovies;
  if (activeTab === 'coming_soon') displayedMovies = comingSoonMovies;

  return (
    <div className="space-y-16 pb-20">
      
      {/* Cinematic Hero Banner */}
      {!loading && (
        <HeroBanner movies={movies} onWatchTrailer={handleOpenTrailer} />
      )}

      {/* Main Browse Section with Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cinema Experience</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Explore Blockbusters</h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('now_showing')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'now_showing'
                  ? 'bg-red-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Now Showing</span>
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'trending'
                  ? 'bg-red-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>

            <button
              onClick={() => setActiveTab('coming_soon')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'coming_soon'
                  ? 'bg-red-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Coming Soon</span>
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <LoadingSpinner text="Fetching movies and showtimes..." />
        ) : displayedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 pt-8">
            {displayedMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold">No movies found in this category right now.</p>
          </div>
        )}

        <div className="text-center pt-10">
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-red-500/50 text-xs font-bold text-slate-200 hover:text-white transition group"
          >
            <span>Browse Full Catalog & Filters</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Why Choose IMovies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-red-500 text-xs font-bold uppercase tracking-widest">
              Why Moviegoers Love IMovies
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Elevating the Modern Cinema Experience
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Designed from the ground up for seamless online reservations, real-time seat locks, and transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Live Seat Synchronisation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by Socket.IO, seat selections and holds are broadcast across all active viewers in real time to avoid conflicting bookings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">VIP & Premium Auditoriums</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose between VIP motorized recliners, Dolby Cinema 3D, and standard tiers with upfront, transparent seat pricing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Hassle-Free Cancellation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plans change? Cancel your tickets anytime prior to showtime directly from your My Bookings dashboard with instant refund simulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={() => setTrailerModal({ isOpen: false, url: '', title: '' })}
        trailerUrl={trailerModal.url}
        movieTitle={trailerModal.title}
      />
    </div>
  );
}
