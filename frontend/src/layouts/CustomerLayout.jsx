import React, { useState, useRef, useEffect, useContext } from 'react';
import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield } from 'lucide-react';
import logo from '../assets/logo.png';
import ThemeToggle from '../components/ThemeToggle';

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

  // Redirect removed: Admins/Managers can now browse the public site normally.
  // We provide a VIP "Command Center" link in their profile dropdown instead.
  if (!user) {
      return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-white flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      <div className="bg-noise opacity-50 dark:opacity-100"></div>
      <header className="bg-zinc-900  border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity z-50">
              <div className="flex items-center gap-3">
                <img src={logo} alt="HamroCinema Logo" className="h-10 w-auto invert" />
                <span className="text-xl font-bold tracking-widest text-zinc-100 uppercase">HamroCinema</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-bold text-gray-300 hover:text-rose-500 uppercase tracking-widest transition-colors">Now Showing</Link>
              <a href="#coming-soon" className="text-sm font-bold text-gray-500 hover:text-gray-300 uppercase tracking-widest transition-colors cursor-not-allowed">Coming Soon</a>
              <a href="#experiences" className="text-sm font-bold text-gray-500 hover:text-gray-300 uppercase tracking-widest transition-colors cursor-not-allowed">Experiences</a>
            </nav>

            {/* Desktop Auth / Profile */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 hover:border-rose-500 hover:shadow-xl transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm shadow-inner text-white">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-200">{user.username}</span>
                  <svg className={`w-4 h-4 text-rose-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-zinc-900  border border-zinc-800 rounded-2xl overflow-hidden shadow-lg animate-fade-in z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-3 border-b border-zinc-800 bg-purple-900/10">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.username}</p>
                    </div>
                    <div className="py-2">
                      {/* VIP Command Center Link */}
                      {(user.role === 'Admin' || user.role === 'Manager') && (
                        <Link to="/cinema-hq-99x/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold bg-zinc-800 hover:bg-zinc-700  text-rose-500 transition-colors border-l-2 border-rose-500">
                          <Shield className="w-4 h-4" />
                          Command Center
                        </Link>
                      )}
                      <Link to="/booking-history" onClick={() => setIsProfileOpen(false)} className="btn-premium flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover: hover:/20">
                        <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                        Booking History
                      </Link>
                    </div>
                    <div className="py-2 border-t border-zinc-800">
                      <button onClick={() => { setIsProfileOpen(false); logoutUser(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-500 hover:text-rose-500 hover:bg-pink-500/10 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center gap-3 z-50">
              <ThemeToggle />
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
          <div className="md:hidden absolute top-20 left-0 w-full bg-zinc-950 border-b border-zinc-800 animate-fade-in shadow-2xl">
            <div className="px-4 py-6 flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-gray-300 hover:text-rose-500 uppercase tracking-widest">Now Showing</Link>
              <a href="#coming-soon" className="text-base font-bold text-gray-500 uppercase tracking-widest cursor-not-allowed">Coming Soon</a>
              
              <div className="border-t border-zinc-800 my-2"></div>
              
              <div className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg shadow-inner text-white">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Signed in as</p>
                  <p className="text-base font-bold text-white">{user.username}</p>
                </div>
              </div>
              
              {/* Mobile VIP Command Center Link */}
              {(user.role === 'Admin' || user.role === 'Manager') && (
                <Link to="/cinema-hq-99x/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-base font-bold text-rose-500 hover:text-rose-500 py-2">
                  <Shield className="w-5 h-5" /> Command Center
                </Link>
              )}
              
              <Link to="/booking-history" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-300 hover:text-white py-2">Booking History</Link>
              <button onClick={() => { setIsMobileMenuOpen(false); logoutUser(); }} className="text-left text-base font-medium text-rose-500 hover:text-rose-500 py-2">Log Out</button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-transparent relative z-10">
        <Outlet />
      </main>

      {/* Modern Attractive Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="HamroCinema Logo" className="h-10 w-auto invert" />
                <span className="text-xl font-bold tracking-widest text-zinc-100 uppercase">HamroCinema</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-8">
                Your premium destination for the ultimate cinematic experience. Book tickets, choose your favorite seats, and enjoy the show in stunning quality.
              </p>
              
              {/* Creator Credit with emphasis */}
              <div className="inline-flex flex-col">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Designed & Developed By</p>
                  <p className="text-lg font-bold text-zinc-300 hover:text-rose-500 transition-colors">
                    Kamal Subedi
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Quick Links</h3>
              <ul className="flex flex-col gap-4 text-sm text-zinc-400">
                <li><Link to="/" className="hover:text-rose-500 transition-colors">Now Showing</Link></li>
                <li><a href="#coming-soon" className="hover:text-rose-500 transition-colors">Coming Soon</a></li>
                <li><a href="#experiences" className="hover:text-rose-500 transition-colors">Experiences</a></li>
                <li><Link to="/login" className="hover:text-rose-500 transition-colors">My Account</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Legal</h3>
              <ul className="flex flex-col gap-4 text-sm text-zinc-400">
                <li><Link to="/terms" className="hover:text-rose-500 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-rose-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/refund-policy" className="hover:text-rose-500 transition-colors">Refund Policy</Link></li>
                <li><Link to="/contact" className="hover:text-rose-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} HamroCinema. All rights reserved.</p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="https://www.instagram.com/k_subedi08/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-pink-600/20 hover:border-zinc-800 cursor-pointer transition-all border border-zinc-800 group">
                <svg className="w-4 h-4 text-zinc-400 group-hover:text-rose-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/9779820523224" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-green-600/20 hover:border-green-500/50 cursor-pointer transition-all border border-zinc-800 group">
                <svg className="w-4 h-4 text-zinc-400 group-hover:text-green-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
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
