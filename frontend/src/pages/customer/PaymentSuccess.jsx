import React, { useEffect, useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Download, History } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(location.state?.bookingDetails || null);
  const [loading, setLoading] = useState(!location.state?.bookingDetails);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef(null);

  const bookingIdParam = searchParams.get('booking_id');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (booking) return; // Already have data from state
      if (!bookingIdParam) {
        setError('No booking information found.');
        setLoading(false);
        return;
      }

      try {
        const token = sessionStorage.getItem('authTokens') ? JSON.parse(sessionStorage.getItem('authTokens')).access : null;
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingIdParam}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBooking(res.data);
      } catch (err) {
        console.error("Failed to fetch booking:", err);
        setError("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [booking, bookingIdParam]);

  const handleDownloadPDF = async (e) => {
    e.preventDefault();
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      const imgData = await toPng(ticketRef.current, { 
        backgroundColor: '#1A1A1A',
        pixelRatio: 2
      });
      
      const width = ticketRef.current.offsetWidth;
      const height = ticketRef.current.offsetHeight;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [width, height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`HamroCinema_Ticket_${booking.id}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 text-neutral-400 border-4 border-neutral-600 border-t-neutral-100 rounded-full"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4">
        <div className="bg-[#1A1A1A] border border-neutral-800 p-8 rounded-xl max-w-lg w-full text-center">
          <p className="text-red-400 mb-6">{error || 'Booking not found.'}</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-neutral-800 text-neutral-100 rounded-lg hover:bg-neutral-700 transition-colors">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Calculate points earned/spent
  // If eSewa, they earned points. If Loyalty, they spent points.
  const pointsEarned = booking.tickets ? booking.tickets.length * 10 : 0;
  const isLoyaltyPayment = booking.total_amount && booking.payment_status === 'Completed' && !booking.esewa_ref_id; 

  const showtimeDate = new Date(booking.showtime_details?.start_time || new Date());
  
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 font-sans">
      <div className="bg-[#1A1A1A] border border-neutral-800 rounded-xl shadow-2xl max-w-lg w-full text-center overflow-hidden">
        
        {/* Downloadable Area */}
        <div ref={ticketRef} className="p-8 bg-[#1A1A1A]">
          {/* Success Header */}
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-3xl font-black text-neutral-100 mb-2">Payment Successful!</h1>
          <p className="text-neutral-400 mb-8">
            {isLoyaltyPayment 
              ? `Successfully deducted points for this booking.` 
              : `You have earned ${pointsEarned} loyalty points from this booking!`}
          </p>

          {/* Ticket Summary & QR */}
          <div className="bg-[#121212] border border-neutral-800 rounded-lg p-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Movie</p>
                  <p className="text-lg font-bold text-neutral-100">{booking.showtime_details?.movie_title || 'Movie Title'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Date & Time</p>
                  <p className="text-neutral-300 font-medium">
                    {showtimeDate.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Seats</p>
                  <p className="text-neutral-300 font-medium">
                    {booking.tickets?.map(t => t.seat_label).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-white p-3 rounded-lg flex-shrink-0">
                <QRCodeSVG 
                  value={`TICKET-${booking.id}-${booking.user}`} 
                  size={120}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"M"}
                />
              </div>
              
            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="p-8 pt-0 space-y-3">
          <button 
            onClick={handleDownloadPDF}
            disabled={downloading}
            className={`w-full flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-300 text-[#121212] font-bold py-4 px-6 rounded-xl transition-colors ${downloading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {downloading ? (
              <div className="animate-spin h-5 w-5 border-2 border-[#121212] border-t-transparent rounded-full"></div>
            ) : (
              <Download className="w-5 h-5" />
            )}
            {downloading ? 'Generating PDF...' : 'Download Tickets'}
          </button>
          <button 
            onClick={() => navigate('/booking-history')}
            className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-neutral-800 border border-neutral-700 text-neutral-100 font-bold py-4 px-6 rounded-xl transition-colors"
          >
            <History className="w-5 h-5" />
            View Booking History
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;
