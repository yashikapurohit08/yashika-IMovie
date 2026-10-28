import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
        <Film className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-white">404 — Screen Not Found</h1>
      <p className="text-xs text-slate-400 max-w-sm">
        The cinematic page you are looking for does not exist or may have been relocated.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow transition mt-2"
      >
        <Home className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
