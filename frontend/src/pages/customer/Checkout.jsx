import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, updateUserPoints } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pointsToUse, setPointsToUse] = useState(0);

    // If navigated here directly without state, kick back
    if (!location.state || !location.state.showtime || !location.state.selectedSeats) {
        return (
            <div className="min-h-screen bg-[#0d0914] flex items-center justify-center p-4">
                <div className="bg-[#1a1225] border border-purple-900/30 p-8 rounded-3xl text-center max-w-md">
                    <p className="text-white mb-4">No booking session found.</p>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-purple-600 text-white rounded-full">Go Home</button>
                </div>
            </div>
        );
    }

    const { showtime, selectedSeats, totalPrice } = location.state;
    
    // Ensure points to use doesn't exceed the total price or the user's balance
    const maxPointsUsable = Math.min(user?.loyalty_points || 0, totalPrice);
    const finalPrice = Math.max(0, totalPrice - pointsToUse);

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        
        try {
            // 1. Create the booking
            const bookingRes = await axios.post('http://localhost:8000/api/bookings/', {
                user: user.id,
                showtime: showtime.id,
                total_amount: finalPrice,
                payment_status: 'Completed', // Simulating successful eSewa payment
                esewa_ref_id: 'SIMULATED_TEST'
            });

            const bookingId = bookingRes.data.id;

            // 2. Create ticket items
            const ticketPromises = selectedSeats.map(seat => 
                axios.post('http://localhost:8000/api/tickets/', {
                    booking: bookingId,
                    showtime: showtime.id,
                    seat: seat.id,
                    lock_status: 'Booked'
                })
            );

            await Promise.all(ticketPromises);

            // 3. Update Loyalty Points
            const pointsEarned = selectedSeats.length * 10;
            const newPointBalance = (user.loyalty_points || 0) - pointsToUse + pointsEarned;
            
            await axios.patch(`http://localhost:8000/api/users/${user.id}/`, {
                loyalty_points: newPointBalance
            });
            
            // Sync context
            updateUserPoints(newPointBalance);

            // 4. Navigate to success/dashboard
            navigate('/my-tickets', { state: { successMessage: `Tickets booked! You earned ${pointsEarned} Loyalty Points.` } });

        } catch (err) {
            console.error("Booking failed:", err);
            setError("Failed to complete booking. Please try again.");
            setLoading(false);
        }
    };

    // Helper for price (duplicated from SeatSelection to ensure accuracy if needed, or pass it via state)
    const getPrice = (tier, startTimeStr) => {
        const hour = new Date(startTimeStr).getHours();
        let shift = 'Night';
        if (hour < 12) shift = 'Morning';
        else if (hour < 17) shift = 'Day';

        if (shift === 'Morning') return tier === 'Gold' ? 150 : 120;
        if (shift === 'Day') return tier === 'Gold' ? 220 : 150;
        return tier === 'Gold' ? 300 : 220; // Night
    };

    return (
        <div className="min-h-screen bg-[#0d0914] pt-12 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-black text-white mb-8 border-l-4 border-purple-600 pl-4">Checkout</h1>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8">
                        {error}
                    </div>
                )}

                <div className="bg-[#1a1225] border border-purple-900/30 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-purple-900/30">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{showtime.movie_title}</h2>
                                <p className="text-purple-400 font-medium">
                                    {new Date(showtime.start_time).toLocaleString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">{showtime.screen_name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-[#150f1d]">
                        <h3 className="text-lg font-bold text-white mb-4">Selected Seats</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                            {selectedSeats.map(seat => (
                                <div key={seat.id} className="bg-[#1a1225] border border-purple-900/50 p-3 rounded-xl flex justify-between items-center">
                                    <div>
                                        <span className="text-white font-bold block">{seat.seat_label}</span>
                                        <span className="text-xs text-gray-500">{seat.tier}</span>
                                    </div>
                                    <span className="text-purple-400 font-medium">Rs. {getPrice(seat.tier, showtime.start_time)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-purple-900/30 pt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white">Rs. {totalPrice}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-400">Tax & Fees</span>
                                <span className="text-white">Rs. 0</span>
                            </div>

                            {user?.loyalty_points > 0 && (
                                <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-purple-300">Loyalty Points</span>
                                        <span className="text-sm text-gray-400">Balance: {user.loyalty_points} pts</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max={maxPointsUsable} 
                                            value={pointsToUse} 
                                            onChange={(e) => setPointsToUse(Number(e.target.value))}
                                            className="w-full accent-purple-500"
                                        />
                                        <span className="text-white font-bold w-16 text-right">-{pointsToUse}</span>
                                    </div>
                                    <p className="text-xs text-purple-400 mt-2 text-right">You save Rs. {pointsToUse}</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center border-t border-purple-900/30 pt-4">
                                <span className="text-xl font-bold text-white">Total Amount</span>
                                <span className="text-3xl font-black text-purple-400">Rs. {finalPrice}</span>
                            </div>
                            <p className="text-right text-xs text-green-400 mt-2 font-medium">You will earn {selectedSeats.length * 10} points from this booking!</p>
                        </div>
                    </div>

                    <div className="p-8 border-t border-purple-900/30 text-center">
                        <p className="text-sm text-gray-400 mb-6">You will be redirected to eSewa to complete your payment securely.</p>
                        
                        <button 
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full max-w-md mx-auto py-4 rounded-xl font-bold text-white bg-[#60a827] hover:bg-[#528f21] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <img src="https://esewa.com.np/common/images/esewa-logo.png" alt="eSewa" className="h-6 filter brightness-0 invert" />
                                    Pay Rs. {finalPrice} with eSewa
                                </>
                            )}
                        </button>
                        <p className="text-xs text-gray-500 mt-4">(This is a simulated test checkout. Clicking will instantly confirm the booking.)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
