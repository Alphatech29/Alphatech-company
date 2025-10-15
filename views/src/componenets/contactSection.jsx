// ContactSection.jsx
import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useAuth } from "../utilities/authContext";
import { submitContactForm } from "../utilities/contactUs";

const ContactSection = () => {
  const { settings } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");
    setIsError(false);

    try {
      const response = await submitContactForm(formData);
      if (response.success) {
        setResponseMessage(response.message);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setResponseMessage(response.message || "Failed to send message.");
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setResponseMessage(error?.message || "An unexpected error occurred.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-primary-200 py-8 pc:px-[5rem] px-4">
      <div className="flex flex-col pc:flex-row justify-between items-start w-full gap-5 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="bg-primary-950 text-primary-200 rounded-xl p-8 shadow-lg w-full pc:w-1/2">
          <h2 className="text-2xl font-semibold mb-6">Let's Talk</h2>
          <div className="mb-6">
            <h3 className="font-bold">Head Office</h3>
            <p className="flex items-center gap-2 text-sm mt-1">
              <ReactCountryFlag countryCode="NG" svg style={{ width: "1.5em", height: "1.5em" }} />
              {settings?.address || ""}
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold">Branch Office</h3>
            <p className="flex items-center gap-2 text-sm mt-1">
              <ReactCountryFlag countryCode="NG" svg style={{ width: "1.5em", height: "1.5em" }} />
              {settings?.branch_address_2 || ""}
            </p>
          </div>
          <div className="mb-6">
            <h3 className="font-bold">Branch Office</h3>
            <p className="flex items-center gap-2 text-sm mt-1">
              <ReactCountryFlag countryCode="US" svg style={{ width: "1.5em", height: "1.5em" }} />
              {settings?.branch_address_2 || ""}
            </p>
          </div>
          <div>
            <h3 className="font-bold">Chat Us On</h3>
            <p className="mt-1 flex items-center gap-2">
              <MdEmail />
              {settings?.contact_email || "info@alphatech.ng"}
            </p>
            <p className="mt-1 flex items-center gap-2">
              <IoCall />
              {settings?.contact_phone || "+234 000 000 0000"}
            </p>
            <p className="mt-1 flex items-center gap-2">
              <IoCall />
              {settings?.branch_phone || "+234 000 000 0000"}
            </p>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="bg-primary-300 rounded-xl p-8 shadow-lg w-full pc:w-1/2">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {responseMessage && (
              <p
                className={`p-3 text-sm rounded-xl mt-2 ${
                  isError ? "text-red-700 bg-red-200" : "text-green-700 bg-green-200"
                }`}
              >
                {responseMessage}
              </p>
            )}

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full bg-transparent border-b placeholder:text-primary-800 border-primary-400 focus:outline-none focus:border-primary-900 rounded-xl py-2 text-sm"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail Address"
              className="w-full bg-transparent border-b placeholder:text-primary-800 border-primary-400 focus:outline-none focus:border-primary-900 rounded-xl py-2 text-sm"
              required
            />

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject..."
              className="w-full bg-transparent border-b placeholder:text-primary-800 border-primary-400 focus:outline-none focus:border-primary-900 rounded-xl py-2 text-sm"
              required
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message..."
              rows="5"
              className="w-full bg-transparent border-b placeholder:text-primary-800 border-primary-900 focus:outline-none focus:border-primary-900 rounded-xl py-2 text-sm"
              required
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-700 via-primary-500 to-secondary-400 hover:opacity-90 transition font-semibold px-6 py-2 rounded-lg text-white text-sm"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
