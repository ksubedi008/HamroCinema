import React, { useContext, useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CustomerLayout = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Redirect Admins/Managers to the Admin Dashboard if they hit the customer UI
  if (user && (user.role === 'Admin' || user.role === 'Manager')) {
      return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0d0914] text-white flex flex-col font-sans">
      <header className="bg-[#1a1225]/80 backdrop-blur-md border-b border-purple-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]"></div>
              <h1 className="text-2xl font-black tracking-wider text-white">
                HAMRO<span className="text-purple-500">CINEMA</span>
              </h1>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-bold text-gray-300 hover:text-purple-400 uppercase tracking-widest transition-colors">Now Showing</Link>
              <a href="#coming-soon" className="text-sm font-bold text-gray-500 hover:text-gray-300 uppercase tracking-widest transition-colors cursor-not-allowed">Coming Soon</a>
              <a href="#experiences" className="text-sm font-bold text-gray-500 hover:text-gray-300 uppercase tracking-widest transition-colors cursor-not-allowed">Experiences</a>
            </nav>

            {/* Auth / Profile Area */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-[#1a1225] border border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm shadow-inner text-white">
                      {user.username[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-gray-200">{user.username}</span>
                    <svg className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-4 w-56 bg-[#150f1d]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-fade-in z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-purple-900/40 bg-purple-900/10">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user.username}</p>
                      </div>
                      
                      <div className="py-2">
                        {user.role === 'Admin' && (
                          <Link to="/admin/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-600/20 transition-colors">
                            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Admin Dashboard
                          </Link>
                        )}
                        <Link to="/my-tickets" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-600/20 transition-colors">
                          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                          My Tickets
                        </Link>
                      </div>

                      <div className="py-2 border-t border-purple-900/40">
                        <button onClick={() => { setIsProfileOpen(false); logoutUser(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-pink-500 hover:text-pink-400 hover:bg-pink-500/10 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-white hover:text-purple-400 transition-colors">Log In</Link>
                  <Link to="/register" className="px-6 py-2.5 text-sm font-bold text-white bg-purple-600 rounded-full hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-[#0d0914]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 bg-[#0a0710] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-6 opacity-50">
            <div className="w-6 h-6 rounded-full bg-purple-600"></div>
            <h2 className="text-xl font-black tracking-wider text-white">HAMROCINEMA</h2>
          </div>
          <p className="text-gray-500 text-sm">© 2026 HamroCinema. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
