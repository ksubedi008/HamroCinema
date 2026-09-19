import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import AlertMessage from '../../components/AlertMessage';

const ForgotPassword = () => { 
  const [step, setStep] = useState(1); 
  // Step 1 State 
  const [email, setEmail] = useState(''); 
  // Step 2 State 
  const [otpCode, setOtpCode] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  // Shared State 
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate(); 
  
  const handleSendOTP = async (e) => { 
    e.preventDefault(); 
    setIsSubmitting(true); 
    setMessage(''); 
    setError(''); 
    try { 
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-otp/`, { email }); 
      setMessage(response.data.message); 
      setStep(2); 
    } catch (err) { 
      setError(err.response?.data?.error || "Unable to process request at this time. Please try again."); 
    } finally { 
      setIsSubmitting(false); 
    } 
  }; 
  
  const handleVerifyOTP = async (e) => { 
    e.preventDefault(); 
    if (newPassword !== confirmPassword) { 
      setError("Passwords do not match. Please ensure both fields are identical."); 
      return; 
    } 
    setIsSubmitting(true); 
    setMessage(''); 
    setError(''); 
    try { 
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp-reset/`, { email, otp_code: otpCode, new_password: newPassword }); 
      setMessage(response.data.message); 
      // Redirect to login after a short delay 
      setTimeout(() => { navigate('/login'); }, 2000); 
    } catch (err) { 
      setError(err.response?.data?.error || "Password reset failed. Please ensure your OTP is correct."); 
    } finally { 
      setIsSubmitting(false); 
    } 
  }; 
  
  return ( 
    <div className="min-h-screen bg-[#121212] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans"> 
      <div className="sm:mx-auto sm:w-full sm:max-w-md"> 
        <div className="flex justify-center items-center gap-3 mb-6"> 
          <img src={logo} alt="HamroCinema Logo" className="h-10 w-auto invert" /> 
          <h2 className="text-3xl font-extrabold text-neutral-100 tracking-wider">HamroCinema</h2> 
        </div> 
        <h2 className="text-center text-xl font-medium text-neutral-300"> 
          {step === 1 ? "Reset your password" : "Enter Verification Code"} 
        </h2> 
        <p className="mt-2 text-center text-sm text-neutral-400"> 
          {step === 1 ? "Enter your email address and we'll send you a 6-digit OTP code." : `We sent a 6-digit code to ${email}.`} 
        </p> 
      </div> 
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"> 
        <div className="bg-[#121212] py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-neutral-800"> 
          {message && ( 
            <div className="mb-6"><AlertMessage message={message} type="success" /></div>
          )} 
          {error && ( 
            <div className="mb-6"><AlertMessage message={error} type="error" /></div>
          )} 
          {step === 1 ? ( 
            <form className="space-y-6" onSubmit={handleSendOTP}> 
              <div> 
                <label className="block text-sm font-medium text-neutral-400">Email address</label> 
                <div className="mt-1"> 
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-neutral-800 rounded-xl shadow-sm bg-[#121212] text-neutral-100 focus:outline-none focus:ring-white/20 focus:border-neutral-600" /> 
                </div> 
              </div> 
              <div> 
                <button type="submit" disabled={isSubmitting} className={`btn-premium w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 focus:ring-offset-[#0d0914] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}> 
                  {isSubmitting ? ( 
                    <> 
                      <svg className="animate-spin h-5 w-5 text-neutral-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending OTP... 
                    </> 
                  ) : ( "Send OTP" )} 
                </button> 
              </div> 
            </form> 
          ) : ( 
            <form className="space-y-6" onSubmit={handleVerifyOTP}> 
              <div> 
                <label className="block text-sm font-medium text-neutral-400">6-Digit OTP Code</label> 
                <div className="mt-1"> 
                  <input type="text" maxLength="6" placeholder="Enter 6-digit code" value={otpCode} onChange={e => setOtpCode(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-neutral-800 rounded-xl shadow-sm bg-[#121212] text-neutral-100 focus:outline-none focus:ring-white/20 focus:border-neutral-600 tracking-widest text-center text-lg placeholder:tracking-normal placeholder:text-sm placeholder:text-zinc-600" /> 
                </div> 
              </div> 
              <div> 
                <label className="block text-sm font-medium text-neutral-400">New Password</label> 
                <div className="mt-1"> 
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-neutral-800 rounded-xl shadow-sm bg-[#121212] text-neutral-100 focus:outline-none focus:ring-white/20 focus:border-neutral-600" /> 
                </div> 
              </div> 
              <div> 
                <label className="block text-sm font-medium text-neutral-400">Confirm New Password</label> 
                <div className="mt-1"> 
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-neutral-800 rounded-xl shadow-sm bg-[#121212] text-neutral-100 focus:outline-none focus:ring-white/20 focus:border-neutral-600" /> 
                </div> 
              </div> 
              <div> 
                <button type="submit" disabled={isSubmitting} className={`btn-premium w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 focus:ring-offset-[#0d0914] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}> 
                  {isSubmitting ? ( 
                    <> 
                      <svg className="animate-spin h-5 w-5 text-neutral-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Verifying... 
                    </> 
                  ) : ( "Verify & Reset Password" )} 
                </button> 
              </div> 
              <div className="text-center text-sm text-neutral-400"> 
                <button type="button" onClick={() => setStep(1)} className="font-medium text-neutral-400 hover:text-neutral-100"> Back to email input </button> 
              </div> 
            </form> 
          )} 
          <div className="mt-6 text-center text-sm text-neutral-400"> Remember your password? <Link to="/login" className="font-medium text-neutral-400 hover:text-neutral-100">Sign in</Link> </div> 
        </div> 
      </div> 
    </div> 
  ); 
}; 

export default ForgotPassword;
