import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Ticket,
  Film,
  Users,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalShows: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: []
  });
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' | 'bookings' | 'shows'
  const [loading, setLoading] = useState(true);

  // Movie Modal state
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 120,
    releaseDate: '2026-11-15',
    posterUrl: '',
    bannerUrl: '',
    rating: 8.5,
    status: 'now_showing',
    director: ''
  });

  // Show Modal state
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [showForm, setShowForm] = useState({
    movie: '',
    theatre: '',
    screenNumber: 1,
    showDate: '2026-11-15',
    showTime: '06:00 PM',
    regularPrice: 200,
    premiumPrice: 350
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, bookingsRes, theatresRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/movies'),
        api.get('/bookings'),
        api.get('/theatres')
      ]);

      setStats(statsRes.data?.data || {});
      setMovies(moviesRes.data?.data || []);
      setBookings(bookingsRes.data?.data || []);
      setTheatres(theatresRes.data?.data || []);

      if (moviesRes.data?.data?.length > 0 && theatresRes.data?.data?.length > 0) {
        setShowForm(prev => ({
          ...prev,
          movie: moviesRes.data.data[0]._id,
          theatre: theatresRes.data.data[0]._id
        }));
      }
    } catch (error) {
      toast.error('Failed to load admin data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Open Movie Modal for Add
  const handleOpenAddMovie = () => {
    setEditingMovieId(null);
    setMovieForm({
      title: '',
      description: '',
      genre: 'Action, Sci-Fi',
      language: 'English',
      duration: 130,
      releaseDate: '2026-11-15',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      rating: 8.5,
      status: 'now_showing',
      director: ''
    });
    setIsMovieModalOpen(true);
  };

  // Open Movie Modal for Edit
  const handleOpenEditMovie = (movie) => {
    setEditingMovieId(movie._id);
    setMovieForm({
      title: movie.title,
      description: movie.description,
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
      language: movie.language,
      duration: movie.duration,
      releaseDate: movie.releaseDate?.split('T')[0] || '2026-11-15',
      posterUrl: movie.posterUrl,
      bannerUrl: movie.bannerUrl,
      rating: movie.rating,
      status: movie.status,
      director: movie.director || ''
    });
    setIsMovieModalOpen(true);
  };

  // Save Movie (Create or Update)
  const handleSaveMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movieForm,
        genre: movieForm.genre.split(',').map((g) => g.trim()).filter(Boolean),
        duration: Number(movieForm.duration),
        rating: Number(movieForm.rating)
      };

      if (editingMovieId) {
        await api.put(`/movies/${editingMovieId}`, payload);
        toast.success('Movie updated successfully');
      } else {
        await api.post('/movies', payload);
        toast.success('Movie added successfully');
      }

      setIsMovieModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      toast.error('Error saving movie: ' + error.message);
    }
  };

  // Delete Movie
  const handleDeleteMovie = async (movieId, movieTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${movieTitle}"?`)) {
      return;
    }
    try {
      await api.delete(`/movies/${movieId}`);
      toast.success('Movie deleted');
      fetchDashboardData();
    } catch (error) {
      toast.error('Error deleting movie: ' + error.message);
    }
  };

  // Create Show
  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        movie: showForm.movie,
        theatre: showForm.theatre,
        screenNumber: Number(showForm.screenNumber),
        showDate: showForm.showDate,
        showTime: showForm.showTime,
        price: {
          regular: Number(showForm.regularPrice),
          premium: Number(showForm.premiumPrice)
        }
      };

      await api.post('/shows', payload);
      toast.success('Show scheduled successfully');
      setIsShowModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      toast.error('Error scheduling show: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-red-500">
            Cinema Operations
          </span>
          <h1 className="text-3xl font-black text-white">Admin Management Console</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddMovie}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Movie
          </button>
          <button
            onClick={() => setIsShowModalOpen(true)}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl border border-zinc-700 flex items-center gap-2 text-sm transition-all"
          >
            <Calendar className="w-4 h-4 text-red-400" />
            Schedule Show
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              ₹{stats.totalRevenue?.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500">From completed bookings</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Total Bookings
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {stats.totalBookings}
            </span>
            <span className="text-[10px] text-zinc-500">Reserved cinema tickets</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-800/40 text-red-400 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Movies Catalog
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {stats.totalMovies}
            </span>
            <span className="text-[10px] text-zinc-500">Active titles in system</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-400 flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Registered Users
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {stats.totalUsers}
            </span>
            <span className="text-[10px] text-zinc-500">Excluding admin accounts</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 gap-4">
        <button
          onClick={() => setActiveTab('movies')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'movies'
              ? 'border-red-600 text-red-500'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          Movie Management ({movies.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'bookings'
              ? 'border-red-600 text-red-500'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Customer Bookings ({bookings.length})
        </button>
      </div>

      {/* Tab 1: Movies Management */}
      {activeTab === 'movies' && (
        <div className="bg-[#121217] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="font-bold text-white text-base">Cinema Film Roster</h3>
            <span className="text-xs text-zinc-400">{movies.length} entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Movie</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Genres</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {movies.map((m) => (
                  <tr key={m._id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-10 h-14 object-cover rounded-md bg-zinc-800 shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                      <div>
                        <span className="font-bold text-white block">{m.title}</span>
                        <span className="text-xs text-zinc-500">{m.language}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {m.status === 'now_showing' ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                          Now Showing
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-950/40 text-amber-400 border border-amber-800/40">
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{m.duration} mins</td>
                    <td className="px-6 py-4 font-bold text-amber-400">{m.rating}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-zinc-400">
                        {Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditMovie(m)}
                        title="Edit Movie"
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(m._id, m.title)}
                        title="Delete Movie"
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-[#121217] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="font-bold text-white text-base">All Confirmed Customer Bookings</h3>
            <span className="text-xs text-zinc-400">{bookings.length} reservations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Movie & Theatre</th>
                  <th className="px-6 py-4">Seats</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-red-400">
                      {b.bookingId}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white block">{b.user?.name}</span>
                      <span className="text-xs text-zinc-500">{b.user?.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white block">
                        {b.show?.movie?.title || 'Movie'}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {b.show?.theatre?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-xs">
                        {b.seats?.join(', ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-400">
                      ₹{b.totalAmount}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {b.paymentId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Movie Modal */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121217] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800 mb-5">
              <h3 className="font-bold text-lg text-white">
                {editingMovieId ? 'Edit Movie' : 'Add New Movie to System'}
              </h3>
              <button
                onClick={() => setIsMovieModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Title</label>
                  <input
                    type="text"
                    required
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                    placeholder="Movie Title"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Language</label>
                  <input
                    type="text"
                    required
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                    placeholder="e.g. English, Hindi"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Description / Synopsis</label>
                <textarea
                  rows="3"
                  required
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                  placeholder="Plot summary..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Rating (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Status</label>
                  <select
                    value={movieForm.status}
                    onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Genres (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                    placeholder="Action, Sci-Fi, Thriller"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Director</label>
                  <input
                    type="text"
                    value={movieForm.director}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                    placeholder="Director Name"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Poster Image URL</label>
                <input
                  type="url"
                  required
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none font-mono"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Banner Backdrop Image URL</label>
                <input
                  type="url"
                  required
                  value={movieForm.bannerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none font-mono"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsMovieModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/30"
                >
                  {editingMovieId ? 'Update Movie' : 'Save Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Show Modal */}
      {isShowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121217] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800 mb-4">
              <h3 className="font-bold text-lg text-white">Schedule New Cinema Show</h3>
              <button
                onClick={() => setIsShowModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShow} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Select Movie</label>
                <select
                  value={showForm.movie}
                  onChange={(e) => setShowForm({ ...showForm, movie: e.target.value })}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Select Theatre</label>
                <select
                  value={showForm.theatre}
                  onChange={(e) => setShowForm({ ...showForm, theatre: e.target.value })}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                >
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Show Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={showForm.showDate}
                    onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Show Time</label>
                  <input
                    type="text"
                    required
                    value={showForm.showTime}
                    onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                    placeholder="e.g. 07:30 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Regular Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={showForm.regularPrice}
                    onChange={(e) => setShowForm({ ...showForm, regularPrice: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 font-semibold">Premium VIP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={showForm.premiumPrice}
                    onChange={(e) => setShowForm({ ...showForm, premiumPrice: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsShowModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/30"
                >
                  Create Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
