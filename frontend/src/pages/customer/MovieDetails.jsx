import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState({});
  const [expandedScreens, setExpandedScreens] = useState({});

  const toggleDate = (dateStr) => {
    setExpandedDates(prev => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };

  const toggleScreen = (dateStr, screenName) => {
    const key = `${dateStr}-${screenName}`;
    setExpandedScreens(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [movRes, showRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/movies/${id}/`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/showtimes/`)
        ]);
        setMovie(movRes.data);

        // Filter showtimes for this movie that haven't ended yet
        const now = new Date();
        const validShowtimes = showRes.data.filter(st => {
          if (!st.date || !st.shift) return false;
          const stEnd = new Date(st.end_time);
          return st.movie.toString() === id.toString() && stEnd > now;
        });

        // Group by date, then by screen
        const grouped = validShowtimes.reduce((acc, st) => {
          const dateStr = st.date; // Use the strict string from backend
          if (!acc[dateStr]) acc[dateStr] = {};
          const screenName = st.screen_name;
          if (!acc[dateStr][screenName]) acc[dateStr][screenName] = [];
          acc[dateStr][screenName].push(st);
          return acc;
        }, {});

        setShowtimes(grouped);
      } catch (err) {
        console.error("Error fetching details:", err);
      }
      setLoading(false);
    };

    fetchDetails();
  }, [id]);

  if (loading) return <div className="flex justify-center py-40"><div className="w-12 h-12 border-4 border-neutral-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!movie) return <div className="text-center py-40 text-red-400">Movie not found.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full pb-20 font-sans">
      <SEO title={movie.title} description={movie.description} image={movie.poster} />
      
      {/* Minimal Header */}
      <div className="relative w-full h-[40vh] flex items-end pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover opacity-20 blur-[5px]" />
          ) : (
            <div className="w-full h-full bg-[#121212]"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0914] to-transparent"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="flex-shrink-0 mx-auto md:mx-0 w-64 md:w-80 rounded-2xl overflow-hidden shadow-lg border border-neutral-800 bg-[#121212]">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="w-full h-auto object-cover" />
          ) : (
            <div className="w-full aspect-[2/3] flex items-center justify-center text-neutral-400">No Poster</div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 pt-4 md:pt-12">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-100 mb-4">{movie.title}</h1>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 bg-[#1A1A1A] border border-neutral-800 rounded-full text-sm text-neutral-300">{movie.duration} mins</span>
            <span className="px-3 py-1 bg-[#1A1A1A] border border-neutral-800 rounded-full text-sm text-neutral-300">{movie.genre}</span>
            <span className="px-3 py-1 bg-[#1A1A1A] border border-neutral-800 rounded-full text-sm text-neutral-300">{new Date(movie.release_date).toLocaleDateString()}</span>
          </div>

          {movie.director && <p className="text-neutral-300 font-medium mb-1">Director: <span className="text-neutral-100 transition-colors duration-200 ease-in-out">{movie.director}</span></p>}
          {movie.cast && <p className="text-neutral-300 font-medium mb-6">Cast: <span className="text-neutral-400">{movie.cast}</span></p>}
          
          <p className="text-neutral-400 text-lg leading-relaxed mb-12">{movie.description}</p>
        </div>
      </div>

      {/* Showtimes Section or Coming Soon state */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {movie.status === 'Coming Soon' ? (
          <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-12 text-center shadow-lg">
             <div className="w-16 h-16 bg-neutral-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-700">
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h2 className="text-3xl font-black text-neutral-100 mb-2">Release Pending</h2>
             <p className="text-neutral-400 text-lg">Ticketing will open closer to the official release date.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-neutral-100 border-l-4 border-neutral-600 pl-4 mb-8">Available Showtimes</h2>
            {Object.keys(showtimes).length === 0 ? (
              <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-12 text-center">
                <p className="text-neutral-400 text-lg">No upcoming showtimes available for this movie.</p>
                <p className="text-sm text-neutral-400 mt-2">Check back later or browse other movies.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(showtimes).sort((a,b) => new Date(a[0]) - new Date(b[0])).map(([date, screens], index) => {
                  // Expand the first date by default
                  const isDateExpanded = expandedDates[date] !== undefined ? expandedDates[date] : index === 0;
                  
                  // Format the YYYY-MM-DD to a nice string
                  const dateObj = new Date(date);
                  const formattedDate = !isNaN(dateObj) ? dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : date;

                  return (
                    <div key={date} className="bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
                      <button 
                        onClick={() => toggleDate(date)}
                        className="w-full px-6 py-5 flex items-center justify-between bg-[#1A1A1A]/50 hover:bg-[#1A1A1A] transition-colors duration-200 ease-in-out"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-6 h-6 text-neutral-400 hover:text-neutral-100 transition-colors duration-200 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span className="font-bold text-neutral-100 text-xl">{formattedDate}</span>
                        </div>
                        <svg className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ease-in-out ${isDateExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>

                      {isDateExpanded && (
                        <div className="p-4 md:p-6 space-y-4 bg-[#121212]">
                          {Object.entries(screens).map(([screenName, times]) => {
                            const isExpanded = expandedScreens[`${date}-${screenName}`];
                            return (
                              <div key={screenName} className="border border-neutral-800 rounded-2xl overflow-hidden bg-[#121212] shadow-md">
                                <button 
                                  onClick={() => toggleScreen(date, screenName)}
                                  className="w-full px-6 py-4 flex items-center justify-between bg-[#121212] hover:bg-stone-900 transition-colors duration-200 ease-in-out"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center">
                                      <svg className="w-4 h-4 text-neutral-100 transition-colors duration-200 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span className="font-bold text-neutral-100 text-lg">{screenName}</span>
                                  </div>
                                  <svg className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ease-in-out ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                
                                {isExpanded && (
                                  <div className="p-6 border-t border-neutral-800 flex flex-wrap gap-4 animate-fade-in bg-[#0a0a0a]">
                                    {times.sort((a,b) => new Date(a.start_time) - new Date(b.start_time)).map(st => {
                                      const shift = st.shift;
                                      let formattedTime = "00:00";
                                      if (shift === 'Morning') formattedTime = "09:00 AM";
                                      else if (shift === 'Day') formattedTime = "01:00 PM";
                                      else if (shift === 'Night') formattedTime = "06:00 PM";
                                      
                                      // Calculate if it's within 15 minutes of starting based on absolute Date parsing (backend provides reliable ISO string now)
                                      const startTime = new Date(st.start_time);
                                      const cutoffTime = startTime.getTime() - (15 * 60 * 1000);
                                      const isClosed = Date.now() >= cutoffTime;

                                      if (isClosed) {
                                        return (
                                          <div key={st.id} className="flex flex-col items-center justify-center bg-[#121212] border border-neutral-800 rounded-xl p-4 min-w-[140px] opacity-60 cursor-not-allowed">
                                            <span className="text-lg font-black text-neutral-400 mb-1 line-through tracking-wider">
                                              {formattedTime}
                                            </span>
                                            <span className="text-xs text-red-400 font-bold uppercase">Booking Closed</span>
                                          </div>
                                        );
                                      }
                                      
                                      return (
                                        <Link 
                                          key={st.id} 
                                          to={`/book/${st.id}`} 
                                          className="group flex flex-col items-center justify-center bg-[#121212] border border-neutral-800 hover:border-neutral-600 hover:bg-stone-900 rounded-xl p-4 min-w-[140px] transition-all duration-200 ease-in-out hover:shadow-[0_0_15px_rgba(217,119,6,0.15)] relative overflow-hidden"
                                        >
                                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                          <span className="text-lg font-black text-neutral-100 mb-1 group-hover:text-neutral-100 transition-colors duration-200 ease-in-out tracking-wider relative z-10">
                                            {formattedTime}
                                          </span>
                                          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-neutral-100 transition-colors duration-200 ease-in-out relative z-10">{shift}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default MovieDetails;
