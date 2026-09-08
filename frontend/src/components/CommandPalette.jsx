import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Film, Clock, Users, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />
          
          {/* Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-xl z-[101]"
          >
            <Command 
              className="bg-[#0f0a18]/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden"
              label="Global Command Menu"
            >
              <div className="flex items-center px-4 border-b border-white/10" cmdk-input-wrapper="">
                <Search className="w-5 h-5 text-gray-400" />
                <Command.Input 
                  autoFocus 
                  placeholder="Search movies or jump to..." 
                  className="w-full bg-transparent border-0 text-white placeholder-gray-500 px-3 py-4 focus:outline-none focus:ring-0 text-lg" 
                />
                <div className="text-xs font-mono px-2 py-1 bg-white/10 rounded text-gray-400 border border-white/10">ESC</div>
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
                <Command.Empty className="py-6 text-center text-sm text-gray-400">No results found.</Command.Empty>

                <Command.Group heading={<span className="text-xs font-semibold tracking-wider text-gray-500 uppercase px-2 py-2 block">Quick Navigation</span>}>
                  <Command.Item 
                    onSelect={() => runCommand(() => navigate('/admin/dashboard'))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-purple-600/20 aria-selected:text-purple-300 aria-selected:border aria-selected:border-purple-500/30 text-gray-300 border border-transparent transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard Overview</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => navigate('/admin/movies'))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-purple-600/20 aria-selected:text-purple-300 aria-selected:border aria-selected:border-purple-500/30 text-gray-300 border border-transparent transition-all"
                  >
                    <Film className="w-4 h-4" />
                    <span>Manage Movies</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => navigate('/admin/showtimes'))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-purple-600/20 aria-selected:text-purple-300 aria-selected:border aria-selected:border-purple-500/30 text-gray-300 border border-transparent transition-all"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Schedule Showtimes</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => navigate('/admin/bookings'))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-purple-600/20 aria-selected:text-purple-300 aria-selected:border aria-selected:border-purple-500/30 text-gray-300 border border-transparent transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Booking History</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => navigate('/admin/users'))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-purple-600/20 aria-selected:text-purple-300 aria-selected:border aria-selected:border-purple-500/30 text-gray-300 border border-transparent transition-all"
                  >
                    <Users className="w-4 h-4" />
                    <span>User Management</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
