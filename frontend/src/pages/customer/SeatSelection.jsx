import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import CinemaSeatMap from './CinemaSeatMap';

const SeatSelection = () => {
    const { id } = useParams(); // showtime id
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [showtime, setShowtime] = useState(null);
    const [seats, setSeats] = useState([]);
    const [bookedTickets, setBookedTickets] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch showtime details
                const stRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/showtimes/${id}/`);
                setShowtime(stRes.data);

                // Fetch seats for this screen
                const seatRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/seats/?screen=${stRes.data.screen}`);
                // API might not filter by screen natively if not configured, let's filter manually just in case
                const screenSeats = seatRes.data.filter(s => s.screen.toString() === stRes.data.screen.toString());
                setSeats(screenSeats);

                // Fetch existing tickets for this showtime to see what's booked
                const ticketRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tickets/?showtime=${id}`);
                const stTickets = ticketRes.data.filter(t => t.showtime.toString() === id.toString() && t.lock_status !== 'Available');
                setBookedTickets(stTickets);

            } catch (err) {
                console.error("Error fetching seat map data:", err);
            }
            setLoading(false);
        };
        fetchDetails();
    }, [id]);

    const getPrice = (seat) => {
        if (!seat) return 0;
        if (seat.tier === 'Gold') return 500; // Middle block (M)
        return 300; // Left/Right block (L/R)
    };

    const handleSeatClick = (seat) => {
        if (bookedTickets.some(t => t.seat.toString() === seat.id.toString())) return; // Booked

        if (selectedSeats.find(s => s.id === seat.id)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleProceed = () => {
        if (selectedSeats.length === 0) return;
        if (!user) {
            // Need to login to checkout
            navigate('/login');
            return;
        }
        // Proceed to checkout - pass data via state
        navigate(`/checkout`, { state: { showtime, selectedSeats, totalPrice }});
    };

    if (loading) return <div className="flex justify-center py-40"><div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div></div>;
    if (!showtime) return <div className="text-center py-40 text-red-400">Showtime not found.</div>;

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + getPrice(seat), 0);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full pb-20 min-h-screen pt-8 relative overflow-hidden"
        >
            {/* Ambient Mesh Gradient specifically for Seat Selection */}
            <div className="fixed inset-0 z-0 pointer-events-none">
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header Info */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">{showtime.movie_title}</h1>
                        <p className="text-rose-500 font-medium">
                            {new Date(showtime.start_time).toLocaleString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} • {showtime.screen_name}
                        </p>
                    </div>
                    {!user && (
                        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-medium">
                            You are browsing as a Guest. Log in to book tickets.
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cinema Room Canvas */}
                    <div className="flex-1 bg-zinc-950 rounded-3xl p-4 md:p-8 border border-zinc-800 shadow-lg">
                        <CinemaSeatMap 
                            seats={seats}
                            bookedTickets={bookedTickets}
                            selectedSeats={selectedSeats}
                            onSeatClick={handleSeatClick}
                            getPrice={getPrice}
                            showtime={showtime}
                        />
                    </div>

                    {/* Summary Sidebar */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-zinc-950 rounded-3xl p-6 border border-zinc-800 sticky top-28">
                            <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>
                            
                            {selectedSeats.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 mx-auto bg-stone-800 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                    </div>
                                    <p className="text-gray-400 text-sm">Please select your seats to see the summary.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedSeats.map(seat => (
                                            <div key={seat.id} className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                                                <div>
                                                    <p className="text-white font-bold">{seat.seat_label}</p>
                                                    <p className="text-xs text-rose-500">{seat.tier}</p>
                                                </div>
                                                <p className="text-white font-medium">Rs. {getPrice(seat)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-zinc-800 pt-4 mb-6">
                                        <div className="flex justify-between items-center mb-2 text-sm text-gray-400">
                                            <span>Tickets ({selectedSeats.length})</span>
                                            <span>Rs. {totalPrice}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xl font-black text-white">
                                            <span>Total</span>
                                            <span className="text-rose-500">Rs. {totalPrice}</span>
                                        </div>
                                    </div>

                                    {showtime && (new Date(showtime.start_time).getTime() - (15 * 60 * 1000) <= Date.now()) ? (
                                        <button 
                                            disabled
                                            className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-zinc-900 text-gray-500 font-bold border border-zinc-800 cursor-not-allowed uppercase tracking-widest text-sm"
                                        >
                                            Booking Closed
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={handleProceed}
                                            className="btn-premium w-full py-4 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            {user ? 'Proceed to Checkout' : 'Log in to Checkout'}
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SeatSelection;
