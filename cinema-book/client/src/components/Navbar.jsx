import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Ticket, LayoutDashboard, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:shadow-red-600/50">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-zinc-200 to-red-500 bg-clip-text text-transparent">
                Cinema<span className="text-red-600">Book</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-zinc-500 -mt-1 font-semibold">
                Tickets & Premiere
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-white bg-zinc-800/80'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/movies')
                  ? 'text-white bg-zinc-800/80'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              Movies
            </Link>

            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/my-bookings')
                    ? 'text-white bg-zinc-800/80'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
              >
                <Ticket className="w-4 h-4 text-red-500" />
                My Bookings
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'text-red-400 bg-red-950/40 border border-red-800/50'
                    : 'text-zinc-300 hover:text-red-400 hover:bg-zinc-800/40'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-red-500" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right Action / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 py-1 pr-1 bg-zinc-900 border border-zinc-800 rounded-full">
                  <span className="text-xs font-medium text-zinc-300 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  {isAdmin ? (
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-red-600/30 text-red-400 border border-red-500/30 rounded-full">
                      Admin
                    </span>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md shadow-red-600/20 transition-all hover:shadow-red-600/40"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#0e0e12] px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            Home
          </Link>
          <Link
            to="/movies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            Movies
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              My Bookings
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-red-950/30"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-zinc-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-sm text-zinc-400">
                  Signed in as <span className="text-white font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-zinc-800 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 border border-zinc-700 rounded-lg text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 bg-red-600 rounded-lg text-sm font-semibold text-white hover:bg-red-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
