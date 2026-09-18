import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 

const Checkout = () => { 
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const { user, fetchCurrentUser } = useContext(AuthContext); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [error, setError] = useState(''); 
  const [livePoints, setLivePoints] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [pendingBookingId, setPendingBookingId] = useState(null);

  useEffect(() => {
    const fetchLivePoints = async () => {
      try {
        const token = sessionStorage.getItem('authTokens') ? JSON.parse(sessionStorage.getItem('authTokens')).access : null;
        if (token) {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/me/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setLivePoints(response.data.loyalty_points);
        }
      } catch (err) {
        console.error("Failed to fetch live points:", err);
      }
    };
    fetchLivePoints();
  }, []);

  useEffect(() => {
    console.log("State changed to:", paymentMethod);
  }, [paymentMethod]);
  
  if (!location.state || !location.state.showtime || !location.state.selectedSeats) { 
    return ( 
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4"> 
        <div className="bg-[#121212] border border-neutral-800 p-8 rounded-3xl text-center max-w-md"> 
          <p className="text-neutral-100 mb-4">No booking session found.</p> 
          <button onClick={() => navigate('/')} className="btn-premium px-6 py-2 rounded-full bg-neutral-800 text-neutral-100">Go Home</button> 
        </div> 
      </div> 
    ); 
  } 
  
  const { showtime, selectedSeats, totalPrice } = location.state; 
  const canUseLoyalty = livePoints >= totalPrice;

  const handleEsewaPayment = async (bookingId, token) => {
    try {
      const payloadRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payments/initiate/`, 
        { booking_id: bookingId }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      ); 
      const payload = payloadRes.data; 
      
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
    } catch (error) {
      console.error("eSewa Payment Error:", error);
      throw error;
    }
  };

  const handleLoyaltyPayment = async (bookingId, token) => {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/me/loyalty-transactions/`, 
      { amount: -totalPrice, description: `Spent on booking ${bookingId}` },
      { headers: { Authorization: `Bearer ${token}` } }
    ); 
    await fetchCurrentUser(); 
    navigate('/booking-history?payment=success');
  };

  const handleCheckout = async (e) => { 
    if (e) e.preventDefault();
    console.log("Checkout triggered. Selected method:", paymentMethod);
    setIsSubmitting(true); 
    setError(''); 
    try { 
      const token = sessionStorage.getItem('authTokens') ? JSON.parse(sessionStorage.getItem('authTokens')).access : null;
      let bookingId = pendingBookingId;

      if (!bookingId) {
        // 1. Create the Pending Booking
        const bookingRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/`, { 
          user: user.id, 
          showtime: showtime.id, 
          total_amount: totalPrice, 
          payment_status: paymentMethod === 'loyalty' ? 'Completed' : 'Pending', 
        }, { headers: { Authorization: `Bearer ${token}` } }); 
        bookingId = bookingRes.data.id; 
        
        // 2. Create the tickets
        const ticketPromises = selectedSeats.map(seat => 
          axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tickets/`, { 
            booking: bookingId, 
            showtime: showtime.id, 
            seat: seat.id, 
            lock_status: 'Booked' 
          }, { headers: { Authorization: `Bearer ${token}` } }) 
        ); 
        await Promise.all(ticketPromises); 
        
        setPendingBookingId(bookingId);
      }
      
      // 3. Trigger the selected payment handler
      if (paymentMethod === 'loyalty') {
        await handleLoyaltyPayment(bookingId, token);
      } else if (paymentMethod === 'esewa') {
        await handleEsewaPayment(bookingId, token);
      }

    } catch (err) { 
      console.error("Booking failed:", err); 
      console.error("Backend Error Data:", err.response?.data);
      if (err.response?.data?.non_field_errors) {
        setError("This seat is no longer available. Please select another seat.");
      } else {
        setError("Failed to complete booking. Please try again."); 
      }
    } finally { 
      setIsSubmitting(false); 
    } 
  }; 
  
  const getPrice = (seat) => { 
    if (!seat) return 0; 
    if (seat.tier === 'Gold') return 500; 
    return 300; 
  }; 
  
  return ( 
    <div className="min-h-screen bg-[#121212] pt-12 pb-20 px-4 sm:px-6 lg:px-8 font-sans"> 
      <div className="max-w-3xl mx-auto"> 
        <h1 className="text-3xl font-black text-neutral-100 mb-8 border-l-4 border-neutral-600 pl-4">Checkout</h1> 
        {error && ( 
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8"> 
            {error} 
          </div> 
        )} 
        <div className="bg-[#1A1A1A] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl"> 
          <div className="p-8 border-b border-neutral-800 bg-[#121212]"> 
            <div className="flex justify-between items-start mb-6"> 
              <div> 
                <h2 className="text-2xl font-bold text-neutral-100 mb-2">{showtime.movie_title}</h2> 
                <p className="text-neutral-400 hover:text-neutral-100 font-medium"> 
                  {new Date(showtime.start_time).toLocaleString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 
                </p> 
                <p className="text-neutral-400 text-sm mt-1">{showtime.screen_name}</p> 
              </div> 
            </div> 
          </div> 
          <div className="p-8 bg-[#121212]"> 
            <h3 className="text-lg font-bold text-neutral-100 mb-4">Selected Seats</h3> 
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"> 
              {selectedSeats.map(seat => ( 
                <div key={seat.id} className="bg-[#1A1A1A] border border-neutral-800 p-3 rounded-xl flex justify-between items-center"> 
                  <div> 
                    <span className="text-neutral-100 font-bold block">{seat.seat_label}</span> 
                    <span className="text-xs text-neutral-400">{seat.tier}</span> 
                  </div> 
                  <span className="text-neutral-400 hover:text-neutral-100 font-medium">Rs. {getPrice(seat)}</span> 
                </div> 
              ))} 
            </div> 
            <div className="border-t border-neutral-800 pt-6"> 
              <div className="flex justify-between items-center mb-2"> 
                <span className="text-neutral-400">Subtotal</span> 
                <span className="text-neutral-100">Rs. {totalPrice}</span> 
              </div> 
              <div className="flex justify-between items-center mb-6"> 
                <span className="text-neutral-400">Tax & Fees</span> 
                <span className="text-neutral-100">Rs. 0</span> 
              </div> 
              
              <div className="flex justify-between items-center border-t border-neutral-800 pt-4 mb-2"> 
                <span className="text-xl font-bold text-neutral-100">Total Amount</span> 
                <span className="text-3xl font-black text-neutral-100">Rs. {totalPrice}</span> 
              </div>
              <p className="text-right text-sm text-neutral-400 font-medium mb-6">You will earn {selectedSeats.length * 10} points from this booking.</p> 

              {/* Payment Method Selector */}
              <h3 className="text-lg font-bold text-neutral-100 mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* eSewa */}
                <div 
                  onClick={() => setPaymentMethod('esewa')}
                  className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    paymentMethod === 'esewa' 
                    ? 'border-neutral-500 bg-neutral-800/50' 
                    : 'border-neutral-800 bg-[#1A1A1A] hover:border-neutral-600'
                  }`}
                >
                  <span className="font-bold text-neutral-100 text-lg tracking-wide mb-1">eSewa</span>
                  <span className="text-xs text-neutral-400">Digital Wallet</span>
                </div>

                {/* Loyalty Points */}
                <div 
                  onClick={() => {
                    if (canUseLoyalty) setPaymentMethod('loyalty');
                  }}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    !canUseLoyalty 
                    ? 'border-neutral-800 bg-[#121212] opacity-50 cursor-not-allowed'
                    : paymentMethod === 'loyalty' 
                      ? 'border-neutral-500 bg-neutral-800/50 cursor-pointer' 
                      : 'border-neutral-800 bg-[#1A1A1A] hover:border-neutral-600 cursor-pointer'
                  }`}
                >
                  <span className="font-bold text-neutral-100 text-lg tracking-wide mb-1">Loyalty</span>
                  <span className="text-xs text-neutral-400">Bal: {livePoints} pts</span>
                  {!canUseLoyalty && <span className="text-[10px] text-red-400 mt-1">Insufficient</span>}
                </div>
              </div>
            </div> 
          </div> 
          <div className="p-8 border-t border-neutral-800 bg-[#1A1A1A] text-center"> 
            <p className="text-sm text-neutral-400 mb-6">
              {paymentMethod === 'esewa' && "You will be redirected to eSewa to complete your payment securely."}
              {paymentMethod === 'loyalty' && "Your loyalty points will be deducted to complete this booking."}
            </p> 
            <button 
              onClick={(e) => handleCheckout(e)} 
              disabled={isSubmitting} 
              className={`w-full bg-neutral-100 hover:bg-neutral-300 text-[#121212] font-bold py-4 px-6 rounded-xl flex justify-center items-center gap-2 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} 
            > 
              {isSubmitting ? ( 
                <> 
                  <svg className="animate-spin h-5 w-5 text-[#121212]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 
                  Processing... 
                </> 
              ) : ( 
                `Complete Booking`
              )} 
            </button> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}; 

export default Checkout;
