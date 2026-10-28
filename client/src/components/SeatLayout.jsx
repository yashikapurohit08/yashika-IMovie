import React from 'react';
import { Armchair, Lock, ShieldAlert } from 'lucide-react';

export default function SeatLayout({
  seatLayout,
  bookedSeats = [],
  heldSeats = {},
  selectedSeats = [],
  sessionId,
  pricing = { regular: 12, premium: 16, vip: 22 },
  onToggleSeat
}) {
  const rows = seatLayout?.rows || [];

  // Helper to check seat status
  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) {
      return 'booked';
    }
    const holdInfo = heldSeats[seatId];
    if (holdInfo) {
      if (holdInfo.userOrSessionId !== sessionId) {
        return 'held_by_other';
      }
    }
    if (selectedSeats.includes(seatId)) {
      return 'selected';
    }
    return 'available';
  };

  const getCategoryPrice = (category) => {
    if (category === 'VIP') return pricing.vip || 22;
    if (category === 'Premium') return pricing.premium || 16;
    return pricing.regular || 12;
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Cinema Screen Indicator */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <div className="w-4/5 cinema-screen-curved mb-3" />
        <span className="text-[11px] font-bold tracking-[0.25em] text-slate-500 uppercase">
          All Eyes This Way: Screen
        </span>
      </div>

      {/* Seating Grid */}
      <div className="w-full overflow-x-auto pb-6 flex justify-center">
        <div className="flex flex-col gap-3 min-w-max px-4">
          {rows.map((row) => {
            const rowLabel = row.rowLabel;
            const category = row.category || 'Regular';
            const price = getCategoryPrice(category);
            const seatsCount = row.seatsCount || 12;
            const aisles = row.aisles || [3, 9];

            return (
              <div key={rowLabel} className="flex items-center gap-3">
                
                {/* Row Label (Left) */}
                <div className="w-6 text-center text-xs font-bold text-slate-400">
                  {rowLabel}
                </div>

                {/* Seats in this row */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: seatsCount }, (_, i) => i + 1).map((seatNum) => {
                    const seatId = `${rowLabel}-${seatNum}`;
                    const status = getSeatStatus(seatId);
                    const isAisleGap = aisles.includes(seatNum);

                    return (
                      <React.Fragment key={seatId}>
                        <button
                          disabled={status === 'booked' || status === 'held_by_other'}
                          onClick={() => onToggleSeat(seatId, category, price)}
                          title={`${rowLabel}${seatNum} (${category}) - $${price}`}
                          className={`group relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-200 select-none ${
                            status === 'selected'
                              ? 'bg-red-600 text-white shadow-glow scale-110 z-10'
                              : status === 'booked'
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-40 border border-slate-700'
                              : status === 'held_by_other'
                              ? 'bg-amber-950/80 text-amber-500 border border-amber-500/50 cursor-not-allowed animate-pulse'
                              : category === 'VIP'
                              ? 'bg-purple-950/40 border border-purple-500/50 text-purple-300 hover:border-red-500 hover:bg-red-600/20'
                              : category === 'Premium'
                              ? 'bg-blue-950/40 border border-blue-500/50 text-blue-300 hover:border-red-500 hover:bg-red-600/20'
                              : 'bg-slate-900 border border-slate-700/80 text-slate-300 hover:border-red-500 hover:bg-red-600/20'
                          }`}
                        >
                          {status === 'booked' ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            <span>{seatNum}</span>
                          )}

                          {/* Hover Tooltip */}
                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                            <div className="px-2 py-1 rounded bg-black/90 text-white text-[10px] font-semibold whitespace-nowrap border border-slate-700 shadow-xl">
                              {rowLabel}{seatNum} • {category} • ${price}
                            </div>
                            <div className="w-1.5 h-1.5 bg-black rotate-45 -mt-1 border-r border-b border-slate-700" />
                          </div>
                        </button>

                        {/* Aisle Spacer */}
                        {isAisleGap && <div className="w-4 sm:w-6" />}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Row Label (Right) */}
                <div className="w-6 text-center text-xs font-bold text-slate-400">
                  {rowLabel}
                </div>

                {/* Category Badge */}
                <div className="hidden sm:block text-[10px] font-semibold text-slate-500 w-16 text-right">
                  {category}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seating Legend */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 w-full max-w-3xl flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-red-600 shadow-glow" />
          <span className="font-semibold text-white">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center opacity-40">
            <Lock className="w-3 h-3 text-slate-500" />
          </div>
          <span>Already Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-amber-950/80 border border-amber-500/50" />
          <span>Reserved / Held</span>
        </div>
        
        {/* Tier Badges */}
        <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
          <span className="text-[11px] text-purple-400 font-semibold">VIP (${pricing.vip})</span>
          <span className="text-[11px] text-blue-400 font-semibold">Premium (${pricing.premium})</span>
          <span className="text-[11px] text-slate-400 font-semibold">Regular (${pricing.regular})</span>
        </div>
      </div>
    </div>
  );
}
