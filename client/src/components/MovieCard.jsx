import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

export default function MovieCard({ movie }) {
  if (!movie) return null;

  const hours = Math.floor(movie.duration / 60);
  const minutes = movie.duration % 60;
  const durationStr = `${hours}h ${minutes}m`;

  const isComingSoon = movie.status === 'coming_soon';

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800/90 hover:border-red-500/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1.5 flex flex-col h-full">
      
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white tracking-wide">
            {movie.certification || 'PG-13'}
          </span>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/30 text-[11px] font-bold text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating ? movie.rating.toFixed(1) : '8.0'}</span>
          </div>
        </div>

        {/* Status Tag if Coming Soon */}
        {isComingSoon && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Movie Details */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
            <span className="text-red-400 font-semibold">{movie.language}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {durationStr}
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 title-font">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres && movie.genres.slice(0, 2).map((genre, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-medium text-slate-300 border border-slate-700/60"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/movies/${movie._id}`}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition duration-200 ${
            isComingSoon
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-glow hover:shadow-glow-lg'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>{isComingSoon ? 'View Details' : 'Book Tickets'}</span>
        </Link>
      </div>
    </div>
  );
}
