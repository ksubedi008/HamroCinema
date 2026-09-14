import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/`)
      .then(res => { setBookings(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const filteredBookings = bookings.filter(b => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const userStr = b.username ? b.username.toLowerCase() : `user ${b.user}`;
    return userStr.includes(searchLower);
  });

  return (
    <div className="animate-fade-in space-y-6">
      <SEO title="Booking History | HamroCinema Admin" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white border-l-4 border-amber-500 pl-4 tracking-wider">Recent Bookings</h1>
            <p className="text-gray-400 mt-1 pl-4">Monitor customer ticket purchases.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
                />
            </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-x-auto w-full shadow-xl">
        <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
          <thead className="bg-purple-900/20 text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">Booking ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20">
            {filteredBookings.map(b => (
              <tr key={b.id} className="hover:bg-zinc-800 transition-colors">
                <td className="px-6 py-4 font-mono text-rose-500">#{b.id.toString().padStart(6, '0')}</td>
                <td className="px-6 py-4 font-medium text-white">{b.username || `User ${b.user}`}</td>
                <td className="px-6 py-4 font-bold text-green-400">Rs. {b.total_amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">{new Date(b.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {filteredBookings.length === 0 && !loading && (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
