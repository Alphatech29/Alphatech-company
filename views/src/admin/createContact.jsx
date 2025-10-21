import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaRegCommentDots,
  FaPaperPlane,
  FaArrowLeft,
  FaBriefcase,
} from "react-icons/fa";
import { submitAdminContactForm } from "../utilities/contactUs";
import SweetAlert from "../utilities/sweetAlert";

const CreateContact = () => {
  const [formData, setFormData] = useState({
    receiver_name: "",
    email: "",
    sender_name: "",
    sender_position: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle form submission
 // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Trim all values
  const trimmedData = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, value.trim()])
  );

  // Required fields
  const requiredFields = [
    "sender_name",
    "sender_position",
    "receiver_name",
    "email",
    "message",
  ];

  // Check for empty fields
  const newErrors = {};
  requiredFields.forEach((field) => {
    if (!trimmedData[field]) newErrors[field] = "This field is required";
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    await SweetAlert.alert(
      "Missing Fields",
      "Please fill all required fields before submitting.",
      "error"
    );
    return;
  }

  setLoading(true);

  try {
    // Log the data before sending
    console.log("Data being sent to backend:", trimmedData);

    const response = await submitAdminContactForm(trimmedData);

    if (response?.success) {
      await SweetAlert.alert("Success", "Message sent successfully!", "success");
      setFormData({
        receiver_name: "",
        email: "",
        sender_name: "",
        sender_position: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } else {
      await SweetAlert.alert(
        "Error",
        response?.message || "Failed to send message. Try again.",
        "error"
      );
    }
  } catch (error) {
    await SweetAlert.alert(
      "Error",
      error?.message || "Something went wrong. Please try again.",
      "error"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col items-start justify-start py-5">
      {/* Back to Dashboard Link */}
      <div className="mb-5">
        <NavLink
          to="/dashboard/message"
          className="flex items-center gap-2 text-primary-600 hover:text-primary-800 font-semibold transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </NavLink>
      </div>

      {/* Contact Form */}
      <div className="w-full bg-white border border-primary-700/20 shadow-2xl rounded-3xl p-8 text-gray-700">
        <div className="flex items-center justify-center w-full mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Message</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {/* Sender Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Sender Name *</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleChange}
                  placeholder="Enter sender name"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-1 focus:outline-none text-gray-700 text-sm placeholder-gray-400 ${
                    errors.sender_name ? "border-red-500" : "border-gray-600/35"
                  }`}
                />
              </div>
              {errors.sender_name && (
                <p className="text-red-500 text-xs mt-1">{errors.sender_name}</p>
              )}
            </div>

            {/* Sender Position */}
            <div>
              <label className="block text-sm font-medium mb-1">Sender Position *</label>
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="sender_position"
                  value={formData.sender_position}
                  onChange={handleChange}
                  placeholder="Your position or title"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-1 focus:outline-none text-gray-700 text-sm placeholder-gray-400 ${
                    errors.sender_position ? "border-red-500" : "border-gray-600/35"
                  }`}
                />
              </div>
              {errors.sender_position && (
                <p className="text-red-500 text-xs mt-1">{errors.sender_position}</p>
              )}
            </div>

            {/* Receiver Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Receiver Name *</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="receiver_name"
                  value={formData.receiver_name}
                  onChange={handleChange}
                  placeholder="Enter receiver name"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-1 focus:outline-none text-gray-700 text-sm placeholder-gray-400 ${
                    errors.receiver_name ? "border-red-500" : "border-gray-600/35"
                  }`}
                />
              </div>
              {errors.receiver_name && (
                <p className="text-red-500 text-xs mt-1">{errors.receiver_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Receiver Email Address *</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter receiver email"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-1 focus:outline-none text-gray-700 text-sm placeholder-gray-400 ${
                    errors.email ? "border-red-500" : "border-gray-600/35"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <div className="relative">
              <FaRegCommentDots className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject of your message"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-600/35 rounded-xl focus:ring-1 focus:ring-primary-700 focus:outline-none text-gray-700 text-sm placeholder-gray-400"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1">Message *</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:outline-none text-gray-700 placeholder-gray-400 resize-none ${
                errors.message ? "border-red-500" : "border-gray-600/35"
              }`}
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-primary-200 to-primary-700 hover:opacity-90"
            } text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-primary-700/30`}
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                <FaPaperPlane className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateContact;
