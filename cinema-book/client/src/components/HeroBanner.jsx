import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket, ChevronRight, ChevronLeft, Info } from 'lucide-react';

const HeroBanner = ({ featuredMovies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;

  const movie = featuredMovies[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <div className="relative w-full h-[480px] md:h-[560px] rounded-2xl overflow-hidden mb-12 border border-zinc-800 shadow-2xl">
      {/* Background Banner with Dark Vignette */}
      <div className="absolute inset-0">
        <img
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.45] transition-all duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent w-full md:w-3/4" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-12">
        <div className="max-w-2xl space-y-4">
          {/* Status & Rating */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg shadow-red-600/30">
              Featured Premiere
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/80 backdrop-blur-md rounded-md border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{movie.rating.toFixed(1)} / 10</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-300 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{movie.duration} mins</span>
            </div>
            <span className="text-zinc-400 text-xs border border-zinc-700 px-2 py-0.5 rounded">
              {movie.language}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {movie.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genre?.map((g, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-full border border-zinc-700/50"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-sm md:text-base text-zinc-300 line-clamp-3 leading-relaxed drop-shadow">
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              to={`/movies/${movie._id}`}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all hover:scale-105"
            >
              <Ticket className="w-5 h-5" />
              Book Tickets Now
            </Link>
            <Link
              to={`/movies/${movie._id}`}
              className="px-5 py-3 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-semibold rounded-xl border border-zinc-700/60 flex items-center gap-2 transition-colors"
            >
              <Info className="w-4 h-4 text-zinc-400" />
              View Info
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-red-600/80 text-white transition-all backdrop-blur-md border border-zinc-700/40"
            aria-label="Previous movie"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-red-600/80 text-white transition-all backdrop-blur-md border border-zinc-700/40"
            aria-label="Next movie"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 right-8 z-20 flex gap-1.5">
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-red-600' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroBanner;
