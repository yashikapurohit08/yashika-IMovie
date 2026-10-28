import React from 'react';
import { X, Printer, Download, CheckCircle2, Ticket, Film, Calendar, Clock, MapPin } from 'lucide-react';

export default function TicketModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/pass file for download
    const ticketText = `
========================================
🎬 IMOVIES DIGITAL CINEMA TICKET
========================================
Booking Reference: ${booking.bookingReference}
Movie: ${booking.movie?.title}
Theatre: ${booking.theatre?.name}
Screen: ${booking.screen?.screenName}
Date: ${booking.show?.showDate}
Time: ${booking.show?.startTime}
Seats: ${booking.seats?.join(', ')}
Total Paid: $${booking.totalAmount?.toFixed(2)} (Mock Paid)
Status: ${booking.bookingStatus}
Date Issued: ${new Date(booking.createdAt).toLocaleString()}
========================================
Please present the QR code at the cinema entrance.
Enjoy your movie!
========================================
`;
    const element = document.createElement('a');
    const file = new Blob([ticketText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Ticket_${booking.bookingReference}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Controls (Hidden during print) */}
        <div className="no-print px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Official E-Ticket Verified</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Boarding Pass Ticket */}
        <div className="printable-ticket p-6 space-y-5 bg-[#0F172A] text-slate-100">
          
          {/* Cinema Header */}
          <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white">
                I<span className="text-red-500">MOVIES</span> PASS
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Reference</p>
              <p className="text-xs font-mono font-bold text-red-400">{booking.bookingReference}</p>
            </div>
          </div>

          {/* Movie Banner Info */}
          <div className="flex gap-4">
            <img
              src={booking.movie?.poster}
              alt={booking.movie?.title}
              className="w-20 h-28 object-cover rounded-xl shadow-md border border-slate-800"
            />
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-bold text-white leading-tight">{booking.movie?.title}</h3>
              <p className="text-xs text-red-400 font-semibold">{booking.screen?.format || 'IMAX 3D'}</p>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {booking.theatre?.name}
              </p>
              <p className="text-[11px] text-slate-400">{booking.screen?.screenName}</p>
            </div>
          </div>

          {/* Ticket Grid Data */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Show Date</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-red-500" />
                {booking.show?.showDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Show Time</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-red-500" />
                {booking.show?.startTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Reserved Seats</span>
              <span className="font-bold text-red-400 text-sm mt-0.5 block">
                {booking.seats?.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Amount</span>
              <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                ${booking.totalAmount?.toFixed(2)} (Paid)
              </span>
            </div>
          </div>

          {/* QR Code & Barcode */}
          <div className="p-4 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center space-y-2">
            {booking.qrCode ? (
              <img src={booking.qrCode} alt="Ticket QR Code" className="w-36 h-36" />
            ) : (
              <div className="w-36 h-36 bg-slate-200 flex items-center justify-center font-mono text-xs">
                QR CODE
              </div>
            )}
            <p className="text-[10px] font-mono tracking-widest text-slate-600 uppercase font-semibold">
              SCAN AT CINEMA USHER STAND
            </p>
          </div>

          {/* Notice */}
          <p className="text-[10px] text-center text-slate-500">
            Please arrive 15 minutes before showtime. Valid photo ID may be required for age-restricted titles.
          </p>
        </div>

        {/* Footer Actions (Hidden during print) */}
        <div className="no-print p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Pass</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ticket</span>
          </button>
        </div>

      </div>
    </div>
  );
}
