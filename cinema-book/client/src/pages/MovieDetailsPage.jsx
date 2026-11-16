import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, Ticket, Film, ChevronRight, User } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Format Date helper: YYYY-MM-DD
const formatDateStr = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingShows, setLoadingShows] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);

  // Generate 5 consecutive dates starting from today
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        dateStr: formatDateStr(d),
        dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateDisplay: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      });
    }
    setAvailableDates(dates);
    setSelectedDate(dates[0].dateStr);
  }, []);

  // Fetch Movie Info
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoadingMovie(true);
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data?.data || null);
      } catch (error) {
        toast.error('Failed to load movie details: ' + error.message);
      } finally {
        setLoadingMovie(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Fetch Shows when selectedDate or movie changes
  useEffect(() => {
    if (!movie || movie.status !== 'now_showing' || !selectedDate) return;

    const fetchShows = async () => {
      try {
        setLoadingShows(true);
        const res = await api.get(`/shows/movie/${id}?date=${selectedDate}`);
        setShows(res.data?.data || []);
      } catch (error) {
        toast.error('Failed to load shows: ' + error.message);
      } finally {
        setLoadingShows(false);
      }
    };

    fetchShows();
  }, [id, selectedDate, movie]);

  if (loadingMovie) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
        <Film className="w-16 h-16 text-zinc-600 mb-4" />
        <h2 className="text-xl font-bold text-white">Movie Not Found</h2>
        <Link to="/movies" className="mt-4 px-4 py-2 bg-red-600 rounded-lg text-sm font-semibold text-white">
          Back to Movies
        </Link>
      </div>
    );
  }

  // Group shows by Theatre
  const showsByTheatre = shows.reduce((acc, show) => {
    const theatreId = show.theatre?._id || 'unknown';
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre: show.theatre,
        shows: []
      };
    }
    acc[theatreId].shows.push(show);
    return acc;
  }, {});

  const isNowShowing = movie.status === 'now_showing';

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Backdrop Banner */}
      <div className="relative w-full h-[400px] md:h-[480px] bg-zinc-950">
        <img
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.35]"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />
      </div>

      {/* Main Details Card (Offsetting into banner) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Poster Column */}
          <div className="md:col-span-1">
            <div className="rounded-2xl overflow-hidden border-2 border-zinc-700 shadow-2xl aspect-[2/3] bg-zinc-900 sticky top-24">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
                }}
              />
            </div>
          </div>

          {/* Info Column */}
          <div className="md:col-span-3 space-y-6">
            <div className="space-y-3">
              {/* Status and Rating */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  isNowShowing ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {isNowShowing ? 'Now Showing' : 'Releasing Soon'}
                </span>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900/90 rounded-md border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{movie.rating?.toFixed(1)} / 10</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900/80 px-3 py-1 rounded-md border border-zinc-800">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span>{movie.duration} minutes</span>
                </div>

                <span className="text-xs bg-zinc-900/80 px-3 py-1 rounded-md border border-zinc-800 text-zinc-300">
                  {movie.language}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {movie.title}
              </h1>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 pt-1">
                {movie.genre?.map((g, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-full border border-zinc-700/60"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div className="bg-[#121217] border border-zinc-800 rounded-xl p-5 space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Synopsis
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Cast & Crew Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {movie.director && (
                <div className="bg-[#121217] border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-red-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 font-semibold block">Director</span>
                    <span className="text-sm font-bold text-white">{movie.director}</span>
                  </div>
                </div>
              )}

              {movie.releaseDate && (
                <div className="bg-[#121217] border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-red-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 font-semibold block">Release Date</span>
                    <span className="text-sm font-bold text-white">
                      {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {movie.cast && movie.cast.length > 0 && (
              <div className="bg-[#121217] border border-zinc-800 rounded-xl p-4 space-y-2">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">
                  Top Cast
                </span>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-lg"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Theatres & Showtimes Section (Only for Now Showing) */}
        {isNowShowing && (
          <div className="mt-16 space-y-8">
            <div className="border-t border-zinc-800 pt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-6 bg-red-600 rounded-full" />
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Select Date & Experience
                </h2>
              </div>

              {/* Date Selection Pills */}
              <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
                {availableDates.map((item) => (
                  <button
                    key={item.dateStr}
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`flex flex-col items-center justify-center min-w-[90px] py-3 px-4 rounded-xl border text-center transition-all ${
                      selectedDate === item.dateStr
                        ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30 scale-105'
                        : 'bg-[#121217] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase">{item.dayName}</span>
                    <span className="text-sm font-extrabold mt-0.5">{item.dateDisplay}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theatres List */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Theatres Showing {movie.title}
              </h3>

              {loadingShows ? (
                <div className="min-h-[200px] flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : Object.keys(showsByTheatre).length === 0 ? (
                <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400">
                  <p>No shows scheduled for the selected date. Please choose another date above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.values(showsByTheatre).map(({ theatre, shows }) => (
                    <div
                      key={theatre?._id || Math.random()}
                      className="bg-[#121217] border border-zinc-800/80 rounded-2xl p-6 transition-all hover:border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      {/* Theatre Info */}
                      <div className="space-y-1 md:max-w-xs">
                        <h4 className="font-bold text-white text-base">{theatre?.name}</h4>
                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          {theatre?.location}, {theatre?.city}
                        </p>
                        <span className="text-[11px] text-emerald-400 inline-block font-medium">
                          • 4K Laser & Dolby Atmos Ready
                        </span>
                      </div>

                      {/* Showtime Badges */}
                      <div className="flex flex-wrap items-center gap-3">
                        {shows.map((show) => (
                          <button
                            key={show._id}
                            onClick={() => navigate(`/booking/${show._id}`)}
                            className="group flex flex-col items-center justify-center py-2.5 px-4 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:border-red-500 hover:bg-red-950/30 transition-all hover:scale-105"
                          >
                            <span className="text-sm font-bold text-white group-hover:text-red-400">
                              {show.showTime}
                            </span>
                            <span className="text-[10px] text-zinc-400 mt-0.5">
                              From ₹{show.price?.regular || 200}
                            </span>
                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                              Screen {show.screenNumber || 1}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* If Upcoming */}
        {!isNowShowing && (
          <div className="mt-12 bg-[#121217] border border-zinc-800 rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">Tickets Opening Soon!</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Advance booking for {movie.title} will open closer to the release date. Stay tuned!
            </p>
            <Link
              to="/movies"
              className="inline-block px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Explore Now Showing Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
