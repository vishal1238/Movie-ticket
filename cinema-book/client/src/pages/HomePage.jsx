import React, { useState, useEffect } from 'react';
import { Search, Flame, Calendar, Sparkles, Film, Clapperboard } from 'lucide-react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import HeroBanner from '../components/HeroBanner';
import toast from 'react-hot-toast';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Biography', 'Thriller'];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('now_showing'); // 'now_showing' | 'upcoming'
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [activeTab, selectedGenre]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      let url = `/movies?status=${activeTab}`;
      if (selectedGenre !== 'All') {
        url += `&genre=${selectedGenre}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const res = await api.get(url);
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

  const featured = movies.filter(m => m.status === 'now_showing').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner Carousel with top Now Showing Movies */}
      <HeroBanner featuredMovies={featured.length > 0 ? featured : movies.slice(0, 3)} />

      {/* Filter and Search Bar Section */}
      <div className="bg-[#121217] border border-zinc-800 rounded-2xl p-5 mb-10 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('now_showing')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'now_showing'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              Now Showing
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Upcoming
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-80">
            <input
              type="text"
              placeholder="Search movies by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Genre Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-zinc-800/80 pb-1 scrollbar-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 shrink-0 mr-2">
            Genres:
          </span>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-red-600/20 text-red-400 border border-red-500/40 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-6 bg-red-600 rounded-full" />
            <h2 className="text-2xl font-black text-white tracking-tight">
              {activeTab === 'now_showing' ? 'Currently In Theatres' : 'Coming Soon to CinemaBook'}
            </h2>
            <span className="text-xs text-zinc-500 font-semibold ml-2">
              ({movies.length} {movies.length === 1 ? 'Movie' : 'Movies'})
            </span>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : movies.length === 0 ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-[#121217] border border-zinc-800 rounded-2xl text-center space-y-3">
            <Film className="w-12 h-12 text-zinc-600" />
            <h3 className="text-lg font-bold text-zinc-300">No movies found</h3>
            <p className="text-sm text-zinc-500 max-w-sm">
              We couldn't find any movies matching your current filter or search criteria.
            </p>
            <button
              onClick={() => {
                setSelectedGenre('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Premium Cinema Experience Highlights Banner */}
      <div className="mt-20 bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-950 border border-red-900/30 rounded-2xl p-8 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto md:mx-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">4K Laser Projection</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Experience unparalleled contrast, vivid colors, and ultra-crisp resolution across all screens.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto md:mx-0">
              <Clapperboard className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Dolby Atmos Surround</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Multidimensional 360-degree spatial sound that flows around you with breathless realism.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto md:mx-0">
              <Film className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">VIP Plush Recliners</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Motorized leather recliners with personal armrests, food service, and expansive legroom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
