import React from 'react';
import { Ticket, CreditCard, ShieldCheck } from 'lucide-react';

const PriceSummary = ({
  selectedSeats = [],
  pricing = { regular: 200, premium: 350 },
  onProceed
}) => {
  let regularCount = 0;
  let premiumCount = 0;

  selectedSeats.forEach(seat => {
    const row = seat.charAt(0).toUpperCase();
    if (row === 'A' || row === 'B') {
      premiumCount += 1;
    } else {
      regularCount += 1;
    }
  });

  const premiumTotal = premiumCount * pricing.premium;
  const regularTotal = regularCount * pricing.regular;
  const subtotal = premiumTotal + regularTotal;
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 25 : 0;
  const totalAmount = subtotal + convenienceFee;

  return (
    <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-red-500" />
            Booking Summary
          </h3>
          <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full font-medium">
            {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Selected Seats
          </label>
          {selectedSeats.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No seats selected yet. Click seats in the layout above.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {selectedSeats.map((seat) => {
                const isPremium = seat.startsWith('A') || seat.startsWith('B');
                return (
                  <span
                    key={seat}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                      isPremium
                        ? 'bg-amber-950/30 text-amber-300 border-amber-500/30'
                        : 'bg-red-950/30 text-red-300 border-red-500/30'
                    }`}
                  >
                    {seat} {isPremium ? '(VIP)' : ''}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2.5 text-sm pt-2 border-t border-zinc-800/80">
          {premiumCount > 0 && (
            <div className="flex justify-between text-zinc-300">
              <span>VIP Recliner ({premiumCount} × ₹{pricing.premium})</span>
              <span className="font-medium text-white">₹{premiumTotal}</span>
            </div>
          )}

          {regularCount > 0 && (
            <div className="flex justify-between text-zinc-300">
              <span>Regular Classic ({regularCount} × ₹{pricing.regular})</span>
              <span className="font-medium text-white">₹{regularTotal}</span>
            </div>
          )}

          {selectedSeats.length > 0 && (
            <div className="flex justify-between text-zinc-400 text-xs">
              <span>Convenience Fee (₹25/ticket)</span>
              <span>₹{convenienceFee}</span>
            </div>
          )}

          <div className="flex justify-between items-baseline pt-3 border-t border-zinc-800 font-bold">
            <span className="text-base text-zinc-200">Total Payable</span>
            <span className="text-2xl text-red-500 font-black">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 space-y-3">
        <button
          type="button"
          disabled={selectedSeats.length === 0}
          onClick={() => onProceed(totalAmount)}
          className={`w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
            selectedSeats.length > 0
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02]'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          Proceed to Payment
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% Safe & Secure Checkout</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
