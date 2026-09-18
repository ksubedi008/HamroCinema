import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminUserDetailModal = ({ user, isOpen, onClose, onUpdate }) => {
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [editPointsValue, setEditPointsValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditPointsValue(user.loyalty_points || 0);
      setIsEditingPoints(false);
    }
  }, [user]);

  const handleSavePoints = async () => {
    setIsSaving(true);
    try {
      const token = sessionStorage.getItem("authTokens")
        ? JSON.parse(sessionStorage.getItem("authTokens")).access
        : null;
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${user.id}/loyalty-points/`,
        { loyalty_points: parseInt(editPointsValue, 10) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User loyalty points updated successfully");
      setIsEditingPoints(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to update points:", error);
      alert("Failed to update loyalty points.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-100 tracking-wider">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100 transition-colors duration-200 ease-in-out"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#121212] border border-neutral-800 overflow-hidden flex items-center justify-center flex-shrink-0">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-neutral-400 uppercase">
                  {user.username ? user.username[0] : "U"}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-100">
                {user.username}
              </h3>
              <p className="text-sm text-neutral-400">
                {user.email || "No email provided"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#121212] p-4 rounded-xl border border-neutral-800">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                Role
              </p>
              <p className="text-sm font-medium text-neutral-100">
                {user.role || "Customer"}
              </p>
            </div>
            <div className="bg-[#121212] p-4 rounded-xl border border-neutral-800">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                Status
              </p>
              <p className="text-sm font-medium">
                {user.is_active ? (
                  <span className="text-green-400">Active</span>
                ) : (
                  <span className="text-red-400">Suspended</span>
                )}
              </p>
            </div>
            <div className="bg-[#121212] p-4 rounded-xl border border-neutral-800">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                Date Joined
              </p>
              <p className="text-sm font-medium text-neutral-100">
                {new Date(user.date_joined).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-[#121212] p-4 rounded-xl border border-neutral-800">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                Total Bookings
              </p>
              <p className="text-sm font-medium text-neutral-100">
                {user.total_bookings || 0}
              </p>
            </div>
          </div>

          <div className="bg-[#121212] p-4 rounded-xl border border-neutral-800 space-y-3">
            <h4 className="text-xs text-neutral-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
              Additional Info
            </h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400">Loyalty Points</span>
              {isEditingPoints ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editPointsValue}
                    onChange={(e) => setEditPointsValue(e.target.value)}
                    className="w-20 bg-[#121212] border border-neutral-800 rounded px-2 py-1 text-sm text-neutral-100 focus:outline-none focus:border-neutral-500"
                  />
                  <button onClick={handleSavePoints} disabled={isSaving} className="text-xs px-2 py-1 bg-white text-black rounded font-medium hover:bg-neutral-200">
                    {isSaving ? "..." : "Save"}
                  </button>
                  <button onClick={() => setIsEditingPoints(false)} className="text-xs px-2 py-1 bg-[#1A1A1A] text-neutral-400 border border-neutral-800 rounded hover:text-neutral-100 transition-colors duration-200 ease-in-out">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-100">
                    {user.loyalty_points ?? 0}
                  </span>
                  <button onClick={() => setIsEditingPoints(true)} className="text-neutral-400 hover:text-neutral-100 transition-colors duration-200 ease-in-out" title="Edit Points">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-400">Full Name</span>
              <span className="text-sm font-medium text-neutral-100">
                {`${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                  "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-400">Phone</span>
              <span className="text-sm font-medium text-neutral-100">
                {user.phone_number || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white text-black font-medium transition-colors duration-200 ease-in-out hover:bg-neutral-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailModal;
