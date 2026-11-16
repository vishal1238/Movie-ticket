import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Film, MapPin, Calendar, Clock, ArrowLeft, CheckCircle2, Ticket, Download } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatGrid from '../components/SeatGrid';
import PriceSummary from '../components/PriceSummary';
import PaymentModal from '../components/PaymentModal';
import { generateTicketPDF } from '../utils/generateTicketPDF';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/shows/${showId}`);
      setShow(res.data?.data || null);
    } catch (error) {
      toast.error('Failed to load show details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const handleSeatClick = (seatId) => {
    if (show?.bookedSeats?.includes(seatId)) {
      toast.error(`Seat ${seatId} is already booked`);
      return;
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        toast.error('You can select a maximum of 8 seats per booking');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      toast('Please sign in to proceed with your booking.', {
        icon: '🔐'
      });
      navigate('/login', { state: { from: location } });
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (paymentDetails = {}) => {
    try {
      const payload = {
        showId: show._id,
        seats: selectedSeats,
        paymentMethod: paymentDetails.paymentMethod || 'Razorpay',
        paymentId: paymentDetails.paymentId
      };

      const res = await api.post('/bookings', payload);
      const bookingData = res.data?.data;

      setIsPaymentModalOpen(false);
      setConfirmedBooking(bookingData);
      toast.success('Ticket booked successfully!');
    } catch (error) {
      toast.error(error.message || 'Booking failed. Please try again.');
      fetchShowDetails();
      setIsPaymentModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <Film className="w-16 h-16 text-zinc-600 mb-4" />
        <h2 className="text-xl font-bold text-white">Show Not Found</h2>
        <Link to="/movies" className="mt-4 px-4 py-2 bg-red-600 rounded-lg text-sm font-semibold text-white">
          Browse Movies
        </Link>
      </div>
    );
  }

  const movie = show.movie;
  const theatre = show.theatre;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{movie?.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                {theatre?.name} (Screen {show.screenNumber || 1})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                {show.showDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-red-400 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {show.showTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-[#121217] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-red-500" />
              Auditorium Seat Selection
            </h2>
            <span className="text-xs text-zinc-400">
              Max 8 seats per order
            </span>
          </div>

          <SeatGrid
            bookedSeats={show.bookedSeats || []}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
            pricing={show.price || { regular: 200, premium: 350 }}
          />
        </div>

        <div className="lg:col-span-1 sticky top-24">
          <PriceSummary
            selectedSeats={selectedSeats}
            pricing={show.price || { regular: 200, premium: 350 }}
            onProceed={handleProceedToPayment}
          />
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        movie={movie}
        theatre={theatre}
        show={show}
        selectedSeats={selectedSeats}
        totalAmount={
          selectedSeats.reduce((acc, seat) => {
            const isPrem = seat.startsWith('A') || seat.startsWith('B');
            return acc + (isPrem ? (show.price?.premium || 350) : (show.price?.regular || 200));
          }, 0) + (selectedSeats.length * 25)
        }
        onConfirmPayment={handleConfirmPayment}
      />

      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#121217] border border-red-500/40 rounded-3xl max-w-md w-full p-6 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500 text-red-500 flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-400">
                Booking Confirmed
              </span>
              <h3 className="text-2xl font-black text-white">{movie?.title}</h3>
              <p className="text-xs text-zinc-400">
                {theatre?.name} • Screen {show.screenNumber || 1}
              </p>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Booking ID:</span>
                <span className="font-mono font-bold text-red-400">
                  {confirmedBooking.bookingId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Show Date & Time:</span>
                <span className="font-semibold text-white">
                  {show.showDate} at {show.showTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Seats Reserved:</span>
                <span className="font-bold text-white">
                  {confirmedBooking.seats?.join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Amount Paid:</span>
                <span className="font-black text-emerald-400">
                  ₹{confirmedBooking.totalAmount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Transaction ID:</span>
                <span className="font-mono text-zinc-400 text-[10px]">
                  {confirmedBooking.paymentId}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  try {
                    generateTicketPDF(confirmedBooking);
                    toast.success('Ticket PDF downloaded!', { icon: '🎟️' });
                  } catch (e) {
                    toast.error('PDF error: ' + e.message);
                  }
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                Download PDF Ticket
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <Ticket className="w-4 h-4 text-red-500" />
                View in My Bookings
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-2 bg-transparent hover:bg-zinc-900 text-zinc-400 font-medium rounded-xl transition-colors text-xs"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
