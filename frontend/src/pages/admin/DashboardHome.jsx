import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ movies: 0, activeShowtimes: 0, revenue: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movRes, showRes, bookRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/movies/`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/showtimes/`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/`)
        ]);
        
        const now = new Date();
        const active = showRes.data.filter(st => new Date(st.end_time) > now);
        
        const completedBookings = bookRes.data.filter(b => b.payment_status === 'Completed');
        const totalRev = completedBookings.reduce((sum, b) => sum + parseFloat(b.total_amount), 0);

        setStats({
          movies: movRes.data.length,
          activeShowtimes: active.length,
          revenue: totalRev
        });
        setMovies(movRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10 pb-10 font-sans">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
      >
        <div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2 tracking-tight">System Overview</h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase font-semibold">Cinematic Command Center</p>
        </div>
        <Link to="/admin/movies" className="relative group overflow-hidden px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300 transform hover:-translate-y-0.5">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add Movie
          </span>
        </Link>
      </motion.header>

      {/* Floating Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Movies Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.3)] hover:border-purple-500/30 flex items-center justify-between overflow-hidden relative"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 blur-2xl rounded-full group-hover:bg-purple-500/30 transition-all duration-500"></div>
          <div className="relative z-10">
            <p className="text-gray-400 text-xs tracking-widest font-bold uppercase mb-2">Total Movies</p>
            <h3 className="text-4xl font-black text-white">{stats.movies}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 flex items-center justify-center relative z-10">
            <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        </motion.div>

        {/* Active Showtimes Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.3)] hover:border-cyan-500/30 flex items-center justify-between overflow-hidden relative"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/20 blur-2xl rounded-full group-hover:bg-cyan-500/30 transition-all duration-500"></div>
          <div className="relative z-10">
            <p className="text-gray-400 text-xs tracking-widest font-bold uppercase mb-2">Active Showtimes</p>
            <h3 className="text-4xl font-black text-white">{stats.activeShowtimes}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center relative z-10">
            <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </motion.div>

        {/* Total Revenue Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(236,72,153,0.3)] hover:border-pink-500/30 flex items-center justify-between overflow-hidden relative"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-500/20 blur-2xl rounded-full group-hover:bg-pink-500/30 transition-all duration-500"></div>
          <div className="relative z-10">
            <p className="text-gray-400 text-xs tracking-widest font-bold uppercase mb-2">Total Revenue</p>
            <h3 className="text-3xl font-black text-white truncate max-w-[150px]">Rs. {stats.revenue.toLocaleString()}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/20 flex items-center justify-center relative z-10">
            <svg className="w-7 h-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Cinematic Movie Grid */}
      <div className="pt-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
          <h3 className="text-2xl font-bold text-white tracking-wider">Now Showing</h3>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.filter(movie => movie.status === 'Now Showing' && movie.is_active).map((movie, index) => (
              <motion.div 
                key={movie.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="group relative bg-[#0a0510] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-500 hover:-translate-y-1"
              >
                {/* Floating Genre Badge */}
                {movie.genre && (
                  <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-black text-white tracking-widest uppercase shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-purple-400/50 group-hover:text-purple-300 transition-colors">
                    {movie.genre}
                  </div>
                )}
                
                {/* Poster Container */}
                <div className="aspect-[2/3] w-full relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                  {movie.poster ? (
                    <>
                      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0510] via-transparent to-transparent opacity-90"></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/10 rounded-2xl m-2 bg-[#0d0914] group-hover:border-purple-500/30 group-hover:shadow-[inset_0_0_30px_rgba(168,85,247,0.1)] transition-all">
                      <svg className="w-10 h-10 text-gray-600 mb-3 group-hover:text-purple-400/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500 text-center leading-relaxed">Poster<br/>Missing</span>
                    </div>
                  )}
                </div>

                {/* Movie Details */}
                <div className="p-4 relative z-10 bg-[#0a0510]">
                  <h4 className="text-sm font-bold text-gray-100 truncate group-hover:text-white transition-colors">{movie.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 font-medium">{movie.duration} min</p>
                    <div className={`w-2 h-2 rounded-full ${movie.is_active ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {movies.filter(movie => movie.status === 'Now Showing' && movie.is_active).length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="col-span-full py-16 flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-white/10 border-dashed backdrop-blur-sm"
              >
                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <p className="text-gray-400 text-lg font-medium mb-4">No movies currently showing today.</p>
                <Link to="/admin/movies" className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10">
                  Import or Add Movies
                </Link>
              </motion.div>
            )}
          </div>
        )}
      </div>
      
      {/* Tailwind config fix to ensure shimmer animation is available if not already in global css */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;
