import React, { useMemo } from 'react'; 

const OpenGraphPreview = ({ title, genre, description, poster }) => { 
  // Generate an object URL if the poster is a new File upload, otherwise use the existing URL string 
  const posterUrl = useMemo(() => { 
    if (!poster) return ''; 
    if (poster instanceof File) { 
      return URL.createObjectURL(poster); 
    } 
    return poster; // If editing, it's a standard URL 
  }, [poster]); 
  
  const displayTitle = title || "Movie Title"; 
  const displayDesc = description || "A brief synopsis of the movie will appear here when shared on social media."; 
  
  return ( 
    <div className="mt-6 flex flex-col space-y-3 p-4 rounded-2xl bg-black/20 border border-neutral-800"> 
      <div className="flex items-center gap-2"> 
        <svg className="w-5 h-5 text-neutral-400 hover:text-neutral-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /> 
        </svg> 
        <label className="text-sm font-bold tracking-wider uppercase text-neutral-400 hover:text-neutral-100">Social Share Preview</label> 
      </div> 
      <div className="w-full mx-auto overflow-hidden rounded-xl bg-[#1A1A1A] border border-neutral-800 shadow-lg transition-all duration-200 ease-in-out"> 
        {/* 1.91:1 Aspect Ratio Image Container */} 
        <div className="w-full aspect-[1.91/1] bg-[#121212] relative border-b border-neutral-800 flex items-center justify-center overflow-hidden"> 
          {posterUrl ? ( 
            <img src={posterUrl} alt="Preview" className="w-full h-full object-cover" /> 
          ) : ( 
            <div className="text-gray-600 flex flex-col items-center gap-2"> 
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> 
              </svg> 
              <span className="text-xs font-medium uppercase tracking-widest">No Poster Selected</span> 
            </div> 
          )} 
          {/* Optional Genre Badge floating on the poster */} 
          {genre && ( 
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#1A1A1A]/90 rounded-lg border border-neutral-800 text-[10px] font-bold text-neutral-100 tracking-widest uppercase"> 
              {genre} 
            </div> 
          )} 
        </div> 
        {/* Bottom Text Area */} 
        <div className="p-4 bg-[#1A1A1A] flex flex-col gap-1"> 
          <p className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">hamrocinema.com</p> 
          <h4 className="text-base font-bold text-neutral-100 truncate">{displayTitle}</h4> 
          <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">{displayDesc}</p> 
        </div> 
      </div> 
    </div> 
  ); 
}; 

export default OpenGraphPreview;
