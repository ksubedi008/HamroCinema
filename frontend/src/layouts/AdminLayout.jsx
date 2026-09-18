import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CommandPalette from '../components/CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png'; 

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
      <div className="p-6 flex items-center justify-between border-b border-neutral-800 md:justify-start"> 
        <div className="flex items-center gap-3"> 
          <img src={logo} alt="HamroCinema Logo" className="h-10 w-auto invert" /> 
          <span className="text-xl font-bold tracking-widest text-zinc-100 uppercase">HamroCinema</span> 
        </div> 
        <button className="md:hidden text-neutral-400 hover:text-neutral-100 transition-colors duration-200 ease-in-out" onClick={() => setIsSidebarOpen(false)}> 
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg> 
        </button> 
      </div> 
      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto"> 
        <NavLink to="/k-subedi-08/dashboard" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-stone-800 text-amber-500 border border-amber-700/50 font-medium transition-all duration-200 ease-in-out shadow-sm" : "px-4 py-3 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-[#1A1A1A] transition-all duration-200 ease-in-out font-medium border border-transparent"}> Dashboard </NavLink> 
        <NavLink to="/k-subedi-08/movies" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-stone-800 text-amber-500 border border-amber-700/50 font-medium transition-all duration-200 ease-in-out shadow-sm" : "px-4 py-3 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-[#1A1A1A] transition-all duration-200 ease-in-out font-medium border border-transparent"}> Movies </NavLink> 
        <NavLink to="/k-subedi-08/showtimes" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-stone-800 text-amber-500 border border-amber-700/50 font-medium transition-all duration-200 ease-in-out shadow-sm" : "px-4 py-3 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-[#1A1A1A] transition-all duration-200 ease-in-out font-medium border border-transparent"}> Showtimes </NavLink> 
        <NavLink to="/k-subedi-08/bookings" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-stone-800 text-amber-500 border border-amber-700/50 font-medium transition-all duration-200 ease-in-out shadow-sm" : "px-4 py-3 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-[#1A1A1A] transition-all duration-200 ease-in-out font-medium border border-transparent"}> Booking History </NavLink> 
        <NavLink to="/k-subedi-08/users" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-stone-800 text-amber-500 border border-amber-700/50 font-medium transition-all duration-200 ease-in-out shadow-sm" : "px-4 py-3 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-[#1A1A1A] transition-all duration-200 ease-in-out font-medium border border-transparent"}> Users </NavLink> 
        <NavLink to="/k-subedi-08/messages" className={({ isActive }) => isActive ? "px-4 py-3 rounded-xl bg-stone-800 text-amber-500 border border-amber-700/50 font-medium transition-all duration-200 ease-in-out shadow-sm" : "px-4 py-3 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-[#1A1A1A] transition-all duration-200 ease-in-out font-medium border border-transparent"}> Messages </NavLink> 
      </nav> 
      <div className="p-4 border-t border-neutral-800 relative mt-auto"> 
        {isProfileOpen && ( 
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#121212] border border-neutral-800 rounded-xl overflow-hidden shadow-xl animate-fade-in z-50"> 
            <button onClick={() => navigate('/forgot-password')} className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-neutral-100 hover:bg-[#1A1A1A] transition-colors duration-200 ease-in-out"> Change Password </button> 
            <button onClick={logoutUser} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors duration-200 ease-in-out border-t border-neutral-800"> Log Out </button> 
          </div> 
        )} 
        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1A1A1A] transition-colors duration-200 ease-in-out cursor-pointer text-left" > 
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex-shrink-0 flex items-center justify-center text-neutral-400 font-bold uppercase">{user?.username?.[0] || 'A'}</div> 
          <div className="flex-1 overflow-hidden"> 
            <p className="text-sm font-semibold truncate text-neutral-100">{user?.username || 'Admin User'}</p> 
            <p className="text-xs text-neutral-400 truncate">{user?.role || 'Administrator'}</p> 
          </div> 
          <svg className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200 ease-in-out ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> 
          </svg> 
        </button> 
      </div> 
    </> 
  ); 
  
  return ( 
    <div className="min-h-screen bg-[#121212] text-neutral-100 flex flex-col md:flex-row font-sans relative overflow-hidden"> 
      <CommandPalette /> 
      {/* Background Effects */} 
      <div className="bg-noise"></div> 
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden"> 
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-ambient-glow"></div> 
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px] animate-ambient-glow" style={{ animationDelay: '2s' }}></div> 
      </div> 
      {/* Mobile Top Bar */} 
      <div className="md:hidden bg-[#1A1A1A] border-b border-neutral-800 p-4 flex items-center justify-between sticky top-0 z-40"> 
        <Link to="/k-subedi-08/dashboard" className="flex items-center gap-3"> 
          <div className="flex items-center gap-3"> 
            <img src={logo} alt="HamroCinema Logo" className="h-10 w-auto invert" /> 
            <span className="text-xl font-bold tracking-widest text-zinc-100 uppercase">HamroCinema</span> 
          </div> 
        </Link> 
        <div className="flex items-center gap-2"> 
          <button onClick={() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true })); }} className="p-2 text-neutral-300 focus:outline-none hover:text-neutral-100 transition-colors duration-200 ease-in-out bg-[#1A1A1A] rounded-lg border border-neutral-800"> 
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> 
          </button> 
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-neutral-300 focus:outline-none hover:text-neutral-100 transition-colors duration-200 ease-in-out"> 
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-[#1A1A1A]/90 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} /> 
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-neutral-800 flex flex-col shadow-2xl md:hidden" > 
              {sidebarContent} 
            </motion.aside> 
          </> 
        )} 
      </AnimatePresence> 
      {/* Desktop Sidebar */} 
      <aside className="hidden md:flex static inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-neutral-800 flex-col shadow-2xl"> 
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
