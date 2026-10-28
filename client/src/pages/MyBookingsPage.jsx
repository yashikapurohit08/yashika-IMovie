import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Printer,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TicketModal from '../components/TicketModal';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertToast from '../components/AlertToast';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'history'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.getMyBookings();
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A 90% simulated refund will be processed.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await api.cancelBooking(bookingId, { reason: 'Cancelled by customer' });
      if (res.success) {
        setAlert({
          type: 'success',
          message: res.message || 'Booking cancelled successfully. Seats released.'
        });
        fetchBookings();
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Failed to cancel booking.'
      });
    } finally {
      setCancellingId(null);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  const upcomingBookings = bookings.filter(
    b => b.bookingStatus === 'CONFIRMED' && (b.show?.showDate >= today)
  );

  const historyBookings = bookings.filter(
    b => b.bookingStatus === 'CANCELLED' || (b.show?.showDate < today)
  );

  const displayed = activeTab === 'upcoming' ? upcomingBookings : historyBookings;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-white">My Movie Bookings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <span className="text-slate-200 font-semibold">{user?.email}</span>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'upcoming'
                ? 'bg-red-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming Shows ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'history'
                ? 'bg-red-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Past & Cancelled ({historyBookings.length})
          </button>
        </div>
      </div>

      {/* Alert Toast */}
      {alert && (
        <AlertToast
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Bookings List */}
      {loading ? (
        <LoadingSpinner text="Loading your ticket bookings..." />
      ) : displayed.length > 0 ? (
        <div className="space-y-4">
          {displayed.map((booking) => {
            const isCancelled = booking.bookingStatus === 'CANCELLED';

            return (
              <div
                key={booking._id}
                className={`p-6 rounded-3xl bg-slate-900/80 border transition-all hover:border-slate-700 ${
                  isCancelled ? 'border-slate-800/60 opacity-75' : 'border-slate-800 shadow-xl'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  
                  {/* Left: Poster + Movie Details */}
                  <div className="flex gap-4">
                    <img
                      src={booking.movie?.poster}
                      alt={booking.movie?.title}
                      className="w-16 h-24 object-cover rounded-xl shadow-md border border-slate-800 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isCancelled ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> CANCELLED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> CONFIRMED
                          </span>
                        )}
                        <span className="text-[11px] font-mono font-bold text-red-400">
                          {booking.bookingReference}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white line-clamp-1">
                        {booking.movie?.title}
                      </h3>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        {booking.theatre?.name} • {booking.screen?.screenName}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-300 pt-0.5">
                        <span className="flex items-center gap-1 font-semibold text-white">
                          <Calendar className="w-3 h-3 text-red-500" />
                          {booking.show?.showDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-white">
                          <Clock className="w-3 h-3 text-red-500" />
                          {booking.show?.startTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Seats & Price */}
                  <div className="flex md:flex-col justify-between w-full md:w-auto md:text-right gap-1 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Seats</span>
                      <span className="text-xs font-bold text-red-400">
                        {booking.seats?.join(', ')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Amount</span>
                      <span className="text-sm font-black text-white">
                        ${booking.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Ticket className="w-3.5 h-3.5 text-red-500" />
                      <span>View Pass</span>
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-semibold transition disabled:opacity-50"
                        title="Cancel booking and release seats"
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don't have any {activeTab} movie tickets. Discover exciting new releases and book your seats now!
          </p>
          <Link
            to="/movies"
            className="inline-block px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-glow transition mt-2"
          >
            Explore Movies
          </Link>
        </div>
      )}

      {/* Ticket Modal for full QR display & printing */}
      <TicketModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
      />
    </div>
  );
}
