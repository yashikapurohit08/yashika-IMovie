import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Film,
  Calendar,
  Clock,
  MapPin,
  Timer,
  AlertCircle,
  Ticket,
  ChevronLeft,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  getSocket,
  joinShowRoom,
  leaveShowRoom,
  emitSeatHold,
  emitSeatRelease
} from '../services/socket';
import SeatLayout from '../components/SeatLayout';
import BookingSummaryModal from '../components/BookingSummaryModal';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertToast from '../components/AlertToast';

export default function BookingPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, sessionId } = useAuth();

  const [show, setShow] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [heldSeats, setHeldSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatDetails, setSelectedSeatDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Hold Countdown Timer (10 minutes)
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Checkout Modal State
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);

  // Fetch show details and initial seats availability
  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.getShowById(showId);
        if (res.success && res.show) {
          setShow(res.show);
          setBookedSeats(res.bookedSeats || []);
          setHeldSeats(res.heldSeats || {});
        } else {
          setError('Show not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load seating availability.');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId]);

  // Real-time Socket.IO synchronization
  useEffect(() => {
    if (!showId) return;

    const socket = getSocket();
    joinShowRoom(showId);

    // Socket Event: Another customer held seats
    const handleSeatsHeld = ({ showId: sid, seats, userOrSessionId }) => {
      if (sid === showId && userOrSessionId !== sessionId) {
        setHeldSeats((prev) => {
          const next = { ...prev };
          seats.forEach((seat) => {
            next[seat] = { userOrSessionId, expiresAt: new Date(Date.now() + 600000) };
          });
          return next;
        });

        // If another user held any seat I currently selected, notify and remove from my selection
        setSelectedSeats((mySeats) => {
          const conflict = mySeats.some((s) => seats.includes(s));
          if (conflict) {
            setError('A seat you selected was just reserved by another user.');
            return mySeats.filter((s) => !seats.includes(s));
          }
          return mySeats;
        });
      }
    };

    // Socket Event: Another customer released seats
    const handleSeatsReleased = ({ showId: sid, seats }) => {
      if (sid === showId) {
        setHeldSeats((prev) => {
          const next = { ...prev };
          seats.forEach((seat) => delete next[seat]);
          return next;
        });
      }
    };

    // Socket Event: A booking was confirmed
    const handleSeatsConfirmed = ({ showId: sid, bookedSeats: newBooked }) => {
      if (sid === showId) {
        setBookedSeats((prev) => Array.from(new Set([...prev, ...newBooked])));
        setHeldSeats((prev) => {
          const next = { ...prev };
          newBooked.forEach((seat) => delete next[seat]);
          return next;
        });
      }
    };

    // Socket Event: A booking was cancelled / restored
    const handleSeatsRestored = ({ showId: sid, releasedSeats }) => {
      if (sid === showId) {
        setBookedSeats((prev) => prev.filter((s) => !releasedSeats.includes(s)));
      }
    };

    socket.on('seats_held', handleSeatsHeld);
    socket.on('seats_released', handleSeatsReleased);
    socket.on('seats_confirmed', handleSeatsConfirmed);
    socket.on('seats_restored', handleSeatsRestored);

    return () => {
      leaveShowRoom(showId);
      socket.off('seats_held', handleSeatsHeld);
      socket.off('seats_released', handleSeatsReleased);
      socket.off('seats_confirmed', handleSeatsConfirmed);
      socket.off('seats_restored', handleSeatsRestored);
    };
  }, [showId, sessionId]);

  // Hold countdown interval
  useEffect(() => {
    if (!holdExpiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(holdExpiresAt) - new Date()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        setError('Seat hold expired. Please re-select your seats.');
        setSelectedSeats([]);
        setSelectedSeatDetails([]);
        setHoldExpiresAt(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  // Handle Seat Selection Toggle
  const handleToggleSeat = async (seatId, category, price) => {
    setError('');

    let updatedSeats;
    let updatedDetails;

    if (selectedSeats.includes(seatId)) {
      // Deselect
      updatedSeats = selectedSeats.filter((s) => s !== seatId);
      updatedDetails = selectedSeatDetails.filter((d) => d.seat !== seatId);

      // Release hold on socket
      emitSeatRelease(showId, [seatId], sessionId);
      api.releaseSeats(showId, { seats: [seatId], userOrSessionId: sessionId }).catch(() => {});
    } else {
      // Check max seat selection (limit 8 per booking)
      if (selectedSeats.length >= 8) {
        setError('You can select a maximum of 8 seats per booking.');
        return;
      }

      updatedSeats = [...selectedSeats, seatId];
      updatedDetails = [...selectedSeatDetails, { seat: seatId, category, price }];

      // Request temporary hold on backend & broadcast
      try {
        const holdRes = await api.holdSeats(showId, {
          seats: [seatId],
          userOrSessionId: sessionId
        });

        if (holdRes.success) {
          setHoldExpiresAt(holdRes.expiresAt);
          setTimeLeft(600);
          emitSeatHold(showId, [seatId], sessionId);
        }
      } catch (err) {
        setError(err.message || 'Could not hold seat.');
        return;
      }
    }

    setSelectedSeats(updatedSeats);
    setSelectedSeatDetails(updatedDetails);

    if (updatedSeats.length === 0) {
      setHoldExpiresAt(null);
    }
  };

  // Subtotal calculation
  const subtotal = selectedSeatDetails.reduce((sum, item) => sum + item.price, 0);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      setShowAuthGate(true);
      return;
    }
    setIsSummaryOpen(true);
  };

  const handleConfirmBooking = async ({ snacks, paymentMethod, simulateFailure }) => {
    try {
      setIsProcessing(true);
      setError('');

      const res = await api.createBooking({
        showId,
        seats: selectedSeats,
        snacks,
        paymentMethod,
        simulateFailure
      });

      if (res.success && res.booking) {
        navigate(`/booking/success/${res.booking._id}`, {
          state: { booking: res.booking }
        });
      }
    } catch (err) {
      setError(err.message || 'Booking confirmation failed.');
      setIsProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner text="Connecting to cinema seating auditorium..." />;

  if (error && !show) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Auditorium Unavailable</h2>
        <p className="text-xs text-slate-400">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-glow"
        >
          Return to Showtimes
        </button>
      </div>
    );
  }

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Film className="w-3.5 h-3.5" />
              <span>Step 2: Choose Your Seats</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{show?.movie?.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {show?.theatre?.name} • {show?.screen?.screenName} ({show?.screen?.format})
            </p>
          </div>
        </div>

        {/* Date, Time & Hold Timer */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-white">{show?.showDate}</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-white">{show?.startTime}</span>
          </div>

          {holdExpiresAt && selectedSeats.length > 0 && (
            <div className="px-3.5 py-2 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center gap-2 font-mono font-bold animate-pulse shadow-glow">
              <Timer className="w-4 h-4" />
              <span>Hold: {formatTimer(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notifications / Alerts */}
      {error && (
        <AlertToast message={error} type="error" onClose={() => setError('')} />
      )}

      {/* Main Grid: Interactive Seating (2 cols) & Booking Sidebar (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Seating Layout Canvas (3 cols) */}
        <div className="lg:col-span-3 p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl flex flex-col items-center">
          <SeatLayout
            seatLayout={show?.screen?.seatLayout}
            bookedSeats={bookedSeats}
            heldSeats={heldSeats}
            selectedSeats={selectedSeats}
            sessionId={sessionId}
            pricing={show?.pricing}
            onToggleSeat={handleToggleSeat}
          />
        </div>

        {/* Ticket Breakdown Sidebar (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 sticky top-28 shadow-2xl">
            
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Selected Seats ({selectedSeats.length})
              </h3>
              <p className="text-[11px] text-slate-500">Max 8 tickets per transaction</p>
            </div>

            {/* Selected Seats Chips */}
            {selectedSeats.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeatDetails.map((item) => (
                    <div
                      key={item.seat}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-between gap-3 text-xs w-full"
                    >
                      <div>
                        <span className="font-bold text-red-400 mr-2">{item.seat}</span>
                        <span className="text-[10px] text-slate-400">{item.category} Tier</span>
                      </div>
                      <span className="font-bold text-white">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Ticket Subtotal</span>
                    <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Convenience Fee ($1.50/seat)</span>
                    <span className="font-bold text-white">${(selectedSeats.length * 1.5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-bold text-white">
                      ${((subtotal + selectedSeats.length * 1.5) * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                    <span className="text-white">Estimated Total</span>
                    <span className="text-lg font-black text-red-500">
                      ${((subtotal + selectedSeats.length * 1.5) * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition hover:scale-[1.02]"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Proceed to Payment</span>
                </button>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <Ticket className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-400">No seats selected yet</p>
                <p className="text-[11px] text-slate-600">
                  Click on available seats on the layout to begin your reservation.
                </p>
              </div>
            )}

            {/* Information Callout */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1 leading-relaxed">
              <p className="font-bold text-slate-300">Automatic Seat Lock:</p>
              <p>Seats are held exclusively for you for 10 minutes once clicked.</p>
            </div>

          </div>
        </div>

      </div>

      {/* Guest Authentication Gate Modal */}
      {showAuthGate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-3xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Sign In to Complete Booking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your selected seats <span className="text-red-400 font-bold">{selectedSeats.join(', ')}</span> are reserved for you. Please sign in or create an account to receive your tickets.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/login"
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-glow"
              >
                Create Account
              </Link>
            </div>
            <button
              onClick={() => setShowAuthGate(false)}
              className="text-xs text-slate-500 hover:text-slate-400 pt-2 block mx-auto"
            >
              Continue exploring seats
            </button>
          </div>
        </div>
      )}

      {/* Booking Summary & Mock Payment Modal */}
      <BookingSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        show={show}
        selectedSeats={selectedSeats}
        seatDetails={selectedSeatDetails}
        subtotal={subtotal}
        onConfirmBooking={handleConfirmBooking}
        isProcessing={isProcessing}
      />
    </div>
  );
}
