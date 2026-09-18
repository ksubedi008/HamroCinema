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
    
    let seatClass = "w-8 h-8 md:w-10 md:h-10 rounded-t-xl rounded-b-md cursor-pointer transition-all duration-200 ease-in-out flex items-center justify-center text-[10px] md:text-xs font-bold "; 
    
    if (isBooked) { 
      seatClass += "bg-[#1A1A1A] text-zinc-600 cursor-not-allowed border border-zinc-700"; 
    } else if (isSelected) { 
      seatClass += "bg-emerald-500 border border-emerald-500 text-black scale-105 z-10"; 
    } else if (isVIP) { 
      seatClass += "bg-indigo-900/40 border border-indigo-500/70 text-indigo-300 hover:bg-indigo-800/60"; 
    } else { 
      seatClass += "bg-transparent border border-gray-500 text-neutral-300 hover:bg-[#1A1A1A] hover:border-gray-400"; 
    } 
    
    return ( 
      <div key={seat.id} className={seatClass} onClick={() => !isBooked && onSeatClick(seat)} title={`${seat.seat_label} - Rs. ${getPrice(seat)}`} > 
        {seat.seat_label} 
      </div> 
    ); 
  }; 
  
  return ( 
    <div className="flex flex-col items-center"> 
      {/* The Screen */} 
      <div className="mb-16 relative w-full max-w-2xl mx-auto flex flex-col items-center"> 
        <div className="h-6 md:h-10 w-full mx-auto border-t-4 border-gray-600 rounded-t-[50%]"></div> 
        <p className="text-center text-neutral-400 text-sm font-medium mt-2">Screen</p> 
      </div> 
      {/* Seat Grid */} 
      <div className="overflow-x-auto w-full pb-8 custom-scrollbar"> 
        <div className="flex flex-col gap-3 items-center min-w-max mx-auto px-4"> 
          {Array.from({ length: rows }).map((_, rIndex) => ( 
            <div key={rIndex} className="flex items-center gap-1 md:gap-2"> 
              <span className="text-zinc-600 font-bold w-6 text-center text-xs md:text-sm mr-2">{rIndex + 1}</span> 
              <div className="flex gap-1 md:gap-2"> 
                {Array.from({ length: cols }).map((_, cIndex) => renderSeat(rIndex + 1, cIndex + 1) )} 
              </div> 
              <span className="text-zinc-600 font-bold w-6 text-center text-xs md:text-sm ml-2">{rIndex + 1}</span> 
            </div> 
          ))} 
        </div> 
      </div> 
      {/* Legend */} 
      <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 pt-8 border-t border-neutral-800/50 w-full"> 
        <div className="flex items-center gap-3"> 
          <div className="w-6 h-6 bg-indigo-900/40 border border-indigo-500/70 rounded-t-md"></div> 
          <span className="text-sm text-neutral-400 font-medium tracking-wide">Premium (Rs. 500)</span> 
        </div> 
        <div className="flex items-center gap-3"> 
          <div className="w-6 h-6 bg-transparent border border-gray-500 rounded-t-md"></div> 
          <span className="text-sm text-neutral-400 font-medium tracking-wide">Standard (Rs. 300)</span> 
        </div> 
        <div className="flex items-center gap-3"> 
          <div className="w-6 h-6 bg-emerald-500 border border-emerald-500 rounded-t-md"></div> 
          <span className="text-sm text-neutral-400 font-medium tracking-wide">Selected</span> 
        </div> 
        <div className="flex items-center gap-3"> 
          <div className="w-6 h-6 bg-[#1A1A1A] border border-zinc-700 rounded-t-md"></div> 
          <span className="text-sm text-neutral-400 font-medium tracking-wide">Booked</span> 
        </div> 
      </div> 
    </div> 
  ); 
}; 

export default CinemaSeatMap;
