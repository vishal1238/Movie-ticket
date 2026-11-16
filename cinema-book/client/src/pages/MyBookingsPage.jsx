import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, Download, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { generateTicketPDF } from '../utils/generateTicketPDF';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to load your bookings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = (booking) => {
    try {
      generateTicketPDF(booking);
      toast.success(`E-Ticket ${booking.bookingId} PDF downloaded!`, {
        icon: '🎟️'
      });
    } catch (err) {
      toast.error('Failed to generate PDF: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Ticket className="w-8 h-8 text-red-500" />
          My Bookings
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your booked tickets, check auditorium timings, and download digital passes.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="min-h-[350px] flex flex-col items-center justify-center p-8 bg-[#121217] border border-zinc-800 rounded-2xl text-center space-y-4">
          <Ticket className="w-16 h-16 text-zinc-600" />
          <h3 className="text-xl font-bold text-zinc-200">No Bookings Yet</h3>
          <p className="text-sm text-zinc-500 max-w-sm">
            You haven't reserved any cinema tickets yet. Explore currently showing movies and pick your favorite seats!
          </p>
          <Link
            to="/movies"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-red-600/30"
          >
            Explore Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const movie = booking.show?.movie;
            const theatre = booking.show?.theatre;

            return (
              <div
                key={booking._id}
                className="bg-[#121217] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col sm:flex-row transition-all hover:border-zinc-700 hover:shadow-2xl hover:shadow-red-950/20"
              >
                <div className="sm:w-40 w-full aspect-[2/3] sm:aspect-auto bg-zinc-900 shrink-0 relative">
                  <img
                    src={movie?.posterUrl}
                    alt={movie?.title || 'Movie'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    CONFIRMED
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-lg text-white line-clamp-1">
                          {movie?.title}
                        </h3>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          {theatre?.name} • Screen {booking.show?.screenNumber || 1}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-zinc-500 block">
                          ID: {booking.bookingId}
                        </span>
                        <span className="text-base font-black text-red-400">
                          ₹{booking.totalAmount}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="flex items-center gap-1 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800 text-zinc-300">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        {booking.show?.showDate}
                      </span>
                      <span className="flex items-center gap-1 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800 text-red-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.show?.showTime}
                      </span>
                    </div>

                    <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/80 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Reserved Seats:</span>
                        <span className="font-bold text-white tracking-wide">
                          {booking.seats?.join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-zinc-500">
                        <span>Payment:</span>
                        <span className="text-zinc-400 font-mono">
                          {booking.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Txn: {booking.paymentId?.slice(0, 18)}...
                    </span>
                    <button
                      onClick={() => handleDownloadTicket(booking)}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-red-600/20 hover:scale-105"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
