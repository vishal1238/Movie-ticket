import React, { useState, useEffect } from 'react';
import { Search, Filter, Film, Sparkles } from 'lucide-react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import toast from 'react-hot-toast';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Biography', 'Thriller', 'Comedy'];

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(''); // '' (all), 'now_showing', 'upcoming'
  const [genreFilter, setGenreFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [statusFilter, genreFilter]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      let queryParams = [];
      if (statusFilter) queryParams.push(`status=${statusFilter}`);
      if (genreFilter !== 'All') queryParams.push(`genre=${genreFilter}`);
      if (search.trim()) queryParams.push(`search=${encodeURIComponent(search.trim())}`);

      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
      const res = await api.get(`/movies${queryString}`);
      setMovies(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to load movies: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Browse All Movies
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Explore top blockbusters, upcoming premieres, and indie masterworks in ultra clarity.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Search title or plot..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Status Filter */}
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setStatusFilter('')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === '' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('now_showing')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'now_showing' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Now Showing
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'upcoming' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Upcoming
            </button>
          </div>

          {/* Genre Dropdown for responsive layout */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g === 'All' ? 'All Genres' : g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : movies.length === 0 ? (
        <div className="min-h-[350px] flex flex-col items-center justify-center p-8 bg-[#121217] border border-zinc-800 rounded-2xl text-center space-y-3">
          <Film className="w-12 h-12 text-zinc-600" />
          <h3 className="text-lg font-bold text-zinc-300">No movies found</h3>
          <p className="text-sm text-zinc-500">Try modifying your search or clearing your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
