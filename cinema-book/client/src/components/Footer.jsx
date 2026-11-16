import React from 'react';
import { Film, Heart, Github, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-zinc-800/80 bg-[#070709] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Cinema<span className="text-red-600">Book</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Full-Stack Cinema Hall Ticket Booking MVP. Built with the MERN stack featuring real-time seat reservation, atomic concurrency controls, JWT role-based security, and dark cinema styling.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                React + Vite
              </span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                Tailwind CSS
              </span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                Node.js + Express
              </span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                MongoDB + Mongoose
              </span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-red-950/40 border border-red-800/40 text-red-400">
                JWT Auth
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-red-400 transition-colors">
                  Home Premiere
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-red-400 transition-colors">
                  Browse Movies
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-red-400 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-red-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Credentials / Reviewer quick reference */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-red-500" />
              Demo Logins
            </h4>
            <div className="space-y-2 text-xs bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
              <div>
                <span className="text-red-400 font-semibold">Admin:</span> admin@cinemabook.com
                <div className="text-zinc-500">Pass: admin123</div>
              </div>
              <div className="pt-2 border-t border-zinc-800/60">
                <span className="text-zinc-300 font-semibold">User:</span> user@cinemabook.com
                <div className="text-zinc-500">Pass: user123</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 CinemaBook. All rights reserved. Full-Stack Developer Internship Demonstration.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for cinema lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
