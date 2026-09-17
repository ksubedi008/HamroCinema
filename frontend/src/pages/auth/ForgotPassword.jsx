import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setError('');
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/password-reset/`, { email });
            setMessage(response.data.message);
        } catch (err) {
            setError("Failed to send reset email. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center items-center gap-3 mb-6">
                    <div className="btn-premium w-10 h-10 rounded-full"></div>
                    <h2 className="text-3xl font-extrabold text-white tracking-wider">HamroCinema</h2>
                </div>
                <h2 className="text-center text-xl font-medium text-gray-300">Reset your password</h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-zinc-950 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-zinc-800">
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
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-zinc-800 rounded-xl shadow-sm bg-zinc-950 text-white focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" disabled={isSubmitting} className={`btn-premium w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:ring-offset-[#0d0914] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Sending...
                                    </>
                                ) : (
                                    "Send reset link"
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Remember your password? <Link to="/login" className="font-medium text-rose-500 hover:text-rose-500">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
