import React, { useState, useRef, useEffect, useContext } from 'react';
import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CustomerLayout = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-[#07040a] text-white flex flex-col font-sans relative overflow-hidden">
      <div className="bg-noise"></div>
      <header className="bg-[#1a1225]/60 backdrop-blur-xl border-b border-purple-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity z-50">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]"></div>
              <h1 className="text-xl md:text-2xl font-black tracking-wider text-white">
                HAMRO<span className="text-purple-500">CINEMA</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-bold text-gray-300 hover:text-purple-400 uppercase tracking-widest transition-colors">Now Showing</Link>
              <a href="#coming-soon" className="text-sm font-bold text-gray-500 hover:text-gray-300 uppercase tracking-widest transition-colors cursor-not-allowed">Coming Soon</a>
              <a href="#experiences" className="text-sm font-bold text-gray-500 hover:text-gray-300 uppercase tracking-widest transition-colors cursor-not-allowed">Experiences</a>
            </nav>

            {/* Desktop Auth / Profile */}
            <div className="hidden md:flex items-center gap-4">
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

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center z-50">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white p-2 focus:outline-none">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#150f1d] border-b border-purple-900/30 animate-fade-in shadow-2xl">
            <div className="px-4 py-6 flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-gray-300 hover:text-purple-400 uppercase tracking-widest">Now Showing</Link>
              <a href="#coming-soon" className="text-base font-bold text-gray-500 uppercase tracking-widest cursor-not-allowed">Coming Soon</a>
              
              <div className="border-t border-purple-900/30 my-2"></div>
              
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg shadow-inner text-white">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-base font-bold text-white">{user.username}</p>
                    </div>
                  </div>
                  {user.role === 'Admin' && (
                    <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-300 hover:text-white py-2">Admin Dashboard</Link>
                  )}
                  <Link to="/my-tickets" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-300 hover:text-white py-2">My Tickets</Link>
                  <button onClick={() => { setIsMobileMenuOpen(false); logoutUser(); }} className="text-left text-base font-medium text-pink-500 hover:text-pink-400 py-2">Log Out</button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-5 py-3 text-sm font-bold text-white border border-purple-600 rounded-full hover:bg-purple-600/20 transition-colors">Log In</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-6 py-3 text-sm font-bold text-white bg-purple-600 rounded-full hover:bg-purple-500 transition-colors">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-transparent relative z-10">
        <Outlet />
      </main>

      {/* Modern Attractive Footer */}
      <footer className="border-t border-purple-900/30 bg-[#0a0710] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]"></div>
                <h2 className="text-2xl font-black tracking-wider text-white">
                  HAMRO<span className="text-purple-500">CINEMA</span>
                </h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
                Your premium destination for the ultimate cinematic experience. Book tickets, choose your favorite seats, and enjoy the show in stunning quality.
              </p>
              
              {/* Creator Credit with emphasis */}
              <div className="inline-flex flex-col">
                <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-900/40 to-[#1a1225] border border-purple-500/20 backdrop-blur-md">
                  <p className="text-xs text-purple-300/70 font-semibold tracking-wider uppercase mb-1">Designed & Developed By</p>
                  <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                    Kamal Subedi
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Quick Links</h3>
              <ul className="flex flex-col gap-4 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-purple-400 transition-colors">Now Showing</Link></li>
                <li><a href="#coming-soon" className="hover:text-purple-400 transition-colors">Coming Soon</a></li>
                <li><a href="#experiences" className="hover:text-purple-400 transition-colors">Experiences</a></li>
                <li><Link to="/login" className="hover:text-purple-400 transition-colors">My Account</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Legal</h3>
              <ul className="flex flex-col gap-4 text-sm text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Refund Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-purple-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} HamroCinema. All rights reserved.</p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="https://www.instagram.com/k_subedi08/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-600/20 hover:border-pink-500/50 cursor-pointer transition-all border border-white/5 group">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/9779820523224" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-600/20 hover:border-green-500/50 cursor-pointer transition-all border border-white/5 group">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.12.553 4.183 1.603 6L.518 24l6.113-1.603c1.764.957 3.753 1.464 5.795 1.464 6.648 0 12.031-5.383 12.031-12.031S18.679 0 12.031 0zm3.834 17.15c-.173.486-.997.935-1.441.98-.387.04-1.01-.061-2.433-.65-1.714-.71-2.825-2.457-2.91-2.571-.086-.114-.693-.923-.693-1.761 0-.838.435-1.25.59-1.423.155-.173.34-.216.454-.216.114 0 .228 0 .327.006.103.006.244-.04.372.272.131.318.448 1.096.49 1.18.043.085.071.185.014.3-.057.114-.085.185-.171.284-.085.099-.18.213-.255.284-.085.085-.174.181-.077.351.097.17 4.34 2.41 1.08.536 2.02.646.128.085.253.013.385-.29.444-.399.527-.428.085-.028.168-.028.243-.028.075 0 .197.028.298.142.101.114.385.376.385.918 0 .542-.394 1.04-.448 1.127z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
