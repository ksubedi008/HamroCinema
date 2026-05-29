import React, { useState, useContext } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0d0914] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1225] border-r border-purple-900/30 flex flex-col">
        <Link to="/" className="p-6 flex items-center gap-3 border-b border-purple-900/30 hover:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600"></div>
          <h1 className="text-xl font-bold tracking-wider text-purple-400">HamroCinema</h1>
        </Link>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-medium transition-all" : "px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/movies" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-medium transition-all" : "px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"}>
            Movies
          </NavLink>
          <NavLink to="/admin/showtimes" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-medium transition-all" : "px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"}>
            Showtimes
          </NavLink>
          <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-medium transition-all" : "px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"}>
            Booking History
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-medium transition-all" : "px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"}>
            Users
          </NavLink>
        </nav>
        <div className="p-4 border-t border-purple-900/30 relative">
          {isProfileOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#2a1d3a] border border-purple-900/50 rounded-xl overflow-hidden shadow-xl animate-fade-in z-50">
              <button onClick={() => navigate('/forgot-password')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                Change / Forgot Password
              </button>
              <button onClick={logoutUser} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors border-t border-purple-900/30">
                Log Out
              </button>
            </div>
          )}
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex-shrink-0 flex items-center justify-center text-gray-400 font-bold uppercase">{user?.username?.[0] || 'A'}</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">{user?.username || 'Admin User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role || 'Administrator'}</p>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
