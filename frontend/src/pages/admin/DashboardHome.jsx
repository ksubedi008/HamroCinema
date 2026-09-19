import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../../components/SEO";
import { AuthContext } from "../../context/AuthContext";

const DashboardHome = () => {
  const { authTokens } = useContext(AuthContext);
  const [stats, setStats] = useState({
    movies: 0,
    activeShowtimes: 0,
    revenue: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [upcomingShowtimes, setUpcomingShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = authTokens ? { Authorization: `Bearer ${authTokens.access}` } : {};

        const [movRes, showRes, bookRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/movies/`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/showtimes/`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/`, { headers }),
        ]);

        const now = new Date();
        const active = showRes.data.filter((st) => new Date(st.end_time) > now);
        
        const completedBookings = bookRes.data.filter(
          (b) => b.payment_status === "Completed",
        );
        const totalRev = completedBookings.reduce(
          (sum, b) => sum + parseFloat(b.total_amount),
          0,
        );

        setStats({
          movies: movRes.data.length,
          activeShowtimes: active.length,
          revenue: totalRev,
        });

        // Top 5 recent transactions
        const recentTxns = [...bookRes.data]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setTransactions(recentTxns);

        // Top 5 upcoming showtimes
        const upcoming = [...active]
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
          .slice(0, 5);
        
        // Calculate seats sold
        const upcomingWithSeats = upcoming.map(st => {
          // Find bookings for this showtime that are completed
          // Note: booking.showtime might be an ID or a nested object, but typically serializers return nested object if configured, 
          // or just ID. Wait, earlier we saw BookingSerializer has showtime_details.
          // Let's check if b.showtime_details exists.
          const sold = completedBookings
            .filter(b => b.showtime_details?.id === st.id || b.showtime === st.id)
            .reduce((sum, b) => sum + (b.tickets ? b.tickets.length : 0), 0);
          
          return { ...st, sold_seats: sold, total_capacity: 75 }; // Default capacity
        });
        setUpcomingShowtimes(upcomingWithSeats);

      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [authTokens]);

  const formatRevenue = (value) => {
    if (value >= 1000000) return `Rs. ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `Rs. ${(value / 1000).toFixed(1)}K`;
    return `Rs. ${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-10 pb-10 font-sans">
      <SEO title="Dashboard | HamroCinema Admin" />
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col sm:flex-row justify-between items-center gap-6"
      >
        <div>
          <h2 className="text-4xl font-extrabold text-neutral-100 mb-2 tracking-tight">
            System Overview
          </h2>
          <p className="text-neutral-400 text-sm tracking-widest uppercase font-semibold">
            Cinematic Command Center
          </p>
        </div>
        <Link
          to="/k-subedi-08/movies"
          className="btn-premium relative group overflow-hidden px-8 py-3 rounded-full tracking-wider"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Movie
          </span>
        </Link>
      </motion.header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#1A1A1A] border border-neutral-800 rounded-xl p-6 flex flex-col gap-2 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
            </div>
            <p className="text-neutral-400 text-sm font-semibold tracking-widest uppercase">Total Movies</p>
          </div>
          <h3 className="text-3xl font-bold text-neutral-100">{loading ? '-' : stats.movies}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#1A1A1A] border border-neutral-800 rounded-xl p-6 flex flex-col gap-2 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-neutral-400 text-sm font-semibold tracking-widest uppercase">Active Showtimes</p>
          </div>
          <h3 className="text-3xl font-bold text-neutral-100">{loading ? '-' : stats.activeShowtimes}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#1A1A1A] border border-neutral-800 rounded-xl p-6 flex flex-col gap-2 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-neutral-400 text-sm font-semibold tracking-widest uppercase">Total Revenue</p>
          </div>
          <h3 className="text-3xl font-bold text-neutral-100 flex-wrap shrink-0 break-all">{loading ? '-' : formatRevenue(stats.revenue)}</h3>
        </motion.div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        
        {/* Recent Transactions Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#1A1A1A] border border-neutral-800 rounded-xl overflow-hidden shadow-lg flex flex-col"
        >
          <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-100">Recent Transactions</h3>
            <Link to="/k-subedi-08/bookings" className="text-sm font-medium text-purple-400 hover:text-purple-300">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#121212] border-b border-neutral-800 text-xs font-semibold tracking-widest uppercase text-neutral-500">
                  <th className="px-6 py-3 font-medium">Booking ID</th>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-neutral-800/50">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-neutral-500">No recent transactions.</td>
                  </tr>
                ) : transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4 font-mono text-neutral-300">#{txn.id}</td>
                    <td className="px-6 py-4 font-medium text-neutral-100">{txn.username || `User ${txn.user}`}</td>
                    <td className="px-6 py-4 text-neutral-300">Rs. {txn.total_amount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${txn.payment_status === 'Completed' ? 'bg-green-500' : txn.payment_status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span className={`font-medium ${txn.payment_status === 'Completed' ? 'text-green-500' : txn.payment_status === 'Pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                          {txn.payment_status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Upcoming Showtimes Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#1A1A1A] border border-neutral-800 rounded-xl overflow-hidden shadow-lg flex flex-col"
        >
          <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-100">Upcoming Showtimes</h3>
            <Link to="/k-subedi-08/showtimes" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">Manage</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#121212] border-b border-neutral-800 text-xs font-semibold tracking-widest uppercase text-neutral-500">
                  <th className="px-6 py-3 font-medium">Movie</th>
                  <th className="px-6 py-3 font-medium">Time / Screen</th>
                  <th className="px-6 py-3 font-medium min-w-[150px]">Seats Sold</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-neutral-800/50">
                {upcomingShowtimes.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-neutral-500">No upcoming showtimes scheduled.</td>
                  </tr>
                ) : upcomingShowtimes.map((st) => (
                  <tr key={st.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-neutral-100">{st.movie_title || 'Unknown Movie'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-neutral-100 font-medium">
                          {new Date(st.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs text-neutral-500">{st.screen_name || 'Standard Screen'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-400">{st.sold_seats} / {st.total_capacity}</span>
                          <span className="text-neutral-100 font-medium">{Math.round((st.sold_seats / st.total_capacity) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min((st.sold_seats / st.total_capacity) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>

      <style>{` @keyframes shimmer { 100% { transform: translateX(100%); } } `}</style>
    </div>
  );
};

export default DashboardHome;
