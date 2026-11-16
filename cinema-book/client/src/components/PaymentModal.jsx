import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, CheckCircle2, CreditCard, Smartphone, Building2 } from 'lucide-react';

const RazorpayLogo = ({ size = 'md' }) => (
  <svg
    viewBox="0 0 145 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={size === 'sm' ? 'h-4 w-auto' : 'h-6 w-auto'}
  >
    <path d="M17.5 0L7 22h6.8l-3.9 10L27 12H19.5L26 0H17.5z" fill="#2D81F7" />
    <text
      x="32"
      y="24"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="700"
      fontSize="20"
      fill="#ffffff"
    >
      razorpay
    </text>
  </svg>
);

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
  const [tab, setTab] = useState('card');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [name, setName] = useState('Rahul Sharma');
  const [upiId, setUpiId] = useState('rahul@upi');
  const [step, setStep] = useState('form');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('processing');

    setTimeout(() => {
      setStep('done');
      setTimeout(() => {
        const generatedTxnId = `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
        const methodText = tab === 'card' ? 'Razorpay (Card)' : tab === 'upi' ? 'Razorpay (UPI)' : 'Razorpay (NetBanking)';
        onConfirmPayment({
          paymentMethod: methodText,
          paymentId: generatedTxnId
        });
        setStep('form');
      }, 700);
    }, 1800);
  };

  const handleClose = () => {
    if (step === 'processing' || isProcessing) return;
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#111118] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-[#0d0d12]">
          <div className="flex items-center gap-2.5">
            <RazorpayLogo />
            <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full">
              Test Mode
            </span>
          </div>
          <button
            onClick={handleClose}
            disabled={step === 'processing' || isProcessing}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-3.5 bg-zinc-900/40 border-b border-zinc-800/60 space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white font-semibold text-sm">{movie?.title}</p>
              <p className="text-zinc-400 text-xs">
                {theatre?.name} • Screen {show?.screenNumber || 1}
              </p>
            </div>
            <div className="text-right">
              <p className="text-zinc-400 text-xs">{show?.showDate}</p>
              <p className="text-blue-400 text-xs font-semibold">{show?.showTime}</p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-1 text-xs">
            <span className="text-zinc-400">
              Seats ({selectedSeats.length}): <span className="text-zinc-200 font-medium">{selectedSeats.join(', ')}</span>
            </span>
            <span className="text-white font-bold text-sm">₹{totalAmount}</span>
          </div>
        </div>

        <div className="p-5">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTab('card')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    tab === 'card'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('upi')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    tab === 'upi'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('netbanking')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    tab === 'netbanking'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Net Banking</span>
                </button>
              </div>

              {tab === 'card' && (
                <div className="space-y-3 bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Expiry</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">CVV</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              )}

              {tab === 'upi' && (
                <div className="space-y-2 bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800">
                  <label className="text-[11px] text-zinc-400 block">UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="name@bank"
                    required
                  />
                  <p className="text-[10px] text-zinc-500">Auto-approved instant UPI test verification.</p>
                </div>
              )}

              {tab === 'netbanking' && (
                <div className="space-y-2 bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800">
                  <label className="text-[11px] text-zinc-400 block">Select Bank</label>
                  <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                    <option>HDFC Bank</option>
                    <option>State Bank of India</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white text-sm bg-[#2D81F7] hover:bg-blue-500 active:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                Pay ₹{totalAmount} with Razorpay
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> 256-bit SSL
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> PCI-DSS Compliant
                </span>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-14 h-14 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin flex items-center justify-center" />
              <div>
                <p className="text-white font-semibold text-sm">Processing Payment</p>
                <p className="text-zinc-400 text-xs mt-0.5">Contacting payment gateway...</p>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white font-bold text-base">Payment Verified</p>
                <p className="text-zinc-400 text-xs mt-0.5">Confirming your booking details...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
