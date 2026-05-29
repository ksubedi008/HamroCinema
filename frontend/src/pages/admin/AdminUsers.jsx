import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/users/');
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Registered Users</h2>
      </div>

      <div className="bg-[#1a1225] border border-purple-900/30 rounded-2xl overflow-x-auto w-full shadow-lg">
        <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
          <thead className="bg-purple-900/20 text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4 font-bold text-white">{user.username}</td>
                <td className="px-6 py-4">{user.email || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.role === 'Admin' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(user.date_joined).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  {user.is_active ? (
                     <span className="text-green-400 font-medium">Active</span>
                  ) : (
                     <span className="text-red-400 font-medium">Inactive</span>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No users registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
