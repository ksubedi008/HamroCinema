import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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

  return (
    <div className="min-h-screen bg-[#07040a] text-white flex flex-col md:flex-row font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="bg-noise"></div>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-ambient-glow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px] animate-ambient-glow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0d0914]/70 backdrop-blur-2xl border-b border-purple-900/30 p-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
          <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">HamroCinema</h1>
        </Link>
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

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0d0914]/60 backdrop-blur-2xl border-r border-purple-900/30 flex flex-col transition-transform duration-300 ease-in-out shadow-[10px_0_30px_rgba(0,0,0,0.5)]`}>
        <div className="p-6 flex items-center justify-between border-b border-purple-900/30 md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600"></div>
            <h1 className="text-xl font-bold tracking-wider text-purple-400 hidden md:block">HamroCinema</h1>
          </div>
          <button className="md:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
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
        
        <div className="p-4 border-t border-purple-900/30 relative mt-auto">
          {isProfileOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#2a1d3a] border border-purple-900/50 rounded-xl overflow-hidden shadow-xl animate-fade-in z-50">
              <button onClick={() => navigate('/forgot-password')} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                Change Password
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
            <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
