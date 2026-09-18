import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO';

const AdminShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    movie: '', screen: '', date: '', shift: ''
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

  useEffect(() => {
    fetchData();
  }, []);

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
    if (!formData.movie || !formData.screen || !formData.date || !formData.shift) return;
    setIsSubmitting(true);
    
    try {
      const screenList = formData.screen === 'ALL' ? screens.map(s => s.id) : [formData.screen];
      const shiftList = formData.shift === 'ALL' ? ['Morning', 'Day', 'Night'] : [formData.shift];
      
      const requests = [];
      for (const s of screenList) {
        for (const sh of shiftList) {
          requests.push(axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/showtimes/`, {
            movie: formData.movie,
            screen: s,
            date: formData.date,
            shift: sh
          }));
        }
      }
      
      await Promise.all(requests);
      setShowModal(false);
      fetchData();
      setFormData({ movie: '', screen: '', date: '', shift: '' });
      setActiveTab('upcoming'); // Jump to upcoming to see the newly scheduled movies
    } catch (err) {
      console.error("Error scheduling showtime:", err);
      if (err.response && err.response.data) {
        const errorMsg = Object.values(err.response.data)[0];
        alert(errorMsg);
      } else {
        alert("Failed to schedule some showtimes. Please check for collisions.");
      }
    } finally {
      setIsSubmitting(false);
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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-100 border-l-4 border-amber-500 pl-4 tracking-wider">Manage Showtimes</h1>
          <p className="text-neutral-400 mt-1 pl-4">Schedule and monitor all theater activity.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button onClick={() => setShowModal(true)} className="btn-premium w-full sm:w-auto px-6 py-2 rounded-xl text-sm font-bold tracking-wider">
            + Schedule Movie
          </button>
          
          {/* Search Bar */}
          {activeTab === 'history' && (
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search historical movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-[#1A1A1A] border border-neutral-800 text-neutral-100 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors duration-200 ease-in-out"
              />
            </div>
          )}

          {/* Tabs */}
          <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-neutral-800">
            <button 
              onClick={() => { setActiveTab('upcoming'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out border ${activeTab === 'upcoming' ? 'bg-stone-800 text-zinc-100 border-transparent hover:border-neutral-500 hover:text-neutral-100 shadow-sm' : 'border-transparent text-zinc-500 hover:text-neutral-300'}`}
            >
              Upcoming ({upcomingShowtimes.length})
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out border ${activeTab === 'history' ? 'bg-stone-800 text-zinc-100 border-transparent hover:border-neutral-500 hover:text-neutral-100 shadow-sm' : 'border-transparent text-zinc-500 hover:text-neutral-300'}`}
            >
              History ({historyShowtimes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Table Container - Fixed Height with Sticky Header */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl w-full max-h-[600px] overflow-y-auto relative shadow-lg">
        <table className="w-full text-left text-sm text-neutral-300 whitespace-nowrap">
          <thead className="bg-[#121212] text-neutral-400 font-semibold uppercase tracking-wider text-xs sticky top-0 z-10 shadow-md">
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
              if (now > stEnd) statusBadge = <span className="bg-gray-500/20 text-neutral-400 px-3 py-1 rounded-md text-xs font-bold border border-gray-500/30 uppercase tracking-widest">Ended</span>;
              else if (now >= stStart && now <= stEnd) statusBadge = <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-md text-xs font-bold border border-green-500/30 uppercase tracking-widest shadow-lg">Playing</span>;
              else statusBadge = <span className="bg-cyan-500/20 text-neutral-400 hover:text-neutral-100 px-3 py-1 rounded-md text-xs font-bold border border-neutral-800 uppercase tracking-widest shadow-lg">Upcoming</span>;

              return (
                <tr key={st.id} className="hover:bg-[#1A1A1A] transition-colors duration-200 ease-in-out">
                  <td className="px-6 py-4 font-bold text-neutral-100">{st.movie_title || `Movie ID: ${st.movie}`}</td>
                  <td className="px-6 py-4 font-medium text-neutral-400 hover:text-neutral-100">{st.screen_name || `Screen ID: ${st.screen}`}</td>
                  <td className="px-6 py-4 text-neutral-300 font-medium">
                    {stStart.toLocaleDateString()} <span className="text-neutral-400 mx-1">•</span> {stStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4">
                    {st.shift || (stStart.getHours() < 12 ? 'Morning' : stStart.getHours() < 17 ? 'Day' : 'Night')}
                  </td>
                  <td className="px-6 py-4">{statusBadge}</td>
                  <td className="px-6 py-4 text-right">
                    {now <= stStart && (
                      <button onClick={() => handleDelete(st.id)} className="text-red-400 hover:text-red-300 font-bold px-3 py-1.5 rounded hover:bg-red-400/10 transition-colors duration-200 ease-in-out uppercase tracking-widest text-xs border border-transparent hover:border-red-500/30">Cancel</button>
                    )}
                    {now > stStart && (
                      <span className="text-gray-600 text-xs uppercase tracking-widest font-semibold">—</span>
                    )}
                  </td>
                </tr>
              )})}
              
            {displayShowtimes.length === 0 && !loading && (
              <tr><td colSpan="6" className="px-6 py-16 text-center text-neutral-400">
                <div className="flex flex-col items-center gap-3">
                  <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {activeTab === 'history' && searchQuery ? (
                    <p className="text-lg">No historical showtimes found for <span className="text-neutral-100 font-bold">"{searchQuery}"</span>.</p>
                  ) : (
                    <p className="text-lg">No {activeTab} showtimes found.</p>
                  )}
                </div>
              </td></tr>
            )}
            
            {loading && (
              <tr><td colSpan="6" className="px-6 py-16 text-center text-neutral-400 hover:text-neutral-100">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-neutral-800 border-t-purple-500 rounded-full animate-spin"></div>
                  <p>Loading records...</p>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#121212]/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-lg">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-neutral-100">Schedule Showtime</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-100 transition-colors duration-200 ease-in-out">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-400">Movie</label>
                <select required value={formData.movie} onChange={e => setFormData({...formData, movie: e.target.value})} className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600">
                  <option value="">Select a movie...</option>
                  {movies.filter(m => m.is_active).map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-400">Theater Screen</label>
                <select required value={formData.screen} onChange={e => setFormData({...formData, screen: e.target.value})} className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600">
                  <option value="">Select a screen...</option>
                  <option value="ALL">All Screens</option>
                  {screens.map(s => <option key={s.id} value={s.id}>{s.screen_name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-400">Show Date</label>
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600 [color-scheme:dark]" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-400">Shift</label>
                <select required value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})} className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600">
                  <option value="">Select a shift...</option>
                  <option value="ALL">All Shifts</option>
                  <option value="Morning">Morning (09:00 AM)</option>
                  <option value="Day">Day (01:00 PM)</option>
                  <option value="Night">Night (06:00 PM)</option>
                </select>
                <p className="text-xs text-neutral-400 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 inline-block flex-shrink-0"></span>
                  Start times, end times, and ticket prices will be automatically assigned based on the shift selected.
                </p>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-700 text-neutral-300 hover:bg-gray-800 transition-colors duration-200 ease-in-out">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-premium px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-neutral-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Scheduling...
                    </>
                  ) : "Schedule Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShowtimes;
