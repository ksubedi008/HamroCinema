import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const UserBookingHistory = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingBookingId, setPayingBookingId] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const paymentStatus = queryParams.get('payment');
  let successMessage = location.state?.successMessage;
  let errorMessage = null;

  if (paymentStatus === 'success') {
    successMessage = "Payment successful! Your tickets are confirmed and you've earned Loyalty Points.";
  } else if (paymentStatus === 'failed') {
    errorMessage = "Payment failed or was cancelled. Your booking remains pending.";
  } else if (paymentStatus === 'signature_failed') {
    errorMessage = "Payment verification failed due to invalid signature.";
  } else if (paymentStatus === 'error') {
    errorMessage = "An error occurred while verifying your payment.";
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch bookings (backend automatically filters to the logged-in user)
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/`);
        // Fetch all tickets to map to bookings
        // A more optimized backend would serialize tickets inside bookings,
        // but we can just fetch tickets and filter here for now.
        const ticketsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tickets/`);
        // Also need showtimes to display details
        const stRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/showtimes/`);

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

  const handlePayNow = async (bookingId) => {
    setPayingBookingId(bookingId);
    try {
      const token = sessionStorage.getItem('authTokens') ? JSON.parse(sessionStorage.getItem('authTokens')).access : null; 
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
    } catch (err) {
      console.error("Payment initiation failed", err);
      alert("Failed to initiate payment. Please try again later.");
      setPayingBookingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-40"><div className="w-12 h-12 border-4 border-neutral-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#121212] pt-12 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {successMessage && (
          <div className="bg-[#1A1A1A] border border-neutral-800 text-neutral-300 p-4 rounded-xl mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-black text-neutral-100 mb-8 border-l-4 border-amber-500 pl-4">Booking History</h1>

        {bookings.length === 0 ? (
          <div className="bg-[#121212] border border-neutral-800 p-12 rounded-3xl text-center">
            <div className="w-20 h-20 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-neutral-400 hover:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-100 mb-2">No tickets yet</h2>
            <p className="text-neutral-400 mb-6">Looks like you haven't booked any movies yet.</p>
            <Link to="/" className="btn-premium px-6 py-3 rounded-full inline-block">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-[#1A1A1A] border border-neutral-800 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-md mb-6">
                
                {/* Left Side: Movie Info */}
                <div className="p-6 md:p-8 flex-1 border-b border-dashed md:border-b-0 md:border-r border-gray-600">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-semibold text-neutral-100">{booking.showtime.movie_title}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.payment_status === 'Completed' ? 'bg-[#1A1A1A] text-green-400 border border-green-900/50' : 
                        booking.payment_status === 'Pending' ? 'bg-[#1A1A1A] text-yellow-400 border border-yellow-900/50' :
                        booking.payment_status === 'Expired' ? 'bg-[#1A1A1A] text-neutral-500 border border-neutral-800' :
                        'bg-[#1A1A1A] text-red-400 border border-red-900/50'
                      }`}>
                        {booking.payment_status}
                      </span>
                      {booking.payment_status === 'Pending' && (
                        <button
                          onClick={() => handlePayNow(booking.id)}
                          disabled={payingBookingId === booking.id}
                          className="bg-white text-black px-4 py-1.5 rounded text-sm font-bold hover:bg-neutral-200 transition-colors duration-200 ease-in-out disabled:opacity-50"
                        >
                          {payingBookingId === booking.id ? 'Processing...' : 'Pay Now'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-neutral-300">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-neutral-400 hover:text-neutral-100 transition-colors duration-200 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(booking.showtime.start_time).toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-neutral-400 hover:text-neutral-100 transition-colors duration-200 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      {booking.showtime.screen_name}
                    </p>
                  </div>
                </div>

                {/* Right Side: Ticket Details & QR */}
                <div className="p-6 md:p-8 w-full md:w-auto bg-[#1A1A1A] flex flex-col md:flex-row gap-6 md:gap-8 justify-between">
                  <div className="flex flex-col justify-between min-w-[200px]">
                    <div>
                      <p className="text-neutral-400 text-sm mb-3">Seats ({booking.tickets.length})</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {booking.tickets.map(t => (
                          <span key={t.id} className="px-3 py-1 bg-[#1A1A1A] text-neutral-300 rounded text-sm font-medium">
                            {t.seat_label}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-neutral-800 pt-4">
                      <div className="text-xs text-neutral-400">
                        <p>Booking ID: #{booking.id}</p>
                        <p>{new Date(booking.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-medium text-neutral-100">Rs. {booking.total_amount}</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center border-t border-dashed md:border-t-0 md:border-l border-gray-600 pt-6 md:pt-0 md:pl-8">
                    {booking.payment_status === 'Completed' ? (
                      <>
                        <div className="bg-white p-2 rounded-md">
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
                        <p className="text-xs text-neutral-400 mt-3 font-medium uppercase tracking-wider text-center">Scan at Entry</p>
                      </>
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center border-2 border-dashed border-neutral-700 rounded-md">
                        <p className="text-xs text-neutral-500 text-center px-2">QR Code Unavailable</p>
                      </div>
                    )}
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

export default UserBookingHistory;
