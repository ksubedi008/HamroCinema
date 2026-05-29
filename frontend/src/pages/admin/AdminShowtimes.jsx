import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    movie: '', screen: '', show_date: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [showRes, movRes, scrRes] = await Promise.all([
        axios.get('http://localhost:8000/api/showtimes/'),
        axios.get('http://localhost:8000/api/movies/'),
        axios.get('http://localhost:8000/api/screens/')
      ]);
      setShowtimes(showRes.data);
      setMovies(movRes.data);
      setScreens(scrRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.movie || !formData.screen || !formData.show_date) return;
    
    const selectedMovie = movies.find(m => m.id.toString() === formData.movie.toString());
    if (!selectedMovie) return;

    const totalMinutes = selectedMovie.duration + 15;
    
    const shifts = [
        { name: 'Morning', hours: 6, mins: 45 },
        { name: 'Day', hours: 12, mins: 45 },
        { name: 'Night', hours: 19, mins: 30 }
    ];

    try {
        const promises = shifts.map(shift => {
            const dateObj = new Date(formData.show_date);
            dateObj.setHours(shift.hours, shift.mins, 0);
            
            const endDate = new Date(dateObj.getTime() + totalMinutes * 60000);
            
            const tzOffset = dateObj.getTimezoneOffset() * 60000;
            const localStart = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);
            const localEnd = (new Date(endDate.getTime() - tzOffset)).toISOString().slice(0, 16);
            
            return axios.post('http://localhost:8000/api/showtimes/', {
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
    } catch (err) {
        console.error("Error scheduling showtimes:", err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to cancel this showtime?')) {
      try {
        await axios.delete(`http://localhost:8000/api/showtimes/${id}/`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Manage Showtimes</h2>
        <button onClick={() => setShowModal(true)} className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all">
          + Schedule Movie
        </button>
      </div>

      <div className="bg-[#1a1225] border border-purple-900/30 rounded-2xl overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
          <thead className="bg-purple-900/20 text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">Movie</th>
              <th className="px-6 py-4">Screen</th>
              <th className="px-6 py-4">Start Time</th>
              <th className="px-6 py-4">Shift</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20">
            {showtimes.map(st => {
              const now = new Date();
              const stStart = new Date(st.start_time);
              const stEnd = new Date(st.end_time);
              
              let statusBadge;
              if (now > stEnd) statusBadge = <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs border border-gray-500/30">Ended</span>;
              else if (now >= stStart && now <= stEnd) statusBadge = <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs border border-green-500/30">Playing</span>;
              else statusBadge = <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/30">Upcoming</span>;

              return (
              <tr key={st.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{st.movie_title || `Movie ID: ${st.movie}`}</td>
                <td className="px-6 py-4">{st.screen_name || `Screen ID: ${st.screen}`}</td>
                <td className="px-6 py-4">{stStart.toLocaleString()}</td>
                <td className="px-6 py-4">
                  {stStart.getHours() < 12 ? 'Morning' : stStart.getHours() < 17 ? 'Day' : 'Night'}
                </td>
                <td className="px-6 py-4">{statusBadge}</td>
                <td className="px-6 py-4 text-right">
                  {now <= stStart && (
                    <button onClick={() => handleDelete(st.id)} className="text-red-400 hover:text-red-300 font-medium px-3 py-1 rounded hover:bg-red-400/10 transition-colors">Cancel</button>
                  )}
                </td>
              </tr>
            )})}
            {showtimes.length === 0 && !loading && (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No showtimes scheduled.</td></tr>
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
                  {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
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
                  <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                  Morning (6:45 AM), Day (12:45 PM), and Night (7:30 PM) showtimes will be automatically generated.
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
