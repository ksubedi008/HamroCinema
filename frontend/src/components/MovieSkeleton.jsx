import React from 'react';

const MovieSkeleton = () => {
    return (
        <div className="block group relative rounded-xl md:rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
            {/* Poster Skeleton */}
            <div className="aspect-[2/3] w-full relative bg-purple-900/20 animate-pulse overflow-hidden">
                {/* Subtle Anti-Gravity Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10"></div>
            </div>
            
            {/* Text Content Skeleton */}
            <div className="p-3 md:p-4 relative z-10 bg-gradient-to-t from-[#1a1225] to-[#1a1225]/90">
                <div className="h-5 md:h-6 bg-purple-900/30 rounded-md w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 md:h-4 bg-purple-900/20 rounded-md w-1/2 animate-pulse"></div>
            </div>
        </div>
    );
};

export default MovieSkeleton;
