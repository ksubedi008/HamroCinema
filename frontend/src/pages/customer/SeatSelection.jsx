import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

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
                const stRes = await axios.get(`http://localhost:8000/api/showtimes/${id}/`);
                setShowtime(stRes.data);

                // Fetch seats for this screen
                const seatRes = await axios.get(`http://localhost:8000/api/seats/?screen=${stRes.data.screen}`);
                // API might not filter by screen natively if not configured, let's filter manually just in case
                const screenSeats = seatRes.data.filter(s => s.screen.toString() === stRes.data.screen.toString());
                setSeats(screenSeats);

                // Fetch existing tickets for this showtime to see what's booked
                const ticketRes = await axios.get(`http://localhost:8000/api/tickets/?showtime=${id}`);
                const stTickets = ticketRes.data.filter(t => t.showtime.toString() === id.toString() && t.lock_status !== 'Available');
                setBookedTickets(stTickets);

            } catch (err) {
                console.error("Error fetching seat map data:", err);
            }
            setLoading(false);
        };
        fetchDetails();
    }, [id]);

    const getPrice = (tier, startTimeStr) => {
        const hour = new Date(startTimeStr).getHours();
        let shift = 'Night';
        if (hour < 12) shift = 'Morning';
        else if (hour < 17) shift = 'Day';

        if (shift === 'Morning') return tier === 'Gold' ? 150 : 120;
        if (shift === 'Day') return tier === 'Gold' ? 220 : 150;
        return tier === 'Gold' ? 300 : 220; // Night
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

    if (loading) return <div className="flex justify-center py-40"><div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
    if (!showtime) return <div className="text-center py-40 text-red-400">Showtime not found.</div>;

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + getPrice(seat.tier, showtime.start_time), 0);

    // Group seats by Row (assuming seat_label is like A1, A2, B1)
    const rowMap = {};
    seats.forEach(seat => {
        const row = seat.seat_label.charAt(0);
        if (!rowMap[row]) rowMap[row] = [];
        rowMap[row].push(seat);
    });
    
    // Sort rows (A, B, C...)
    const sortedRows = Object.keys(rowMap).sort();
    // Sort seats in rows (1, 2, 3...)
    sortedRows.forEach(row => {
        rowMap[row].sort((a,b) => parseInt(a.seat_label.substring(1)) - parseInt(b.seat_label.substring(1)));
    });

    return (
        <div className="w-full pb-20 animate-fade-in bg-[#0d0914] min-h-screen pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Info */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-purple-900/30">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">{showtime.movie_title}</h1>
                        <p className="text-purple-400 font-medium">
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
                    <div className="flex-1 bg-[#1a1225] rounded-3xl p-8 border border-purple-900/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {/* The Screen */}
                        <div className="mb-16 relative">
                            <div className="h-2 w-3/4 mx-auto bg-purple-500 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.8)]"></div>
                            <div className="h-16 w-3/4 mx-auto bg-gradient-to-b from-purple-500/20 to-transparent blur-md"></div>
                            <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Screen</p>
                        </div>

                        {/* Seat Grid */}
                        <div className="overflow-x-auto w-full pb-6 custom-scrollbar">
                            <div className="flex flex-col gap-4 items-center min-w-max mx-auto px-4">
                                {sortedRows.map(row => (
                                    <div key={row} className="flex items-center gap-4">
                                        <span className="text-gray-500 font-bold w-4 text-center">{row}</span>
                                        <div className="flex gap-2">
                                            {rowMap[row].map(seat => {
                                                const isBooked = bookedTickets.some(t => t.seat.toString() === seat.id.toString());
                                                const isSelected = selectedSeats.some(s => s.id === seat.id);
                                                const isVIP = seat.tier === 'Gold';

                                                let seatClass = "w-8 h-8 rounded-t-lg rounded-b-sm cursor-pointer transition-all flex items-center justify-center text-[10px] font-bold ";
                                                
                                                if (isBooked) {
                                                    seatClass += "bg-gray-800 text-gray-600 cursor-not-allowed";
                                                } else if (isSelected) {
                                                    seatClass += "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)] scale-110";
                                                } else if (isVIP) {
                                                    seatClass += "bg-[#2a1d3a] border border-purple-500/50 text-purple-400 hover:bg-purple-600/30";
                                                } else {
                                                    seatClass += "bg-[#2a1d3a] border border-gray-600 text-gray-400 hover:bg-gray-700";
                                                }

                                                return (
                                                    <div 
                                                        key={seat.id} 
                                                        className={seatClass}
                                                        onClick={() => handleSeatClick(seat)}
                                                        title={`${seat.seat_label} - Rs. ${getPrice(seat.tier, showtime.start_time)}`}
                                                    >
                                                        {seat.seat_label}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <span className="text-gray-500 font-bold w-4 text-center">{row}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-8 mt-16 pt-8 border-t border-purple-900/30">
                            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#2a1d3a] border border-purple-500/50 rounded-t"></div><span className="text-xs text-gray-400 font-medium uppercase tracking-wider">VIP / Gold</span></div>
                            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#2a1d3a] border border-gray-600 rounded-t"></div><span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Standard</span></div>
                            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-green-500 rounded-t"></div><span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Selected</span></div>
                            <div className="flex items-center gap-2"><div className="w-5 h-5 bg-gray-800 rounded-t"></div><span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Booked</span></div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-[#1a1225] rounded-3xl p-6 border border-purple-900/30 sticky top-28">
                            <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>
                            
                            {selectedSeats.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-purple-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                    </div>
                                    <p className="text-gray-400 text-sm">Please select your seats to see the summary.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedSeats.map(seat => (
                                            <div key={seat.id} className="flex justify-between items-center bg-[#0d0914] p-3 rounded-xl border border-purple-900/30">
                                                <div>
                                                    <p className="text-white font-bold">{seat.seat_label}</p>
                                                    <p className="text-xs text-purple-400">{seat.tier}</p>
                                                </div>
                                                <p className="text-white font-medium">Rs. {getPrice(seat.tier, showtime.start_time)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-purple-900/30 pt-4 mb-6">
                                        <div className="flex justify-between items-center mb-2 text-sm text-gray-400">
                                            <span>Tickets ({selectedSeats.length})</span>
                                            <span>Rs. {totalPrice}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xl font-black text-white">
                                            <span>Total</span>
                                            <span className="text-purple-400">Rs. {totalPrice}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleProceed}
                                        className="w-full py-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2"
                                    >
                                        {user ? 'Proceed to Checkout' : 'Log in to Checkout'}
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
