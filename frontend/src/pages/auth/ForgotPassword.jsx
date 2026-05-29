import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const response = await axios.post('http://localhost:8000/api/auth/password-reset/', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError("Failed to send reset email. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0d0914] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-600"></div>
                    <h2 className="text-3xl font-extrabold text-white tracking-wider">HamroCinema</h2>
                </div>
                <h2 className="text-center text-xl font-medium text-gray-300">Reset your password</h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#1a1225] py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-purple-900/30">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {message && (
                            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-xl text-sm text-center">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Email address</label>
                            <div className="mt-1">
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-purple-900/30 rounded-xl shadow-sm bg-[#0d0914] text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-[#0d0914] transition-colors disabled:opacity-50">
                                {loading ? 'Sending...' : 'Send reset link'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Remember your password? <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
