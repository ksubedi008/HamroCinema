import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import AlertMessage from '../../components/AlertMessage';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const MyTickets = () => {
  const { authTokens } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useDocumentTitle('My Tickets | HamroCinema');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/me/tickets/`,
          { headers: { 'Authorization': `Bearer ${authTokens.access}` } }
        );
        setTickets(response.data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    };
    if (authTokens) {
      fetchTickets();
    }
  }, [authTokens]);

  if (loading) {
    return (
      <div className="flex justify-center py-40 min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
        <h2 className="text-3xl font-bold text-neutral-100">My Tickets</h2>
      </div>

      {error && (
        <div className="mb-6"><AlertMessage message={error} type="error" /></div>
      )}

      {tickets.length === 0 && !error ? (
        <div className="text-center py-20 bg-[#1A1A1A] border border-neutral-800 rounded-2xl">
          <svg className="w-16 h-16 text-zinc-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <h3 className="text-xl font-bold text-neutral-100 mb-2">No tickets found</h3>
          <p className="text-neutral-400">You haven't booked any movies yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="flex flex-col md:flex-row bg-[#1A1A1A] rounded-2xl overflow-hidden border border-neutral-800 shadow-xl">
              {/* Left Side: Movie Details */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col md:flex-row gap-6">
                {ticket.poster ? (
                  <img src={ticket.poster} alt={ticket.movie_title} className="w-24 h-36 object-cover rounded-lg shadow-md hidden sm:block" />
                ) : (
                  <div className="w-24 h-36 bg-[#1A1A1A] rounded-lg flex items-center justify-center hidden sm:flex">
                    <span className="text-zinc-600 font-bold">No Image</span>
                  </div>
                )}
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-neutral-100">{ticket.movie_title}</h3>
                      <span className="bg-[#1A1A1A] text-neutral-100 text-xs font-bold px-3 py-1 rounded-full border border-zinc-700">
                        Seat {ticket.seat_label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-6">
                      {ticket.screen_name}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800/50">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-bold">Showtime</p>
                      <p className="text-sm font-semibold text-neutral-100">
                        {new Date(ticket.start_time).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-bold">Purchased on</p>
                      <p className="text-sm font-medium text-neutral-400">
                        {new Date(ticket.purchased_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: QR Code (Separated by dashed border) */}
              <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-dashed border-gray-600 bg-[#1A1A1A] p-6 flex flex-col items-center justify-center relative">
                {/* Semi-circle cutouts */}
                <div className="absolute top-0 -left-3 w-6 h-6 bg-[#121212] rounded-full border-b border-r border-neutral-800 hidden md:block" style={{ transform: 'rotate(-45deg)' }}></div>
                <div className="absolute bottom-0 -left-3 w-6 h-6 bg-[#121212] rounded-full border-t border-r border-neutral-800 hidden md:block" style={{ transform: 'rotate(45deg)' }}></div>
                
                {ticket.payment_status === 'Completed' ? (
                  <>
                    <div className="p-2 bg-white rounded-lg shadow-sm mb-4">
                      <QRCodeSVG value={`TICKET-${ticket.id}-BOOKING-${ticket.booking_id}`} size={120} level="H" />
                    </div>
                    <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
                      {`TCK-${ticket.id.toString().padStart(6, '0')}`}
                    </p>
                  </>
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center border-2 border-dashed border-neutral-700 rounded-md">
                    <p className="text-xs text-neutral-500 text-center px-2">QR Code Unavailable</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyTickets;
