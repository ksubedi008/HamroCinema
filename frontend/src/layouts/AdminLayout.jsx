import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CommandPalette from '../components/CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const sidebarContent = (
    <>
      <div className="p-6 flex items-center justify-between border-b border-zinc-800 md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 shadow-lg"></div>
          <h1 className="text-xl font-bold tracking-wider text-zinc-100">HamroCinema</h1>
        </div>
        <button className="md:hidden text-gray-400 hover:text-white transition-colors" onClick={() => setIsSidebarOpen(false)}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      
      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        <NavLink to="/cinema-hq-99x/dashboard" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-purple-600/20 text-rose-500 border border-zinc-800 font-medium transition-all" : "px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-800 transition-all font-medium"}>
          Dashboard
        </NavLink>
        <NavLink to="/cinema-hq-99x/movies" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-purple-600/20 text-rose-500 border border-zinc-800 font-medium transition-all" : "px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-800 transition-all font-medium"}>
          Movies
        </NavLink>
        <NavLink to="/cinema-hq-99x/showtimes" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-purple-600/20 text-rose-500 border border-zinc-800 font-medium transition-all" : "px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-800 transition-all font-medium"}>
          Showtimes
        </NavLink>
        <NavLink to="/cinema-hq-99x/bookings" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-purple-600/20 text-rose-500 border border-zinc-800 font-medium transition-all" : "px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-800 transition-all font-medium"}>
          Booking History
        </NavLink>
        <NavLink to="/cinema-hq-99x/users" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-purple-600/20 text-rose-500 border border-zinc-800 font-medium transition-all" : "px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-800 transition-all font-medium"}>
          Users
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-zinc-800 relative mt-auto">
        {isProfileOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl animate-fade-in z-50">
            <button onClick={() => navigate('/forgot-password')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors">
              Change Password
            </button>
            <button onClick={logoutUser} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors border-t border-zinc-800">
              Log Out
            </button>
          </div>
        )}
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex-shrink-0 flex items-center justify-center text-gray-400 font-bold uppercase">{user?.username?.[0] || 'A'}</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate text-white">{user?.username || 'Admin User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role || 'Administrator'}</p>
          </div>
          <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row font-sans relative overflow-hidden">
      <CommandPalette />

      {/* Background Effects */}
      <div className="bg-noise"></div>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-ambient-glow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px] animate-ambient-glow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-zinc-900  border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/cinema-hq-99x/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 shadow-lg"></div>
          <h1 className="text-xl font-bold tracking-wider text-zinc-100">HamroCinema</h1>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
          }} className="p-2 text-gray-300 focus:outline-none hover:text-white transition-colors bg-zinc-800 rounded-lg border border-zinc-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-300 focus:outline-none hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar Overlay & Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-zinc-900/90  z-40 md:hidden" 
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900  border-r border-zinc-800 flex flex-col shadow-2xl md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex static inset-y-0 left-0 z-50 w-64 bg-zinc-900  border-r border-zinc-800 flex-col shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full overflow-x-hidden relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
