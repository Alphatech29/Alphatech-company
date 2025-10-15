import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getContactForms, deleteContactForm } from "../utilities/contactUs";
import SweetAlert from "../utilities/sweetAlert";

// -------------------- Helper Functions --------------------
const formatName = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatSubject = (subject) => {
  if (!subject) return "";
  return subject.charAt(0).toUpperCase() + subject.slice(1);
};

const formatEmail = (email) => email?.toLowerCase() || "";

const relativeDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800)
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

// -------------------- Main Component --------------------
const ContactDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // -------------------- Fetch Messages --------------------
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getContactForms();
        const msgs = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : [];
        setMessages(msgs);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch messages. Please try again.");
        SweetAlert.alert("Error", "Failed to fetch messages. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // -------------------- Delete Message (with SweetAlert) --------------------
  const handleDelete = async (id) => {
    const confirmDelete = await SweetAlert.confirm(
      "Are you sure?",
      "This action will permanently delete the message."
    );

    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await deleteContactForm(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      setSelectedMessage(null);
      SweetAlert.alert("Deleted!", "The message has been successfully deleted.", "success");
    } catch (err) {
      console.error(err);
      SweetAlert.alert("Error", "Failed to delete message. Please try again.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Contact Messages</h1>

          <NavLink
            to="/dashboard/message/create"
            className="px-5 py-2.5 text-sm rounded-xl bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
          >
            + Create Message
          </NavLink>
        </div>

        {/* Loading / Error / Empty states */}
        {loading && <p className="text-gray-500">Loading messages...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && messages.length === 0 && (
          <p className="text-gray-400 text-center">No messages found.</p>
        )}

        {/* Messages Grid */}
        {!loading && !error && messages.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-800 truncate">
                    {formatName(msg.name)}
                  </h3>
                </div>

                <p className="text-sm text-gray-500 mb-1">
                  <strong>Subject:</strong> {formatSubject(msg.subject)}
                </p>

                <p className="text-sm text-gray-500 mb-1">
                  <strong>Email:</strong> {formatEmail(msg.email)}
                </p>

                <p className="text-gray-600 text-sm mt-3 line-clamp-3">{msg.message}</p>

                <div className="mt-5 flex justify-between items-center text-xs text-gray-400">
                  <span>{relativeDate(msg.created_at)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="px-4 py-2 text-xs rounded-xl bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium shadow hover:shadow-md hover:scale-105 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="px-4 py-2 text-xs rounded-xl bg-red-600 text-white font-medium shadow hover:shadow-md hover:scale-105 transition"
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* -------------------- Modal -------------------- */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMessage(null);
          }}
        >
          <div className="bg-white w-full max-w-4xl rounded-2xl border border-gray-200 shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              &times;
            </button>

            <div className="mb-5 border-b pb-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                {formatSubject(selectedMessage.subject)}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Received {relativeDate(selectedMessage.created_at)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-700">Name:</span>{" "}
                {formatName(selectedMessage.name)}
              </p>
              <p>
                <span className="font-medium text-gray-700">Email:</span>{" "}
                {formatEmail(selectedMessage.email)}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed max-h-80 overflow-y-auto">
              {selectedMessage.message
                ?.replace(/(Best regards,)\s*(\S)/i, "$1\n$2")
                .replace(/(Sincerely,)\s*(\S)/i, "$1\n$2")
                .split(/\n\s*\n|(?<=[.!?])\s{2,}/)
                .map((para, i) => (
                  <p key={i} className="mb-3 last:mb-0 whitespace-pre-wrap">
                    {para.trim()}
                  </p>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="px-6 py-2.5 text-sm rounded-xl bg-red-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-6 py-2.5 text-sm rounded-xl bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDashboard;
