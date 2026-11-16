import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const isNowShowing = movie.status === 'now_showing';

  return (
    <div className="group relative bg-[#121217] rounded-xl overflow-hidden border border-zinc-800/80 hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-600/10 flex flex-col h-full">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // fallback placeholder if image link fails
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow-md">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-amber-300">{movie.rating.toFixed(1)}</span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isNowShowing ? (
            <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-red-600 text-white rounded-md shadow">
              Showing
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md">
              Upcoming
            </span>
          )}
        </div>

        {/* Language and duration bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
          <span className="px-2 py-0.5 bg-zinc-900/90 rounded border border-zinc-700/60 font-medium">
            {movie.language}
          </span>
          <span className="flex items-center gap-1 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-700/60 font-medium">
            <Clock className="w-3 h-3 text-red-400" />
            {movie.duration}m
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-red-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genre?.slice(0, 3).map((g, idx) => (
              <span
                key={idx}
                className="text-[11px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/movies/${movie._id}`}
          className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            isNowShowing
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 hover:shadow-red-600/40'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
          }`}
        >
          <Ticket className="w-4 h-4" />
          {isNowShowing ? 'Book Tickets' : 'View Details'}
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
