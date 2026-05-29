import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [nowShowingMovies, setNowShowingMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/movies/`);
                // Only show active movies
                const activeMovies = res.data.filter(m => m.is_active);
                setNowShowingMovies(activeMovies.filter(m => m.status === 'Now Showing' || !m.status));
                setComingSoonMovies(activeMovies.filter(m => m.status === 'Coming Soon'));
            } catch (err) {
                console.error("Error fetching movies:", err);
            }
            setLoading(false);
        };
        fetchMovies();
    }, []);

    const featuredMovie = nowShowingMovies.length > 0 ? nowShowingMovies[0] : null;

    return (
        <div className="w-full pb-20 animate-fade-in">
            {/* Hero Banner */}
            {featuredMovie && (
                <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        {featuredMovie.poster ? (
                            <img src={featuredMovie.poster} alt={featuredMovie.title} className="w-full h-full object-cover opacity-30 md:opacity-40 blur-[4px] md:blur-[2px]" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-[#0d0914] opacity-50"></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0914] via-[#0d0914]/80 to-[#0d0914]/20 md:to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-6 md:gap-12 pt-10 md:pt-20">
                        {featuredMovie.poster && (
                            <img src={featuredMovie.poster} alt={featuredMovie.title} className="hidden md:block w-48 lg:w-64 rounded-2xl shadow-[0_0_30px_rgba(147,51,234,0.3)] border border-purple-500/20" />
                        )}
                        <div className="max-w-2xl text-center md:text-left mt-8 md:mt-0">
                            <span className="px-3 py-1 bg-purple-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full mb-3 md:mb-4 inline-block">Now Showing</span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-3 md:mb-4 drop-shadow-lg">{featuredMovie.title}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 text-xs md:text-sm text-gray-300 font-medium mb-4 md:mb-6">
                                <span>{featuredMovie.duration} mins</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{featuredMovie.genre}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{new Date(featuredMovie.release_date).getFullYear()}</span>
                            </div>
                            <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-8 line-clamp-3 md:line-clamp-4 px-4 md:px-0">{featuredMovie.description}</p>
                            <Link to={`/movie/${featuredMovie.id}`} className="px-6 py-3 md:px-8 md:py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all inline-flex items-center gap-2 text-sm md:text-lg">
                                Book Tickets
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Now Showing Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-purple-600 pl-3 md:pl-4">Now Showing</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {nowShowingMovies.map(movie => (
                            <Link key={movie.id} to={`/movie/${movie.id}`} className="group relative rounded-xl md:rounded-2xl overflow-hidden bg-[#1a1225] border border-purple-900/30 hover:border-purple-500/50 transition-all hover:-translate-y-1 hover:md:-translate-y-2 hover:shadow-[0_10px_30px_rgba(147,51,234,0.2)]">
                                <div className="aspect-[2/3] w-full relative">
                                    {movie.poster ? (
                                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-[#0d0914] flex items-center justify-center text-gray-600 text-xs md:text-base">No Poster</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                                    
                                    {/* Hover Overlay Button */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                        <span className="px-4 py-2 md:px-6 md:py-2 bg-purple-600 text-white font-bold rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)] text-xs md:text-base">Book Now</span>
                                    </div>
                                </div>
                                <div className="p-3 md:p-4 relative z-10 bg-gradient-to-t from-[#1a1225] to-[#1a1225]/90">
                                    <h3 className="font-bold text-white text-base md:text-lg truncate mb-1">{movie.title}</h3>
                                    <p className="text-xs md:text-sm text-gray-400 truncate">{movie.genre}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Coming Soon Section */}
            {comingSoonMovies.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20 relative z-20">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-yellow-500 pl-3 md:pl-4">Coming Soon</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {comingSoonMovies.map(movie => (
                            <Link key={movie.id} to={`/movie/${movie.id}`} className="group relative rounded-xl md:rounded-2xl overflow-hidden bg-[#1a1225] border border-yellow-900/30 hover:border-yellow-500/50 transition-all hover:-translate-y-1 hover:md:-translate-y-2 hover:shadow-[0_10px_30px_rgba(234,179,8,0.2)]">
                                <div className="aspect-[2/3] w-full relative">
                                    {movie.poster ? (
                                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-yellow-900/30 to-[#0d0914] flex items-center justify-center text-gray-600 text-xs md:text-base">No Poster</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                                    
                                    {/* Hover Overlay Button */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                        <span className="px-4 py-1.5 md:px-6 md:py-2 bg-yellow-600/20 text-yellow-500 font-bold rounded-full border border-yellow-500/50 mb-2 text-xs md:text-base text-center">Coming Soon</span>
                                        <span className="text-white font-bold text-xs md:text-sm bg-black/50 px-3 py-1 md:px-4 md:py-1 rounded-full">View Info</span>
                                    </div>
                                </div>
                                <div className="p-3 md:p-4 relative z-10 bg-gradient-to-t from-[#1a1225] to-[#1a1225]/90">
                                    <h3 className="font-bold text-white text-base md:text-lg truncate mb-1">{movie.title}</h3>
                                    <p className="text-[10px] md:text-sm text-yellow-500 font-medium truncate mb-1">
                                        Releases: {new Date(movie.release_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <p className="text-xs md:text-sm text-gray-400 truncate">{movie.genre}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
