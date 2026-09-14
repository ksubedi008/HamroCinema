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
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl text-center max-w-md">
                    <p className="text-white mb-4">No booking session found.</p>
                    <button onClick={() => navigate('/')} className="btn-premium px-6 py-2 rounded-full">Go Home</button>
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
            // 1. Create the booking as Pending
            const bookingRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/`, {
                user: user.id,
                showtime: showtime.id,
                total_amount: finalPrice,
                payment_status: 'Pending',
            });

            const bookingId = bookingRes.data.id;

            // 2. Create ticket items
            const ticketPromises = selectedSeats.map(seat => 
                axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tickets/`, {
                    booking: bookingId,
                    showtime: showtime.id,
                    seat: seat.id,
                    lock_status: 'Booked'
                })
            );

            await Promise.all(ticketPromises);

            // 3. Handle Loyalty Points subtraction on client
            if (pointsToUse > 0) {
                const newPointBalance = (user.loyalty_points || 0) - pointsToUse;
                await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${user.id}/`, {
                    loyalty_points: newPointBalance
                });
                updateUserPoints(newPointBalance);
            }

            // 4. Request eSewa payload from backend
            const token = sessionStorage.getItem('authTokens') ? JSON.parse(sessionStorage.getItem('authTokens')).access : null;
            const payloadRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payments/initiate/`, 
                { booking_id: bookingId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const payload = payloadRes.data;

            // 5. Dynamically build and submit the eSewa form
            const form = document.createElement("form");
            form.setAttribute("method", "POST");
            form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");

            for (const key in payload) {
                const hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", payload[key]);
                form.appendChild(hiddenField);
            }

            document.body.appendChild(form);
            form.submit();

        } catch (err) {
            console.error("Booking failed:", err);
            setError("Failed to complete booking. Please try again.");
            setLoading(false);
        }
    };

    const getPrice = (tier, showtime) => {
        return showtime.price ? parseFloat(showtime.price) : 250;
    };

    return (
        <div className="min-h-screen bg-zinc-950 pt-12 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-black text-white mb-8 border-l-4 border-rose-500 pl-4">Checkout</h1>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8">
                        {error}
                    </div>
                )}

                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-zinc-800">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{showtime.movie_title}</h2>
                                <p className="text-rose-500 font-medium">
                                    {new Date(showtime.start_time).toLocaleString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">{showtime.screen_name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-zinc-950">
                        <h3 className="text-lg font-bold text-white mb-4">Selected Seats</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                            {selectedSeats.map(seat => (
                                <div key={seat.id} className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex justify-between items-center">
                                    <div>
                                        <span className="text-white font-bold block">{seat.seat_label}</span>
                                        <span className="text-xs text-gray-500">{seat.tier}</span>
                                    </div>
                                    <span className="text-rose-500 font-medium">Rs. {getPrice(seat.tier, showtime)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-zinc-800 pt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white">Rs. {totalPrice}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-400">Tax & Fees</span>
                                <span className="text-white">Rs. 0</span>
                            </div>

                            {user?.loyalty_points > 0 && (
                                <div className="mb-6 p-4 bg-purple-900/20 border border-zinc-800 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-rose-500">Loyalty Points</span>
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
                                    <p className="text-xs text-rose-500 mt-2 text-right">You save Rs. {pointsToUse}</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                                <span className="text-xl font-bold text-white">Total Amount</span>
                                <span className="text-3xl font-black text-rose-500">Rs. {finalPrice}</span>
                            </div>
                            <p className="text-right text-xs text-green-400 mt-2 font-medium">You will earn {selectedSeats.length * 10} points from this booking!</p>
                        </div>
                    </div>

                    <div className="p-8 border-t border-zinc-800 text-center">
                        <p className="text-sm text-gray-400 mb-6">You will be redirected to eSewa to complete your payment securely.</p>
                        
                        <button 
                            onClick={handlePayment}
                            disabled={loading}
                            className="btn-premium w-full bg-[#60bb46] hover:bg-[#52a33b] text-white font-bold py-3 px-6 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Redirecting to eSewa...
                                </>
                            ) : (
                                <>
                                    <img src="https://esewa.com.np/common/images/esewa-logo.png" alt="eSewa" className="h-6 filter brightness-0 invert" />
                                    Pay Rs. {finalPrice} with eSewa
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
