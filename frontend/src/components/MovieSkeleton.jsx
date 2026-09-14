import React from 'react';

const MovieSkeleton = () => {
    return (
        <div className="block group relative rounded-xl md:rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
            {/* Poster Skeleton */}
            <div className="aspect-[2/3] w-full relative bg-stone-900 animate-pulse overflow-hidden border-b border-stone-800">
                {/* Subtle Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-stone-700/10 via-transparent to-stone-800/10"></div>
            </div>
            
            {/* Text Content Skeleton */}
            <div className="p-3 md:p-4 relative z-10 bg-gradient-to-t from-stone-950 to-stone-950/90">
                <div className="h-5 md:h-6 bg-stone-800/50 rounded-md w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 md:h-4 bg-stone-800/30 rounded-md w-1/2 animate-pulse"></div>
            </div>
        </div>
    );
};

export default MovieSkeleton;
