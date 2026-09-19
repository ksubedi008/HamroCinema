import React, { useState, useEffect } from "react";
import axios from "axios";
const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("unread");
  const [searchTerm, setSearchTerm] = useState("");
  const fetchMessages = async () => {
    try {
      const token = sessionStorage.getItem("authTokens")
        ? JSON.parse(sessionStorage.getItem("authTokens")).access
        : null;
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact-messages/`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  const markAsRead = async (id) => {
    try {
      const token = sessionStorage.getItem("authTokens")
        ? JSON.parse(sessionStorage.getItem("authTokens")).access
        : null;
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact-messages/${id}/`,
        { is_read: true },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchMessages();
    } catch (err) {
      console.error("Failed to mark message as read", err);
    }
  };
  const filteredMessages = messages.filter((msg) => {
    const tabMatch = activeTab === "unread" ? !msg.is_read : msg.is_read;
    const searchMatch = msg.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return tabMatch && searchMatch;
  });
  if (loading)
    return <div className="text-neutral-100">Loading messages...</div>;
  return (
    <div>
      {" "}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {" "}
        <h1 className="text-3xl font-bold text-neutral-100 border-l-4 border-neutral-100 pl-4">
          Contact Messages
        </h1>{" "}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {" "}
          <div className="relative">
            {" "}
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-[#1A1A1A] border border-neutral-800 text-neutral-100 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-neutral-100 transition-colors duration-200 ease-in-out"
            />{" "}
          </div>{" "}
          <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-neutral-800">
            {" "}
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out border ${activeTab === "unread" ? "bg-neutral-800 text-neutral-100 border-transparent hover:border-neutral-600 hover:text-neutral-100 shadow-sm" : "border-transparent text-neutral-400 hover:text-neutral-300"}`}
            >
              {" "}
              Inbox (Unread){" "}
            </button>{" "}
            <button
              onClick={() => setActiveTab("read")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out border ${activeTab === "read" ? "bg-neutral-800 text-neutral-100 border-transparent hover:border-neutral-600 hover:text-neutral-100 shadow-sm" : "border-transparent text-neutral-400 hover:text-neutral-300"}`}
            >
              {" "}
              History (Read){" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="bg-[#121212] rounded-2xl border border-neutral-800 overflow-hidden shadow-lg">
        {" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full text-left text-neutral-300">
            {" "}
            <thead className="bg-[#1A1A1A] border-b border-neutral-800 text-sm uppercase tracking-wider text-neutral-400">
              {" "}
              <tr>
                {" "}
                <th className="px-6 py-4 font-bold">Name</th>{" "}
                <th className="px-6 py-4 font-bold">Email</th>{" "}
                <th className="px-6 py-4 font-bold w-1/3">Message</th>{" "}
                <th className="px-6 py-4 font-bold">Date</th>{" "}
                <th className="px-6 py-4 font-bold text-right">Actions</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-neutral-800">
              {" "}
              {filteredMessages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`hover:bg-neutral-800 transition-colors duration-200 ease-in-out ${!msg.is_read ? "bg-[#1A1A1A]/20 font-medium text-neutral-100" : "text-neutral-400"}`}
                >
                  {" "}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {msg.name}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-100">
                    {msg.email}
                  </td>{" "}
                  <td className="px-6 py-4">
                    {" "}
                    <p className="line-clamp-2 text-sm">{msg.message}</p>{" "}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {" "}
                    {new Date(msg.created_at).toLocaleDateString()}{" "}
                  </td>{" "}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {" "}
                    {!msg.is_read ? (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors duration-200"
                      >
                        Mark Read
                      </button>
                    ) : (
                      <span className="text-neutral-400 text-xs uppercase tracking-wider font-bold">
                        Read
                      </span>
                    )}{" "}
                  </td>{" "}
                </tr>
              ))}{" "}
              {filteredMessages.length === 0 && (
                <tr>
                  {" "}
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-neutral-400"
                  >
                    No messages found.
                  </td>{" "}
                </tr>
              )}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default AdminMessages;
