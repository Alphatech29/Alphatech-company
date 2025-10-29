import React from "react";
import { useAuth } from "../utilities/authContext";

const SupportOptions = () => {
  const { settings } = useAuth();

  const options = [
    {
      id: 1,
      title: "WhatsApp",
      description: "Quick responses via WhatsApp",
      button: "CHAT NOW",
      link: settings?.whatsapp || "#",
      icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    },
    {
      id: 2,
      title: "Schedule a Call",
      description: "Book a consultation session",
      button: "BOOK NOW",
      link: "/book-a-consultation",
      icon: "https://cdn.vectorstock.com/i/1000v/62/98/may-2-flat-daily-calendar-icon-date-vector-17656298.avif",
    },
    {
      id: 3,
      title: "Email Support",
      description: "Get detailed responses via email",
      button: "SEND EMAIL",
      link: `mailto:${settings?.contact_email || ""}`,
      icon: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg",
    },
  ];

  return (
    <section className="w-full bg-primary-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 pc:grid-cols-3 tab:grid-cols-3 gap-6">
        {options.map((opt) => (
          <div
            key={opt.id}
            className="bg-primary-100 border border-primary-200 shadow-sm shadow-primary-800 hover:shadow-lg hover:shadow-primary-800 transition-shadow duration-300 rounded-2xl p-8 flex flex-col items-center text-center"
          >
            {/* Icon */}
            <img src={opt.icon} alt={opt.title} className="w-12 h-12 mb-4" />

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-800">{opt.title}</h3>

            {/* Description */}
            <p className="text-gray-500 mt-2">{opt.description}</p>

            {/* Button */}
            <a
              href={opt.link}
              className="mt-6 bg-gradient-to-r from-primary-700 via-primary-500 to-secondary-400 hover:opacity-90 transition font-semibold px-6 py-3 rounded-lg hover:bg-secondary-400 text-white"
            >
              {opt.button}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SupportOptions;
