import React, { useState, useEffect, useContext } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Film, Clock, Users, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext'; 

const CommandPalette = () => { 
  const [open, setOpen] = useState(false); 
  const navigate = useNavigate(); 
  const { user } = useContext(AuthContext); 
  
  // Toggle the menu when ⌘K or Ctrl+K is pressed 
  useEffect(() => { 
    const down = (e) => { 
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { 
        e.preventDefault(); 
        setOpen((open) => !open); 
      } 
    }; 
    document.addEventListener('keydown', down); 
    return () => document.removeEventListener('keydown', down); 
  }, []); 
  
  const runCommand = (command) => { 
    setOpen(false); 
    command(); 
  }; 
  
  return ( 
    <AnimatePresence> 
      {open && ( 
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"> 
          {/* Backdrop */} 
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-[#1A1A1A]/90 " /> 
          {/* Palette Modal */} 
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.2, ease: "easeOut" }} className="relative w-full max-w-xl z-[101]" > 
            <Command className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl shadow-lg overflow-hidden" label="Global Command Menu" > 
              <div className="flex items-center px-4 border-b border-neutral-800" cmdk-input-wrapper=""> 
                <Search className="w-5 h-5 text-neutral-400" /> 
                <Command.Input autoFocus placeholder="Search movies or jump to..." className="w-full bg-transparent border-0 text-neutral-100 placeholder-gray-500 px-3 py-4 focus:outline-none focus:ring-0 text-lg" /> 
                <div className="text-xs font-mono px-2 py-1 bg-white/10 rounded text-neutral-400 border border-neutral-800">ESC</div> 
              </div> 
              <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent"> 
                <Command.Empty className="py-6 text-center text-sm text-neutral-400">No results found.</Command.Empty> 
                {user && user.role === 'Admin' && ( 
                  <Command.Group heading={<span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase px-2 py-2 block">Quick Navigation</span>}> 
                    <Command.Item onSelect={() => runCommand(() => navigate('/k-subedi-08/dashboard'))} className="btn-premium flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[#1A1A1A] aria-selected:/20 aria-selected:text-neutral-400 hover:text-neutral-100 aria-selected:border aria-selected:border-neutral-800 text-neutral-300 border border-transparent" > 
                      <LayoutDashboard className="w-4 h-4" /> 
                      <span>Dashboard Overview</span> 
                    </Command.Item> 
                    <Command.Item onSelect={() => runCommand(() => navigate('/k-subedi-08/movies'))} className="btn-premium flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[#1A1A1A] aria-selected:/20 aria-selected:text-neutral-400 hover:text-neutral-100 aria-selected:border aria-selected:border-neutral-800 text-neutral-300 border border-transparent" > 
                      <Film className="w-4 h-4" /> 
                      <span>Manage Movies</span> 
                    </Command.Item> 
                    <Command.Item onSelect={() => runCommand(() => navigate('/k-subedi-08/showtimes'))} className="btn-premium flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[#1A1A1A] aria-selected:/20 aria-selected:text-neutral-400 hover:text-neutral-100 aria-selected:border aria-selected:border-neutral-800 text-neutral-300 border border-transparent" > 
                      <Clock className="w-4 h-4" /> 
                      <span>Schedule Showtimes</span> 
                    </Command.Item> 
                    <Command.Item onSelect={() => runCommand(() => navigate('/k-subedi-08/bookings'))} className="btn-premium flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[#1A1A1A] aria-selected:/20 aria-selected:text-neutral-400 hover:text-neutral-100 aria-selected:border aria-selected:border-neutral-800 text-neutral-300 border border-transparent" > 
                      <CreditCard className="w-4 h-4" /> 
                      <span>Booking History</span> 
                    </Command.Item> 
                    <Command.Item onSelect={() => runCommand(() => navigate('/k-subedi-08/users'))} className="btn-premium flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[#1A1A1A] aria-selected:/20 aria-selected:text-neutral-400 hover:text-neutral-100 aria-selected:border aria-selected:border-neutral-800 text-neutral-300 border border-transparent" > 
                      <Users className="w-4 h-4" /> 
                      <span>User Management</span> 
                    </Command.Item> 
                  </Command.Group> 
                )} 
              </Command.List> 
            </Command> 
          </motion.div> 
        </div> 
      )} 
    </AnimatePresence> 
  ); 
}; 

export default CommandPalette;
