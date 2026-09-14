import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('unread');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMessages = async () => {
        try {
            const token = sessionStorage.getItem('authTokens') ? JSON.parse(sessionStorage.getItem('authTokens')).access : null;
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/contact-messages/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = sessionStorage.getItem('authTokens') ? JSON.parse(sessionStorage.getItem('authTokens')).access : null;
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/contact-messages/${id}/`, 
                { is_read: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchMessages();
        } catch (err) {
            console.error("Failed to mark message as read", err);
        }
    };

    const filteredMessages = messages.filter(msg => {
        const tabMatch = activeTab === 'unread' ? !msg.is_read : msg.is_read;
        const searchMatch = msg.email.toLowerCase().includes(searchTerm.toLowerCase());
        return tabMatch && searchMatch;
    });

    if (loading) return <div className="text-white">Loading messages...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white border-l-4 border-amber-500 pl-4">Contact Messages</h1>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search by email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                    </div>
                    
                    <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                        <button
                            onClick={() => setActiveTab('unread')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${activeTab === 'unread' ? 'bg-stone-800 text-zinc-100 border-transparent hover:border-amber-500 hover:text-amber-500 shadow-sm' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Inbox (Unread)
                        </button>
                        <button
                            onClick={() => setActiveTab('read')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${activeTab === 'read' ? 'bg-stone-800 text-zinc-100 border-transparent hover:border-amber-500 hover:text-amber-500 shadow-sm' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            History (Read)
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-zinc-300">
                        <thead className="bg-zinc-900 border-b border-zinc-800 text-sm uppercase tracking-wider text-zinc-400">
                            <tr>
                                <th className="px-6 py-4 font-bold">Name</th>
                                <th className="px-6 py-4 font-bold">Email</th>
                                <th className="px-6 py-4 font-bold w-1/3">Message</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {filteredMessages.map((msg) => (
                                <tr key={msg.id} className={`hover:bg-zinc-900/50 transition-colors ${!msg.is_read ? 'bg-zinc-900/20 font-medium text-white' : 'text-zinc-400'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">{msg.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-amber-500">{msg.email}</td>
                                    <td className="px-6 py-4">
                                        <p className="line-clamp-2 text-sm">{msg.message}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {!msg.is_read ? (
                                            <button 
                                                onClick={() => markAsRead(msg.id)}
                                                className="bg-amber-700 hover:bg-amber-800 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider"
                                            >
                                                Mark Read
                                            </button>
                                        ) : (
                                            <span className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Read</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredMessages.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">No messages found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;
