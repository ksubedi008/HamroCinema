import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO';

const AdminShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    movie: '', screen: '', show_date: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [showRes, movRes, scrRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/showtimes/`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/movies/`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/screens/`)
      ]);
      // Sort showtimes by start_time descending to keep history organized
      const sortedShowtimes = showRes.data.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
      setShowtimes(sortedShowtimes);
      setMovies(movRes.data);
      setScreens(scrRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Filter Data Dynamically
  const { upcomingShowtimes, historyShowtimes } = useMemo(() => {
    const now = new Date();
    return {
      upcomingShowtimes: showtimes.filter(st => new Date(st.end_time) > now),
      historyShowtimes: showtimes.filter(st => new Date(st.end_time) <= now)
    };
  }, [showtimes]);

  const displayShowtimes = activeTab === 'upcoming' 
    ? upcomingShowtimes 
    : historyShowtimes.filter(st => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        const titleMatch = (st.movie_title || `Movie ID: ${st.movie}`).toLowerCase().includes(searchLower);
        return titleMatch;
      });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.movie || !formData.screen || !formData.show_date) return;
    
    const selectedMovie = movies.find(m => m.id.toString() === formData.movie.toString());
    if (!selectedMovie) return;

    // Find the actual screen object to get its name (e.g., "Screen 1")
    const selectedScreen = screens.find(s => s.id.toString() === formData.screen.toString());
    if (!selectedScreen) return;

    // Define a dictionary mapping screen names to their specific shift schedules
    const screenSchedules = {
        "Screen 1": [
            { name: 'Morning', hours: 6, mins: 45 }, // 06:45 AM
            { name: 'Day', hours: 12, mins: 15 },    // 12:15 PM
            { name: 'Night', hours: 19, mins: 45 }   // 07:45 PM
        ],
        "Screen 2": [
            { name: 'Morning', hours: 7, mins: 15 }, // 07:15 AM
            { name: 'Day', hours: 13, mins: 15 },    // 01:15 PM
            { name: 'Night', hours: 18, mins: 15 }   // 06:15 PM
        ]
    };

    // Use the specific schedule for the selected screen, or fallback to Screen 1
    const shifts = screenSchedules[selectedScreen.screen_name] || screenSchedules["Screen 1"];

    const totalMinutes = selectedMovie.duration + 15;

    try {
        const promises = shifts.map(shift => {
            const dateObj = new Date(formData.show_date);
            dateObj.setHours(shift.hours, shift.mins, 0);
            
            const endDate = new Date(dateObj.getTime() + totalMinutes * 60000);
            
            const tzOffset = dateObj.getTimezoneOffset() * 60000;
            const localStart = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);
            const localEnd = (new Date(endDate.getTime() - tzOffset)).toISOString().slice(0, 16);
            
            return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/showtimes/`, {
                movie: formData.movie,
                screen: formData.screen,
                start_time: localStart,
                end_time: localEnd,
                price_multiplier: 1.0
            });
        });

        await Promise.all(promises);
        setShowModal(false);
        fetchData();
        setFormData({ movie: '', screen: '', show_date: '' });
        setActiveTab('upcoming'); // Jump to upcoming to see the newly scheduled movies
    } catch (err) {
        console.error("Error scheduling showtimes:", err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to cancel this showtime?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/showtimes/${id}/`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <SEO title="Manage Showtimes | HamroCinema Admin" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white tracking-wider">Manage Showtimes</h2>
            <p className="text-gray-400 mt-1">Schedule and monitor all theater activity.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold tracking-wider hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform hover:-translate-y-0.5">
          + Schedule Movie
        </button>
      </div>

      {/* Tabbed UI */}
      <div className="flex items-center gap-4 border-b border-purple-900/30 pb-4">
        <button 
          onClick={() => { setActiveTab('upcoming'); setSearchQuery(''); }}
          className={`px-6 py-2.5 rounded-xl font-bold tracking-wider transition-all duration-300 ${activeTab === 'upcoming' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'}`}
        >
          Upcoming Showtimes ({upcomingShowtimes.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2.5 rounded-xl font-bold tracking-wider transition-all duration-300 ${activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'}`}
        >
          History ({historyShowtimes.length})
        </button>
      </div>

      {/* Search Bar (Only visible in History tab) */}
      {activeTab === 'history' && (
        <div className="flex justify-end animate-fade-in">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search historical movies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1225] border border-purple-900/30 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all placeholder-gray-500"
            />
          </div>
        </div>
      )}

      {/* Table Container - Fixed Height with Sticky Header */}
      <div className="bg-[#1a1225] border border-purple-900/30 rounded-2xl w-full max-h-[600px] overflow-y-auto relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
          <thead className="bg-[#241836] text-gray-400 font-semibold uppercase tracking-wider text-xs sticky top-0 z-10 shadow-md">
            <tr>
              <th className="px-6 py-5">Movie</th>
              <th className="px-6 py-5">Screen</th>
              <th className="px-6 py-5">Start Time</th>
              <th className="px-6 py-5">Shift</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20">
            {displayShowtimes.map(st => {
              const now = new Date();
              const stStart = new Date(st.start_time);
              const stEnd = new Date(st.end_time);
              
              let statusBadge;
              if (now > stEnd) statusBadge = <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-md text-xs font-bold border border-gray-500/30 uppercase tracking-widest">Ended</span>;
              else if (now >= stStart && now <= stEnd) statusBadge = <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-md text-xs font-bold border border-green-500/30 uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.3)]">Playing</span>;
              else statusBadge = <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-md text-xs font-bold border border-cyan-500/30 uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.2)]">Upcoming</span>;

              return (
              <tr key={st.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{st.movie_title || `Movie ID: ${st.movie}`}</td>
                <td className="px-6 py-4 font-medium text-purple-300">{st.screen_name || `Screen ID: ${st.screen}`}</td>
                <td className="px-6 py-4 text-gray-300 font-medium">
                    {stStart.toLocaleDateString()} <span className="text-gray-500 mx-1">•</span> {stStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
                <td className="px-6 py-4">
                  {stStart.getHours() < 12 ? 'Morning' : stStart.getHours() < 17 ? 'Day' : 'Night'}
                </td>
                <td className="px-6 py-4">{statusBadge}</td>
                <td className="px-6 py-4 text-right">
                  {now <= stStart && (
                    <button onClick={() => handleDelete(st.id)} className="text-red-400 hover:text-red-300 font-bold px-3 py-1.5 rounded hover:bg-red-400/10 transition-colors uppercase tracking-widest text-xs border border-transparent hover:border-red-500/30">Cancel</button>
                  )}
                  {now > stStart && (
                    <span className="text-gray-600 text-xs uppercase tracking-widest font-semibold">—</span>
                  )}
                </td>
              </tr>
            )})}
            {displayShowtimes.length === 0 && !loading && (
              <tr><td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {activeTab === 'history' && searchQuery ? (
                        <p className="text-lg">No historical showtimes found for <span className="text-white font-bold">"{searchQuery}"</span>.</p>
                      ) : (
                        <p className="text-lg">No {activeTab} showtimes found.</p>
                      )}
                  </div>
              </td></tr>
            )}
            {loading && (
              <tr><td colSpan="6" className="px-6 py-16 text-center text-purple-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <p>Loading records...</p>
                  </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1225] border border-purple-900/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-lg">
            <div className="p-6 border-b border-purple-900/30 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Schedule Showtime</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Movie</label>
                <select required value={formData.movie} onChange={e => setFormData({...formData, movie: e.target.value})} className="w-full bg-[#0d0914] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500">
                  <option value="">Select a movie...</option>
                  {movies.filter(m => m.is_active).map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Theater Screen</label>
                <select required value={formData.screen} onChange={e => setFormData({...formData, screen: e.target.value})} className="w-full bg-[#0d0914] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500">
                  <option value="">Select a screen...</option>
                  {screens.map(s => <option key={s.id} value={s.id}>{s.screen_name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Show Date</label>
                <input required type="date" value={formData.show_date} onChange={e => setFormData({...formData, show_date: e.target.value})} className="w-full bg-[#0d0914] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 [color-scheme:dark]" />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 inline-block flex-shrink-0"></span>
                  Morning, Day, and Night showtimes will be dynamically generated based on the selected screen's schedule.
                </p>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors">Schedule Movie</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShowtimes;
