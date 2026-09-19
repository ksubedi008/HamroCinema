import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import MovieSkeleton from '../../components/MovieSkeleton';

const ComingSoon = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/movies/`);
        const activeMovies = res.data.filter(m => m.is_active);
        setMovies(activeMovies.filter(m => m.status === 'Coming Soon'));
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#121212] pt-24 pb-20">
      <SEO title="Coming Soon | HamroCinema" description="Check out the upcoming movies at HamroCinema." />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-neutral-100 border-l-4 border-neutral-600 pl-4 uppercase tracking-widest">
            Coming Soon
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <MovieSkeleton key={i} />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
              <motion.div key={movie.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                <Link to={`/movie/${movie.id}`} className="block group relative rounded-xl overflow-hidden bg-[#1A1A1A] border border-neutral-800 hover:border-neutral-600 transition-all duration-200 hover:shadow-xl">
                  <div className="aspect-[2/3] w-full relative">
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-200" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-800/30 to-[#1A1A1A] flex items-center justify-center text-neutral-500 text-sm">No Poster</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-6 py-2 bg-neutral-800 text-neutral-300 font-bold rounded-full border border-neutral-700 mb-2 text-sm">Coming Soon</span>
                      <span className="text-neutral-100 font-bold bg-black/50 px-4 py-1 rounded-full text-sm">View Info</span>
                    </div>
                  </div>
                  <div className="p-4 relative z-10 bg-[#1A1A1A]">
                    <h3 className="font-bold text-neutral-100 text-lg truncate mb-1">{movie.title}</h3>
                    <p className="text-sm text-neutral-400 font-medium truncate mb-1">
                      Releases: {new Date(movie.release_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-neutral-400 truncate">{movie.genre}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">No upcoming movies scheduled at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoon;
