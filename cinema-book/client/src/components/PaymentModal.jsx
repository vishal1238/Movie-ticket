import React, { useState } from 'react';
import { X, CreditCard, QrCode, Building, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

const PaymentModal = ({
  isOpen,
  onClose,
  movie,
  theatre,
  show,
  selectedSeats = [],
  totalAmount = 0,
  onConfirmPayment,
  isProcessing = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardName, setCardName] = useState('Alex Johnson');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9812');
  const [upiId, setUpiId] = useState('alex@okaxis');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const methodLabel =
      paymentMethod === 'card'
        ? 'Credit / Debit Card'
        : paymentMethod === 'upi'
        ? `UPI (${upiId})`
        : 'Net Banking (Mock HDFC)';
    
    onConfirmPayment(methodLabel);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#121217] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-[#0d0d10]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Payment Checkout</h3>
              <p className="text-xs text-zinc-400">Mock Payment Sandbox (Safe & Instant)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Summary Box */}
        <div className="p-5 bg-zinc-900/50 border-b border-zinc-800/80 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-white text-sm">{movie?.title}</h4>
              <p className="text-xs text-zinc-400">
                {theatre?.name} • Screen {show?.screenNumber || 1}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">{show?.showDate}</span>
              <span className="text-xs font-semibold text-red-400">{show?.showTime}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              Seats ({selectedSeats.length}):{' '}
              <strong className="text-zinc-200">{selectedSeats.join(', ')}</strong>
            </span>
            <span className="text-base font-extrabold text-white">
              Total: <span className="text-red-500">₹{totalAmount}</span>
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-red-500 bg-red-950/20 text-white shadow-md shadow-red-500/10'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-red-500" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-red-500 bg-red-950/20 text-white shadow-md shadow-red-500/10'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <QrCode className="w-4 h-4 text-red-500" />
                <span>UPI Fast</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-red-500 bg-red-950/20 text-white shadow-md shadow-red-500/10'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Building className="w-4 h-4 text-red-500" />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* Dynamic Mock Fields */}
          {paymentMethod === 'card' && (
            <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Expiry / CVV</label>
                  <input
                    type="text"
                    defaultValue="12/28 • 888"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="space-y-2 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
              <label className="text-[11px] text-zinc-400 block">Virtual Payment Address (VPA)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                placeholder="username@bank"
                required
              />
              <p className="text-[10px] text-zinc-500">Auto-approved instant mock UPI transaction.</p>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="space-y-2 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
              <label className="text-[11px] text-zinc-400 block">Select Primary Bank</label>
              <select className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500">
                <option>HDFC Bank Mock Gateway</option>
                <option>State Bank of India</option>
                <option>ICICI Bank Express</option>
                <option>Axis Bank NetPay</option>
              </select>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing & Securing Seats...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Pay ₹{totalAmount} & Confirm Booking</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>End-to-end encrypted • Simulated test environment</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
