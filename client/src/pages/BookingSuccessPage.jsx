import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Ticket,
  Printer,
  Download,
  Calendar,
  Clock,
  MapPin,
  Film,
  Home,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import TicketModal from '../components/TicketModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BookingSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!booking) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await api.getBookingById(id);
          if (res.success && res.booking) {
            setBooking(res.booking);
          }
        } catch (err) {
          console.error('Failed to load booking:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [id, booking]);

  if (loading) return <LoadingSpinner text="Retrieving confirmed booking receipt..." />;

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Booking Receipt Unavailable</h2>
        <Link to="/my-bookings" className="inline-block px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold">
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
          Payment & Reservation Confirmed (Simulated)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Tickets Confirmed!</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Your reservation is verified. We've sent your digital cinema tickets and QR code receipt to your email.
        </p>
      </div>

      {/* Ticket Pass Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Pass Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Booking Reference
            </span>
            <p className="text-xl font-mono font-black text-red-500 tracking-wider">
              {booking.bookingReference}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTicketModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-glow transition"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Open E-Ticket Pass</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Movie Info Grid */}
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={booking.movie?.poster}
            alt={booking.movie?.title}
            className="w-24 h-36 object-cover rounded-2xl border border-slate-800 shadow-md"
          />
          <div className="space-y-2 flex-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
              {booking.screen?.format || 'IMAX 3D'}
            </span>
            <h3 className="text-2xl font-bold text-white">{booking.movie?.title}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {booking.theatre?.name} — {booking.screen?.screenName}
            </p>
            <p className="text-xs text-slate-400">{booking.theatre?.address}</p>
          </div>
        </div>

        {/* Showtime & Seats Details Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Show Date</span>
            <span className="font-bold text-white mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-red-500" />
              {booking.show?.showDate}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Showtime</span>
            <span className="font-bold text-white mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              {booking.show?.startTime}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Reserved Seats</span>
            <span className="font-bold text-red-400 text-sm mt-0.5 block">
              {booking.seats?.join(', ')}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Grand Total</span>
            <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
              ${booking.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* QR Code Graphic Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs font-bold text-white">Entry Gate Pass</h4>
            <p className="text-[11px] text-slate-400">
              Scan this QR code directly at the cinema kiosk or gate usher for immediate admission.
            </p>
          </div>
          {booking.qrCode && (
            <div className="p-2 rounded-xl bg-white flex-shrink-0">
              <img src={booking.qrCode} alt="Ticket QR" className="w-24 h-24" />
            </div>
          )}
        </div>

      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>

        <Link
          to="/my-bookings"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-glow transition"
        >
          <span>View in My Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Ticket Modal */}
      <TicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        booking={booking}
      />
    </div>
  );
}
