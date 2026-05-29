import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardHome = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ movies: 0, activeShowtimes: 0, revenue: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movRes, showRes, bookRes] = await Promise.all([
          axios.get('http://localhost:8000/api/movies/'),
          axios.get('http://localhost:8000/api/showtimes/'),
          axios.get('http://localhost:8000/api/bookings/')
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
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Overview</h2>
          <p className="text-gray-400">Welcome back to the cinematic command center.</p>
        </div>
        <button className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all">
          + Add Movie
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1225] border border-purple-900/30 rounded-2xl p-6">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Movies</p>
          <h3 className="text-4xl font-bold text-white">{stats.movies}</h3>
        </div>
        <div className="bg-[#1a1225] border border-pink-900/30 rounded-2xl p-6">
          <p className="text-gray-400 text-sm font-medium mb-1">Active Showtimes</p>
          <h3 className="text-4xl font-bold text-white">{stats.activeShowtimes}</h3>
        </div>
        <div className="bg-[#1a1225] border border-blue-900/30 rounded-2xl p-6">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
          <h3 className="text-4xl font-bold text-white">Rs. {stats.revenue.toLocaleString()}</h3>
        </div>
      </div>

      {/* Movie Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-purple-500 rounded-full inline-block"></span>
          Now Showing
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map(movie => (
              <div key={movie.id} className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="aspect-[2/3] bg-gray-800 relative">
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                      <span className="text-4xl mb-2">🎬</span>
                      <span>No Poster</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0914] via-[#0d0914]/40 to-transparent opacity-80"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-5">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-purple-600 text-white mb-2 inline-block">
                    {movie.genre || "N/A"}
                  </span>
                  <h4 className="text-lg font-bold text-white leading-tight">{movie.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{movie.duration} mins</p>
                </div>
              </div>
            ))}
            
            {movies.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
                <p className="text-gray-400">No movies found in the database. Click "+ Add Movie" above or visit the Movies tab!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
