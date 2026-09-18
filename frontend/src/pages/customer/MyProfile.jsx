import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const MyProfile = () => {
  const { authTokens, fetchCurrentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [livePoints, setLivePoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await fetchCurrentUser(); // Silently re-fetch global user profile
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/me/`,
          { headers: { Authorization: `Bearer ${authTokens.access}` } },
        );
        setProfile(response.data);
        setLivePoints(response.data.loyalty_points);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    if (authTokens) {
      fetchProfile();
    }
  }, [authTokens]);
  if (loading) {
    return (
      <div className="flex justify-center py-40 min-h-screen">
        {" "}
        <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>{" "}
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        {" "}
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-6 py-4 rounded-lg text-lg font-medium">
          {" "}
          {error || "Could not load profile"}{" "}
        </div>{" "}
      </div>
    );
  }
  const memberSince = new Date(profile.date_joined).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" },
  );
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
    >
      {" "}
      <div className="bg-[#1A1A1A] border border-neutral-800 rounded-3xl shadow-xl overflow-hidden">
        {" "}
        {/* Header Section */}{" "}
        <div className="p-8 sm:p-12 border-b border-dashed border-zinc-700 flex flex-col md:flex-row items-center md:items-start gap-8">
          {" "}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#1A1A1A] border-4 border-zinc-700 overflow-hidden flex-shrink-0 shadow-lg flex items-center justify-center">
            {" "}
            {profile.profile_picture ? (
              <img
                src={
                  profile.profile_picture.startsWith("http")
                    ? profile.profile_picture
                    : `${import.meta.env.VITE_API_BASE_URL}${profile.profile_picture}`
                }
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-black text-zinc-600">
                {profile.username[0].toUpperCase()}
              </span>
            )}{" "}
          </div>{" "}
          <div className="flex-1 text-center md:text-left flex flex-col justify-center">
            {" "}
            <h2 className="text-3xl md:text-4xl font-black text-neutral-100 mb-2">
              {" "}
              {profile.first_name || profile.last_name
                ? `${profile.first_name} ${profile.last_name}`.trim()
                : profile.username}{" "}
            </h2>{" "}
            <div className="flex flex-col gap-2 mt-4 text-neutral-400 font-medium">
              {" "}
              <div className="flex items-center justify-center md:justify-start gap-3">
                {" "}
                <svg
                  className="w-5 h-5 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>{" "}
                {profile.email}{" "}
              </div>{" "}
              <div className="flex items-center justify-center md:justify-start gap-3">
                {" "}
                <svg
                  className="w-5 h-5 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>{" "}
                {profile.phone_number || "No phone number added"}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex-shrink-0 mt-4 md:mt-0">
            {" "}
            <Link
              to="/edit-profile"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors duration-200 ease-in-out shadow-lg"
            >
              {" "}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>{" "}
              Edit Profile{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
        {/* Statistics Grid */}{" "}
        <div className="p-8 sm:p-12 bg-[#121212]/50">
          {" "}
          <h3 className="text-lg font-bold text-neutral-100 mb-8 tracking-wide uppercase">
            Account Statistics
          </h3>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {" "}
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-neutral-800 text-center flex flex-col justify-center shadow-md">
              {" "}
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">
                Loyalty Points
              </p>{" "}
              <p className="text-3xl font-black text-neutral-100">
                {livePoints}
              </p>{" "}
              <p className="text-xs text-neutral-500 font-normal mt-1">
                Includes promotional gifts
              </p>
            </div>{" "}
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-neutral-800 text-center flex flex-col justify-center shadow-md">
              {" "}
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">
                Total Bookings
              </p>{" "}
              <p className="text-3xl font-black text-neutral-100">
                {profile.total_bookings}
              </p>{" "}
            </div>{" "}
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-neutral-800 text-center flex flex-col justify-center shadow-md">
              {" "}
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">
                Member Since
              </p>{" "}
              <p className="text-xl font-bold text-neutral-100 mt-1">
                {memberSince}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </motion.div>
  );
};
export default MyProfile;
