import React from 'react';
import { Armchair, Sparkles } from 'lucide-react';

const SeatGrid = ({
  bookedSeats = [],
  selectedSeats = [],
  onSeatClick,
  pricing = { regular: 200, premium: 350 }
}) => {
  const rows = [
    { label: 'A', type: 'premium', seats: 10 },
    { label: 'B', type: 'premium', seats: 10 },
    { label: 'C', type: 'regular', seats: 10 },
    { label: 'D', type: 'regular', seats: 10 },
    { label: 'E', type: 'regular', seats: 10 },
    { label: 'F', type: 'regular', seats: 10 },
    { label: 'G', type: 'regular', seats: 10 },
  ];

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Cinema Screen Visual */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <div className="w-full h-8 cinema-screen-curve bg-gradient-to-b from-red-600/30 via-red-600/5 to-transparent relative flex items-center justify-center">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-red-500 drop-shadow">
            Screen This Way
          </span>
        </div>
        <div className="w-3/4 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent mt-1" />
      </div>

      {/* Seat Layout */}
      <div className="space-y-6 w-full max-w-2xl overflow-x-auto pb-4">
        {/* Premium Section Header */}
        <div className="flex items-center justify-between text-xs font-semibold text-amber-400 border-b border-amber-500/20 pb-1.5 px-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Premium Recliners</span>
          </div>
          <span>₹{pricing.premium}</span>
        </div>

        {/* Premium Rows A & B */}
        <div className="space-y-3">
          {rows.filter(r => r.type === 'premium').map((row) => (
            <div key={row.label} className="flex items-center justify-center gap-2">
              <span className="w-6 text-center text-xs font-bold text-amber-400/80">
                {row.label}
              </span>
              <div className="flex items-center gap-2 sm:gap-2.5">
                {Array.from({ length: row.seats }).map((_, index) => {
                  const seatNumber = index + 1;
                  const seatId = `${row.label}${seatNumber}`;
                  const status = getSeatStatus(seatId);
                  const isBooked = status === 'booked';
                  const isSelected = status === 'selected';

                  return (
                    <React.Fragment key={seatId}>
                      {/* Central Aisle separator after seat 5 */}
                      {index === 5 && <div className="w-4 sm:w-8" />}
                      <button
                        type="button"
                        disabled={isBooked}
                        onClick={() => onSeatClick(seatId)}
                        title={`Seat ${seatId} (${row.type.toUpperCase()} - ₹${pricing.premium}) - ${status}`}
                        className={`group relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-200 ${
                          isBooked
                            ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/50 scale-110 ring-2 ring-red-400'
                            : 'bg-zinc-900/90 border border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-950/30 hover:scale-105'
                        }`}
                      >
                        {seatNumber}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
              <span className="w-6 text-center text-xs font-bold text-amber-400/80">
                {row.label}
              </span>
            </div>
          ))}
        </div>

        {/* Regular Section Header */}
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 border-b border-zinc-800 pb-1.5 px-4 pt-3">
          <div className="flex items-center gap-1.5">
            <Armchair className="w-3.5 h-3.5" />
            <span>Classic Regular Seats</span>
          </div>
          <span>₹{pricing.regular}</span>
        </div>

        {/* Regular Rows C to G */}
        <div className="space-y-3">
          {rows.filter(r => r.type === 'regular').map((row) => (
            <div key={row.label} className="flex items-center justify-center gap-2">
              <span className="w-6 text-center text-xs font-bold text-zinc-500">
                {row.label}
              </span>
              <div className="flex items-center gap-2 sm:gap-2.5">
                {Array.from({ length: row.seats }).map((_, index) => {
                  const seatNumber = index + 1;
                  const seatId = `${row.label}${seatNumber}`;
                  const status = getSeatStatus(seatId);
                  const isBooked = status === 'booked';
                  const isSelected = status === 'selected';

                  return (
                    <React.Fragment key={seatId}>
                      {/* Central Aisle separator after seat 5 */}
                      {index === 5 && <div className="w-4 sm:w-8" />}
                      <button
                        type="button"
                        disabled={isBooked}
                        onClick={() => onSeatClick(seatId)}
                        title={`Seat ${seatId} (${row.type.toUpperCase()} - ₹${pricing.regular}) - ${status}`}
                        className={`group relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-200 ${
                          isBooked
                            ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/50 scale-110 ring-2 ring-red-400'
                            : 'bg-zinc-800/80 border border-zinc-700/80 text-zinc-300 hover:border-red-500/60 hover:bg-zinc-700 hover:scale-105'
                        }`}
                      >
                        {seatNumber}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
              <span className="w-6 text-center text-xs font-bold text-zinc-500">
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Seating Legend */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 bg-zinc-900/60 px-6 py-3 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700" />
          <span>Available (Regular)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-zinc-900 border border-amber-500/50" />
          <span className="text-amber-300 font-medium">VIP Premium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-red-600 shadow-sm shadow-red-600/50" />
          <span className="text-white font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 opacity-50" />
          <span>Already Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
