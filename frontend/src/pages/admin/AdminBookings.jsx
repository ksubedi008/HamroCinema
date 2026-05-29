import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/bookings/')
      .then(res => { setBookings(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Recent Bookings</h2>
      </div>

      <div className="bg-[#1a1225] border border-purple-900/30 rounded-2xl overflow-x-auto w-full shadow-xl">
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
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-purple-400">#{b.id.toString().padStart(6, '0')}</td>
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
            {bookings.length === 0 && !loading && (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No bookings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
