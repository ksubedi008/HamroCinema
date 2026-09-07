import React, { useState, useEffect } from 'react';

const SEAT_ROWS = 5;
const SEAT_COLS = 15;
const MAX_SEATS = 5;

// Helper to generate dummy seats
const generateDummySeats = () => {
    const seats = [];
    const statuses = ['Available', 'Booked', 'Locked'];
    for (let r = 0; r < SEAT_ROWS; r++) {
        const rowLabel = String.fromCharCode(65 + r); // A, B, C, D, E
        for (let c = 1; c <= SEAT_COLS; c++) {
            // Assign statuses with a high probability for 'Available' for UI testing
            const randomStatus = Math.random() < 0.7 
                ? 'Available' 
                : statuses[Math.floor(Math.random() * statuses.length)];
            
            seats.push({
                id: `${rowLabel}${c}`,
                seatNumber: `${rowLabel}${c}`,
                status: randomStatus
            });
        }
    }
    return seats;
};

const SeatGrid = () => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        setSeats(generateDummySeats());
    }, []);

    const handleSeatClick = (seat) => {
        if (seat.status === 'Booked' || seat.status === 'Locked') return;

        const isSelected = selectedSeats.includes(seat.id);
        
        if (isSelected) {
            // Unselect
            setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
        } else {
            // Select
            if (selectedSeats.length >= MAX_SEATS) {
                alert(`You can only select up to ${MAX_SEATS} seats per transaction.`);
                return;
            }
            setSelectedSeats([...selectedSeats, seat.id]);
        }
    };

    const getSeatClasses = (seat) => {
        const isSelected = selectedSeats.includes(seat.id);
        
        // Base seat styles: little curved top, flat bottom to look like a cinema chair
        const baseClasses = "w-8 h-8 md:w-10 md:h-10 rounded-t-xl rounded-b-sm flex items-center justify-center text-xs font-bold transition-all duration-300 ease-out cursor-pointer relative";
        
        if (isSelected) {
            // "Anti-Gravity" Selected State
            return `${baseClasses} bg-cyan-500 text-slate-900 -translate-y-2 shadow-[0_10px_20px_rgba(6,182,212,0.6)]`;
        }
        
        switch (seat.status) {
            case 'Available':
                // Hover anti-gravity effect
                return `${baseClasses} bg-slate-700 text-slate-400 hover:bg-slate-600 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(255,255,255,0.15)] hover:text-white`;
            case 'Booked':
                // Disabled, darkened out state
                return `${baseClasses} bg-slate-800/60 text-transparent opacity-40 cursor-not-allowed`;
            case 'Locked':
                // Warning locked state
                return `${baseClasses} bg-orange-600/60 text-orange-300 animate-pulse cursor-not-allowed border border-orange-500/50 shadow-[0_0_15px_rgba(234,88,12,0.3)]`;
            default:
                return baseClasses;
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8 flex flex-col items-center justify-center font-sans overflow-x-hidden">
            {/* Glassmorphism Container */}
            <div className="w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
                
                {/* Subtle background glow for extra cinema vibe */}
                <div className="absolute top-[-10%] left-[20%] w-[60%] h-[30%] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                {/* Curved Neon Cinema Screen */}
                <div className="w-full flex flex-col items-center mb-20 relative">
                    {/* The Curve */}
                    <div className="w-full md:w-3/4 h-8 border-t-4 border-cyan-400 rounded-t-[50%] blur-[2px] absolute top-0 shadow-[0_-10px_40px_rgba(34,211,238,0.5)]"></div>
                    <div className="w-full md:w-3/4 h-8 border-t-[3px] border-cyan-300 rounded-t-[50%] absolute top-0"></div>
                    {/* Screen reflection glow */}
                    <div className="w-3/4 h-24 bg-gradient-to-b from-cyan-500/20 to-transparent absolute top-0 blur-xl"></div>
                    
                    <p className="mt-12 text-cyan-400/80 uppercase tracking-[0.3em] text-sm font-semibold glow-text">
                        Screen This Way
                    </p>
                </div>

                {/* Seat Grid */}
                <div className="flex flex-col items-center gap-3 mb-16 overflow-x-auto pb-8 scrollbar-hide">
                    {Array.from({ length: SEAT_ROWS }).map((_, rowIndex) => {
                        const rowSeats = seats.slice(rowIndex * SEAT_COLS, (rowIndex + 1) * SEAT_COLS);
                        const rowLabel = String.fromCharCode(65 + rowIndex);
                        
                        return (
                            <div key={rowIndex} className="flex items-center gap-2 md:gap-3 group">
                                {/* Left Row Label */}
                                <div className="w-8 flex items-center justify-center text-slate-500 font-bold mr-2 group-hover:text-cyan-400 transition-colors">
                                    {rowLabel}
                                </div>
                                
                                {/* Seats in Row */}
                                {rowSeats.map(seat => (
                                    <div 
                                        key={seat.id} 
                                        className={getSeatClasses(seat)}
                                        onClick={() => handleSeatClick(seat)}
                                        title={`${seat.seatNumber} (${seat.status})`}
                                    >
                                        {/* Minor detailing to look more like a seat */}
                                        <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-3/4 h-1.5 rounded-full bg-white/10 pointer-events-none"></div>
                                        {/* Only show seat number on Selected or Available hover (achieved via tailwind classes) */}
                                        <span className="opacity-0 md:opacity-100">{seat.seatNumber}</span>
                                    </div>
                                ))}

                                {/* Right Row Label */}
                                <div className="w-8 flex items-center justify-center text-slate-500 font-bold ml-2 group-hover:text-cyan-400 transition-colors">
                                    {rowLabel}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-8 mb-10 border-t border-white/5 pt-8">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-slate-700 rounded-t-md shadow-[0_2px_5px_rgba(255,255,255,0.05)]"></div>
                        <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Available</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-cyan-500 rounded-t-md shadow-[0_0_15px_rgba(6,182,212,0.6)]"></div>
                        <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Selected</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-orange-600/60 border border-orange-500/50 rounded-t-md animate-pulse"></div>
                        <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Locked</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-slate-800/60 rounded-t-md"></div>
                        <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Booked</span>
                    </div>
                </div>

                {/* Checkout Summary Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900/80 p-6 md:p-8 rounded-3xl border border-white/5 backdrop-blur-md">
                    <div className="mb-6 md:mb-0 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                            Tickets Selected: <span className="text-cyan-400">{selectedSeats.length}</span>
                        </h3>
                        <p className="text-slate-400 text-sm">
                            {selectedSeats.length > 0 
                                ? <span className="font-medium text-slate-300">Seats: {selectedSeats.join(', ')}</span> 
                                : 'Select seats from the grid to proceed.'}
                        </p>
                    </div>
                    
                    <button 
                        disabled={selectedSeats.length === 0}
                        className={`px-10 py-4 rounded-full font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                            selectedSeats.length === 0 
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] hover:-translate-y-1'
                        }`}
                    >
                        Checkout
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SeatGrid;
