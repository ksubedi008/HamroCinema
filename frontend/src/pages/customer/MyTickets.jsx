import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const MyTickets = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const successMessage = location.state?.successMessage;

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Fetch bookings (backend automatically filters to the logged-in user)
                const res = await axios.get('http://localhost:8000/api/bookings/');
                
                // Fetch all tickets to map to bookings
                // A more optimized backend would serialize tickets inside bookings, 
                // but we can just fetch tickets and filter here for now.
                const ticketsRes = await axios.get('http://localhost:8000/api/tickets/');
                
                // Also need showtimes to display details
                const stRes = await axios.get('http://localhost:8000/api/showtimes/');

                // Combine the data
                const bookingsWithDetails = res.data.map(b => {
                    const bTickets = ticketsRes.data.filter(t => t.booking === b.id);
                    // Assume all tickets in a booking are for the same showtime
                    const stId = bTickets.length > 0 ? bTickets[0].showtime : null;
                    const showtime = stId ? stRes.data.find(s => s.id === stId) : null;
                    
                    return { ...b, tickets: bTickets, showtime };
                }).filter(b => b.showtime); // only valid ones

                // Sort by booking date descending
                bookingsWithDetails.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setBookings(bookingsWithDetails);
                
            } catch (err) {
                console.error("Error fetching tickets:", err);
            }
            setLoading(false);
        };
        if (user) {
            fetchBookings();
        }
    }, [user]);

    if (loading) return <div className="flex justify-center py-40"><div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-[#0d0914] pt-12 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-medium">{successMessage}</span>
                        </div>
                    </div>
                )}

                <h1 className="text-3xl font-black text-white mb-8 border-l-4 border-purple-600 pl-4">My Tickets</h1>

                {bookings.length === 0 ? (
                    <div className="bg-[#1a1225] border border-purple-900/30 p-12 rounded-3xl text-center">
                        <div className="w-20 h-20 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-purple-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No tickets yet</h2>
                        <p className="text-gray-400 mb-6">Looks like you haven't booked any movies yet.</p>
                        <Link to="/" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-500 transition-colors inline-block">
                            Browse Movies
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map(booking => (
                            <div key={booking.id} className="bg-[#1a1225] border border-purple-900/30 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_5px_20px_rgba(0,0,0,0.3)]">
                                {/* Left Side: Movie Info */}
                                <div className="p-6 md:p-8 flex-1 border-b md:border-b-0 md:border-r border-purple-900/30">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-black text-white">{booking.showtime.movie_title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.payment_status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {booking.payment_status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {new Date(booking.showtime.start_time).toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                            {booking.showtime.screen_name}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side: Ticket Details & QR */}
                                <div className="p-6 md:p-8 w-full md:w-auto bg-[#150f1d] flex flex-col md:flex-row gap-6 md:gap-8 justify-between">
                                    <div className="flex flex-col justify-between min-w-[200px]">
                                        <div>
                                            <p className="text-gray-400 text-sm mb-3">Seats ({booking.tickets.length})</p>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {booking.tickets.map(t => (
                                                    <span key={t.id} className="px-3 py-1 bg-[#2a1d3a] border border-purple-500/30 text-purple-300 rounded-lg text-sm font-bold">
                                                        {t.seat_label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end border-t border-purple-900/30 pt-4">
                                            <div className="text-xs text-gray-500">
                                                <p>Booking ID: #{booking.id}</p>
                                                <p>{new Date(booking.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-white">Rs. {booking.total_amount}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* QR Code */}
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-purple-900/30 pt-6 md:pt-0 md:pl-8">
                                        <div className="bg-white p-2 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                            <img 
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                                                    `HamroCinema Ticket\n` +
                                                    `Booking ID: ${booking.id}\n` +
                                                    `User: ${user.username}\n` +
                                                    `Movie: ${booking.showtime.movie_title}\n` +
                                                    `Screen: ${booking.showtime.screen_name}\n` +
                                                    `Showtime: ${new Date(booking.showtime.start_time).toLocaleString()}\n` +
                                                    `Seats: ${booking.tickets.map(t => t.seat_label).join(', ')}\n` +
                                                    `Total: Rs. ${booking.total_amount}`
                                                )}`} 
                                                alt="Ticket QR" 
                                                className="w-24 h-24 sm:w-28 sm:h-28" 
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3 font-medium uppercase tracking-wider text-center">Scan at Entry</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTickets;
