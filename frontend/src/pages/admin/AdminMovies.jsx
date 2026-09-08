import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpenGraphPreview from '../../components/OpenGraphPreview';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', duration: '', genre: '', release_date: '', poster: null, is_active: true, status: 'Now Showing'
  });

  const fetchMovies = () => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/movies/`)
      .then(res => { setMovies(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('duration', formData.duration);
    data.append('genre', formData.genre);
    data.append('release_date', formData.release_date);
    data.append('is_active', formData.is_active);
    data.append('status', formData.status);
    
    if (formData.poster instanceof File) {
      data.append('poster', formData.poster);
    }

    const request = editingMovieId 
      ? axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/movies/${editingMovieId}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      : axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/movies/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

    request
      .then(res => {
        setShowModal(false);
        setEditingMovieId(null);
        fetchMovies();
        setFormData({ title: '', description: '', duration: '', genre: '', release_date: '', poster: null, is_active: true, status: 'Now Showing' });
      })
      .catch(err => console.error(err));
  };

  const openEditModal = (movie) => {
    setEditingMovieId(movie.id);
    setFormData({
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      genre: movie.genre || '',
      release_date: movie.release_date || '',
      poster: movie.poster, // will be a URL string, handled in submit
      is_active: movie.is_active,
      status: movie.status || 'Now Showing'
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingMovieId(null);
    setFormData({ title: '', description: '', duration: '', genre: '', release_date: '', poster: null, is_active: true, status: 'Now Showing' });
    setShowModal(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Manage Movies</h2>
        <button onClick={handleAddNew} className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all">
          + Add Movie
        </button>
      </div>

      <div className="bg-[#1a1225] border border-purple-900/30 rounded-2xl overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
          <thead className="bg-purple-900/20 text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Genre</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Release Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20">
            {movies.map(movie => (
              <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                  {movie.poster ? <img src={movie.poster} className="w-10 h-10 rounded object-cover border border-white/10" /> : <div className="w-10 h-10 rounded bg-gray-800 border border-white/10"></div>}
                  {movie.title}
                </td>
                <td className="px-6 py-4">{movie.genre || '-'}</td>
                <td className="px-6 py-4">{movie.duration} min</td>
                <td className="px-6 py-4">{movie.release_date || '-'}</td>
                <td className="px-6 py-4">
                  {movie.status === 'Coming Soon' ? (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium">Coming Soon</span>
                  ) : (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">Now Showing</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {movie.is_active ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">Active</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full font-medium">Hidden</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(movie)} className="text-pink-400 hover:text-pink-300 font-medium px-3 py-1 rounded hover:bg-pink-400/10 transition-colors">Edit</button>
                </td>
              </tr>
            ))}
            {movies.length === 0 && !loading && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No movies found.</td></tr>
            )}
            {loading && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-purple-400">Loading movies...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1225] border border-purple-900/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-lg">
            <div className="p-6 border-b border-purple-900/30 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{editingMovieId ? 'Edit Movie' : 'Add New Movie'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0d0914] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="e.g. Inception" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0d0914] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors" rows="3" placeholder="Movie synopsis..."></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400">Duration (min)</label>
                  <input required type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-[#0d0914] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="120" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400">Genre</label>
                  <input type="text" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full bg-[#0d0914] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder="Sci-Fi" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400">Release Date</label>
                  <input type="date" value={formData.release_date} onChange={e => setFormData({...formData, release_date: e.target.value})} className="w-full bg-[#0d0914] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400">Poster Image</label>
                  <input type="file" accept="image/*" onChange={e => setFormData({...formData, poster: e.target.files[0]})} className="w-full bg-[#0d0914] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-900/50 file:text-purple-300 hover:file:bg-purple-900/70" />
                  {editingMovieId && typeof formData.poster === 'string' && (
                    <p className="text-xs text-gray-500 mt-1">Current poster is kept unless you select a new one.</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 pb-2 gap-4">
                <div className="space-y-1 w-full sm:w-1/2 sm:pr-2">
                  <label className="text-sm font-medium text-gray-400">Release Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0d0914] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors">
                    <option value="Now Showing">Now Showing</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-1/2 sm:pl-2">
                  <input type="checkbox" id="isActive" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-purple-600 bg-[#0d0914] border-purple-900/50 rounded focus:ring-purple-500 focus:ring-2 mt-6" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-300 cursor-pointer mt-6">
                    Active (Visible publicly)
                  </label>
                </div>
              </div>

              {/* Real-time Social Share Preview */}
              <OpenGraphPreview 
                title={formData.title} 
                genre={formData.genre} 
                description={formData.description} 
                poster={formData.poster} 
              />

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors">Save Movie</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
