import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import AlertMessage from '../../components/AlertMessage';

const EditProfile = () => {
  const { user, authTokens, updateUserProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', phone_number: '', email: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [removeProfilePicture, setRemoveProfilePicture] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/me/`, {
          headers: { 'Authorization': `Bearer ${authTokens.access}` }
        });
        const data = response.data;
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone_number: data.phone_number || '',
          email: data.email || ''
        });
        if (data.profile_picture) {
          const picUrl = data.profile_picture.startsWith('http') ? data.profile_picture : `${import.meta.env.VITE_API_BASE_URL}${data.profile_picture}`;
          setPreviewImage(picUrl);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data.');
      }
    };
    if (authTokens) { fetchProfile(); }
  }, [authTokens]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
      setRemoveProfilePicture(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
    setProfilePicture(null);
    setRemoveProfilePicture(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');
    
    const updateData = new FormData();
    updateData.append('first_name', formData.first_name);
    updateData.append('last_name', formData.last_name);
    updateData.append('phone_number', formData.phone_number);
    updateData.append('email', formData.email);
    
    if (profilePicture) {
      updateData.append('profile_picture', profilePicture);
    } else if (removeProfilePicture) {
      updateData.append('remove_profile_picture', 'true');
    }
    
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/users/me/`, updateData, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Profile updated successfully!');
      
      // Format the updated data for context
      const updatedContextData = {
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        phone_number: response.data.phone_number,
        profile_picture: response.data.profile_picture
      };
      
      updateUserProfile(updatedContextData);
      
      if (response.data.profile_picture) {
        const picUrl = response.data.profile_picture.startsWith('http') ? response.data.profile_picture : `${import.meta.env.VITE_API_BASE_URL}${response.data.profile_picture}`;
        setPreviewImage(picUrl);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h2 className="text-3xl font-black text-neutral-100 mb-8 border-l-4 border-neutral-600 pl-4">My Profile</h2>
          {message && (
            <div className="mb-6"><AlertMessage message={message} type="success" /></div>
          )}
          {error && (
            <div className="mb-6"><AlertMessage message={error} type="error" /></div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b border-neutral-800">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#1A1A1A] border-2 border-zinc-700 overflow-hidden flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-12 h-12 text-zinc-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-zinc-700 hover:bg-neutral-600 text-neutral-100 p-2 rounded-full cursor-pointer transition-colors duration-200 ease-in-out shadow-lg border border-zinc-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <input type="file" name="profile_picture" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <div className="flex-1 text-center sm:text-left mt-2 flex flex-col items-center sm:items-start">
                <h3 className="text-xl font-bold text-neutral-100 mb-1">Profile Picture</h3>
                <p className="text-sm text-neutral-400 mb-4">Upload a high-quality image. JPG, PNG or WebP.</p>
                {previewImage && (
                  <button type="button" onClick={handleRemovePhoto} className="text-xs font-bold text-neutral-400 hover:text-neutral-100 transition-colors duration-200 ease-in-out uppercase tracking-widest border border-neutral-600/30 hover:border-neutral-600/60 rounded-full px-4 py-1.5">
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 placeholder-zinc-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-white/20 transition-all duration-200 ease-in-out" placeholder="Enter your first name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 placeholder-zinc-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-white/20 transition-all duration-200 ease-in-out" placeholder="Enter your last name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 placeholder-zinc-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-white/20 transition-all duration-200 ease-in-out" placeholder="your.email@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Phone Number</label>
                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full bg-[#121212] border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 placeholder-zinc-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-white/20 transition-all duration-200 ease-in-out" placeholder="e.g. 98XXXXXXXX" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-neutral-800 mt-6">
              <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl flex items-center justify-center font-bold text-sm uppercase tracking-widest transition-all duration-200 ease-in-out ${isSubmitting ? 'bg-[#1A1A1A] text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 shadow-lg'}`}>
                {isSubmitting ? (
                  <svg className="w-5 h-5 animate-spin text-zinc-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EditProfile;
