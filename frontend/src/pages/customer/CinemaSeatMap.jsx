import React from 'react';

const CinemaSeatMap = ({ seats, bookedTickets, selectedSeats, onSeatClick, getPrice, showtime }) => {
    // We expect seats to have seat_label like 'L1-1', 'M3-2', 'R5-1'
    // Let's create a quick lookup map
    const seatMap = {};
    seats.forEach(seat => {
        seatMap[seat.seat_label] = seat;
    });

    const rows = 10;
    const cols = 9; // L(2), Aisle(1), M(3), Aisle(1), R(2)

    const renderSeat = (row, col) => {
        let label = '';
        if (col <= 2) {
            label = `L${row}-${col}`;
        } else if (col >= 4 && col <= 6) {
            if (row > 2) {
                label = `M${row}-${col - 3}`;
            } else {
                return <div key={`${row}-${col}`} className="w-8 h-8 md:w-10 md:h-10"></div>; // Cavity
            }
        } else if (col >= 8) {
            label = `R${row}-${col - 7}`;
        } else {
            return <div key={`${row}-${col}`} className="w-4 md:w-6"></div>; // Aisle
        }

        const seat = seatMap[label];
        if (!seat) {
            // If the seat doesn't exist in backend data, render a placeholder invisible block
            return <div key={`${row}-${col}`} className="w-8 h-8 md:w-10 md:h-10 opacity-0"></div>;
        }

        const isBooked = bookedTickets.some(t => t.seat.toString() === seat.id.toString());
        const isSelected = selectedSeats.some(s => s.id === seat.id);
        const isVIP = seat.tier === 'Gold'; // Middle block

        let seatClass = "w-8 h-8 md:w-10 md:h-10 rounded-t-xl rounded-b-md cursor-pointer transition-all flex items-center justify-center text-[10px] md:text-xs font-bold ";
        
        if (isBooked) {
            seatClass += "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-900";
        } else if (isSelected) {
            seatClass += "bg-amber-500 border-2 border-amber-400 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-110 z-10";
        } else if (isVIP) {
            seatClass += "bg-purple-900/40 border border-purple-500/50 text-purple-300 hover:bg-purple-600/60 hover:text-white hover:border-purple-400 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)]";
        } else {
            seatClass += "bg-blue-900/30 border border-blue-500/40 text-blue-300 hover:bg-blue-600/50 hover:text-white hover:border-blue-400 hover:shadow-[0_0_10px_rgba(59,130,246,0.4)]";
        }

        return (
            <div 
                key={seat.id} 
                className={seatClass}
                onClick={() => !isBooked && onSeatClick(seat)}
                title={`${seat.seat_label} - Rs. ${getPrice(seat)}`}
            >
                {seat.seat_label}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center">
            {/* The Screen */}
            <div className="mb-20 relative w-full max-w-2xl mx-auto">
                <div className="h-12 w-full mx-auto bg-gradient-to-b from-blue-500/20 to-transparent rounded-t-[100%] border-t-2 border-blue-500/50 blur-[2px]"></div>
                <div className="h-2 w-3/4 mx-auto bg-zinc-800 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] absolute top-0 left-1/2 -translate-x-1/2"></div>
                <p className="text-center text-zinc-500 text-xs font-black uppercase tracking-[0.3em] mt-6">Screen This Way</p>
            </div>

            {/* Seat Grid */}
            <div className="overflow-x-auto w-full pb-8 custom-scrollbar">
                <div className="flex flex-col gap-3 items-center min-w-max mx-auto px-4">
                    {Array.from({ length: rows }).map((_, rIndex) => (
                        <div key={rIndex} className="flex items-center gap-1 md:gap-2">
                            <span className="text-zinc-600 font-bold w-6 text-center text-xs md:text-sm mr-2">{rIndex + 1}</span>
                            <div className="flex gap-1 md:gap-2">
                                {Array.from({ length: cols }).map((_, cIndex) => 
                                    renderSeat(rIndex + 1, cIndex + 1)
                                )}
                            </div>
                            <span className="text-zinc-600 font-bold w-6 text-center text-xs md:text-sm ml-2">{rIndex + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 pt-8 border-t border-zinc-800/50 w-full">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-900/40 border border-purple-500/50 rounded-t-md"></div>
                    <span className="text-xs text-zinc-400 font-medium tracking-wider">Premium (Rs. 500)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-900/30 border border-blue-500/40 rounded-t-md"></div>
                    <span className="text-xs text-zinc-400 font-medium tracking-wider">Standard (Rs. 300)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-amber-500 border border-amber-400 rounded-t-md"></div>
                    <span className="text-xs text-zinc-400 font-medium tracking-wider">Selected</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-zinc-800 border border-zinc-900 rounded-t-md"></div>
                    <span className="text-xs text-zinc-400 font-medium tracking-wider">Booked</span>
                </div>
            </div>
        </div>
    );
};

export default CinemaSeatMap;
