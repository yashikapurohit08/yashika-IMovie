import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Ticket, Star, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

export default function HeroBanner({ movies = [], onWatchTrailer }) {
  const featuredMovies = movies.filter(m => m.featured) || [];
  const displayMovies = featuredMovies.length > 0 ? featuredMovies : movies.slice(0, 3);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (displayMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayMovies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [displayMovies.length]);

  if (displayMovies.length === 0) return null;

  const currentMovie = displayMovies[currentIndex];

  const hours = Math.floor((currentMovie.duration || 120) / 60);
  const minutes = (currentMovie.duration || 120) % 60;

  return (
    <section className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-slate-950">
      
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
        <img
          src={currentMovie.backdrop || currentMovie.poster}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105"
        />
        {/* Subtle cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E17] via-[#0A0E17]/70 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl space-y-4">
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-red-600 text-white font-black uppercase tracking-wider text-[11px] shadow-glow">
              Featured Premiere
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/20 text-white font-semibold">
              {currentMovie.certification || 'PG-13'}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {currentMovie.rating?.toFixed(1) || '8.5'}
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {hours}h {minutes}m
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300 font-medium">{currentMovie.language}</span>
          </div>

          {/* Movie Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {currentMovie.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 pt-1">
            {currentMovie.genres?.map((genre, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-slate-200"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
            {currentMovie.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to={`/movies/${currentMovie._id}`}
              className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-2 shadow-glow hover:shadow-glow-lg transition duration-200 hover:scale-105"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </Link>

            {currentMovie.trailerUrl && (
              <button
                onClick={() => onWatchTrailer(currentMovie.trailerUrl, currentMovie.title)}
                className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-white font-semibold text-sm flex items-center gap-2 border border-slate-700/80 backdrop-blur-md transition hover:scale-105"
              >
                <div className="w-6 h-6 rounded-full bg-red-600/30 text-red-500 flex items-center justify-center border border-red-500/40">
                  <Play className="w-3 h-3 fill-red-500 ml-0.5" />
                </div>
                <span>Watch Trailer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      {displayMovies.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? displayMovies.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % displayMovies.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {displayMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
