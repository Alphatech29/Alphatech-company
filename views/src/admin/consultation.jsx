import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAllConsultationBookings } from "../utilities/consultation.jsx";
import { formatTimeOnly, formatDateTime } from "../utilities/formatDate.jsx";
import { formatAmount } from "../utilities/formatAmount.jsx";

const Consultation = () => {
  const [consultations, setConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchConsultations = async () => {
    try {
      const response = await getAllConsultationBookings();
      if (response?.success) {
        const sortedData = (response.data || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setConsultations(sortedData);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchConsultations();
}, []);


  const filteredConsultations = consultations.filter((item) =>
    item.full_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Consultation Bookings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and review all your booked consultations.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm focus:border-primary-500 focus:ring-2 focus:-primary-200 outline-none transition-all"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
            />
          </svg>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredConsultations.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No consultations found.
        </div>
      )}

      {/* Consultations Grid */}
      {!loading && filteredConsultations.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredConsultations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                {/* User Avatar */}
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 font-semibold text-lg">
                  {item.full_Name?.charAt(0)}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 uppercase">
                    {item.full_Name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {item.role}, {item.company}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 2a2 2 0 012 2v2M8 2a2 2 0 00-2 2v2m0 0h12M5 8h14M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M9 12h6"
                    />
                  </svg>
                  <span>{item.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{formatTimeOnly(item.time)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
                    />
                  </svg>
                  <span>{item.mode}</span>
                </div>

                  <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 2a2 2 0 012 2v2M8 2a2 2 0 00-2 2v2m0 0h12M5 8h14M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M9 12h6"
                    />
                  </svg>
                  <span>Booked: {formatDateTime(item.created_at)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="pt-3 border-t border-gray-100 text-sm text-gray-700">
                  <strong className="text-gray-800">Paid:</strong>{" "}
                  {formatAmount(item.cost)}
                </div>

                <div>
                <NavLink
                   to={`/dashboard/consultation/details/${item.id}`}
                  className="inline-block w-full text-center px-6 py-2.5 text-sm rounded-xl bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
                >
                  View Details
                </NavLink>
              </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Consultation;
