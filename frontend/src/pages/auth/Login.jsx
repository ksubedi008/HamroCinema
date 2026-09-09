import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { loginUser, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await loginUser(username, password);
        if (result.success) {
            if (result.user.role === 'Admin' || result.user.role === 'Manager') {
                logoutUser();
                setError("Administrators must use the secure staff portal to authenticate");
            } else {
                navigate('/');
            }
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0914] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-600"></div>
                    <h2 className="text-3xl font-extrabold text-white tracking-wider">HamroCinema</h2>
                </div>
                <h2 className="text-center text-xl font-medium text-gray-300">Sign in to your account</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#1a1225] py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-purple-900/30">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Username</label>
                            <div className="mt-1">
                                <input value={username} onChange={e => setUsername(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-purple-900/30 rounded-xl shadow-sm bg-[#0d0914] text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400">Password</label>
                            <div className="mt-1 relative">
                                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="appearance-none block w-full px-4 py-3 pr-12 border border-purple-900/30 rounded-xl shadow-sm bg-[#0d0914] text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-purple-400 hover:text-purple-300">Forgot your password?</Link>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-[#0d0914] transition-colors">
                                Sign in
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account? <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300">Register here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
