import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Mail, Phone, MapPin, Heart, ShieldCheck, Clock, Ticket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070A11] border-t border-slate-800/80 pt-16 pb-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant E-Tickets</h4>
              <p className="text-xs text-slate-500">Fast & paperless entry</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Real-Time Seats</h4>
              <p className="text-xs text-slate-500">Live seat hold sync</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Guaranteed Best Rates</h4>
              <p className="text-xs text-slate-500">No hidden surprises</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">IMAX & Dolby 3D</h4>
              <p className="text-xs text-slate-500">Ultimate cinema immersion</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-white shadow-glow">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                I<span className="text-red-600">MOVIES</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              IMovies is your premier digital cinema booking companion. Experience blockbusters on IMAX, Dolby Atmos, and luxury VIP recliner screens with real-time seat locks and effortless ticketing.
            </p>
            <div className="flex items-center gap-4 text-xs pt-2">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-red-500" /> +1 (800) 555-4668
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-red-500" /> support@imovies.com
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Discover</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/movies?status=now_showing" className="hover:text-red-400 transition">Now Showing</Link></li>
              <li><Link to="/movies?status=coming_soon" className="hover:text-red-400 transition">Coming Soon</Link></li>
              <li><Link to="/movies" className="hover:text-red-400 transition">All Movies</Link></li>
              <li><Link to="/movies?genre=Sci-Fi" className="hover:text-red-400 transition">Sci-Fi Blockbusters</Link></li>
              <li><Link to="/movies?genre=Action" className="hover:text-red-400 transition">Action & Thrillers</Link></li>
            </ul>
          </div>

          {/* Cinemas & Cities */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Cinemas</h5>
            <ul className="space-y-2.5 text-xs">
              <li><span className="hover:text-white cursor-pointer transition">New York - Times Square</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Los Angeles - Hollywood</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Chicago - Michigan Ave</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Toronto - Yonge Dundas</span></li>
              <li><span className="hover:text-white cursor-pointer transition">London - West End</span></li>
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Newsletter</h5>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get exclusive early-access ticket sales and promotions.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to IMovies updates!');
                }}
                className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-glow transition"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} IMovies Cinema Entertainment Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Preferences</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
