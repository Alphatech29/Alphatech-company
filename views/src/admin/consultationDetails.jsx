import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllConsultationBookings } from "../utilities/consultation.jsx";
import { formatTimeOnly, formatDateTime } from "../utilities/formatDate.jsx";
import { formatAmount } from "../utilities/formatAmount.jsx";
import SweetAlert from "../utilities/sweetAlert";

const ConsultationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Send Link Modal
  const [showModal, setShowModal] = useState(false);
  const [consultationLink, setConsultationLink] = useState("");

  // Reschedule Modal
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getAllConsultationBookings();
        if (response?.success) {
          const selectedConsultation = response.data.find(
            (item) => String(item.id) === String(id)
          );
          setConsultation(selectedConsultation || null);

          // Pre-fill reschedule date and time
          if (selectedConsultation) {
            setNewDate(selectedConsultation.date || "");
            setNewTime(selectedConsultation.time || "");
          }
        }
      } catch (error) {
        console.error("Error fetching consultation details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Send Consultation Link
  const handleSendLink = async () => {
    if (!consultationLink.trim()) {
      return SweetAlert.alert(
        "Invalid Input",
        "Please enter a valid consultation link.",
        "error"
      );
    }

    try {
      new URL(consultationLink);
    } catch {
      return SweetAlert.alert(
        "Invalid URL",
        "Please enter a valid URL (e.g., https://zoom.us/...).",
        "error"
      );
    }

    try {
      const response = await fetch("/api/consultation-prepard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: consultation.id,
          consultation_link: consultationLink,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return SweetAlert.alert(
          "Failed to Send",
          result.message || "Failed to send consultation link.",
          "error"
        );
      }

      await SweetAlert.alert(
        "Success",
        result.message || "Consultation link sent successfully!",
        "success"
      );
      setShowModal(false);
      setConsultationLink("");
    } catch (error) {
      console.error("Error sending consultation link:", error);
      SweetAlert.alert(
        "Error",
        "An error occurred while sending the consultation link.",
        "error"
      );
    }
  };

  // Reschedule Consultation
  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      return SweetAlert.alert(
        "Invalid Input",
        "Please select both date and time.",
        "error"
      );
    }

    try {
      const response = await fetch("/api/consultation-reschedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: consultation.id,
          date: newDate,
          time: newTime,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return SweetAlert.alert(
          "Failed to Reschedule",
          result.message || "Could not reschedule consultation.",
          "error"
        );
      }

      SweetAlert.alert(
        "Success",
        result.message || "Consultation rescheduled successfully!",
        "success"
      );

      setConsultation((prev) => ({
        ...prev,
        date: newDate,
        time: newTime,
      }));
      setShowRescheduleModal(false);
    } catch (error) {
      console.error("Error rescheduling consultation:", error);
      SweetAlert.alert(
        "Error",
        "An error occurred while rescheduling.",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-600 px-4">
        <p className="text-lg md:text-xl animate-pulse">
          Loading consultation details...
        </p>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700 px-4 text-center">
        <p className="text-lg sm:text-xl font-medium mb-4">
          Consultation not found.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentHour = new Date().getHours();
  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen py-8">
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-2 sm:self-auto px-5 py-2 text-sm sm:text-base rounded-xl bg-primary-200 text-purple-500 font-medium"
      >
        ← Back to Consultation
      </button>

      <div className="w-full bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <header className="bg-primary-500 text-white px-4 sm:px-4 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-xl font-bold tracking-tight uppercase">
              {consultation.full_Name} Details
            </h1>
            <p className="text-primary-100 text-sm mt-1">
              Review the complete information below.
            </p>
          </div>
        </header>

        {/* Body */}
        <main className="p-6">
          <section className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-gray-200 pb-6 mb-8">
            <div className="flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary-100 text-primary-600 font-bold text-2xl sm:text-2xl uppercase">
              {consultation.full_Name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl sm:text-lg font-semibold text-gray-900 uppercase">
                {consultation.full_Name}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {consultation.role}{" "}
                {consultation.company && `, ${consultation.company}`}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-gray-700">
            <Info label="Date" value={consultation.date} />
            <Info label="Time" value={formatTimeOnly(consultation.time)} />
            <Info label="Duration" value={consultation.duration} />
            <Info label="Mode" value={consultation.mode} />
            <Info label="Cost" value={formatAmount(consultation.cost)} />
            <Info label="Phone" value={consultation.phone || "N/A"} />
            <Info label="E-mail" value={consultation.email} />
            {consultation.whatsapp && (
              <Info label="WhatsApp" value={consultation.whatsapp} />
            )}
            <Info label="Country" value={consultation.country} />
            <Info label="Location" value={consultation.location} />
            <Info
              label="Address"
              value={consultation.address}
              className="sm:col-span-2"
            />
            <Info
              label="Reference Websites"
              value={consultation.reference_websites || "None provided"}
              className="sm:col-span-2"
            />
            <Info
              label="Project Details"
              value={consultation.project_details || "None provided"}
              className="sm:col-span-2"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:col-span-2">
              <strong>Booked:</strong> {formatDateTime(consultation.created_at)}
            </p>
          </section>

          <div className="flex justify-end mt-10 gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 text-sm rounded-xl bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
            >
              Send Consultation Link
            </button>
            <button
              onClick={() => setShowRescheduleModal(true)}
              className="px-4 py-2.5 text-sm rounded-xl bg-gradient-to-r from-primary-700 to-primary-200 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
            >
              Reschedule
            </button>
          </div>
        </main>
      </div>

      {/* Send Link Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-2xl shadow-xl w-full md:max-w-2xl max-h-[90vh] overflow-hidden relative">
            <div className="flex flex-col h-full">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  Send Consultation Link
                </h2>
              </div>
              <div className="px-6 py-6 flex-1">
                <label className="block text-gray-700 font-medium mb-2">
                  Consultation Link
                </label>
                <input
                  type="url"
                  value={consultationLink}
                  onChange={(e) => setConsultationLink(e.target.value)}
                  placeholder="Enter the consultation link (e.g., Zoom, Google Meet, etc.)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-400 focus:outline-none"
                />
              </div>
              <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendLink}
                  className="px-5 py-2 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all"
                >
                  Send Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-2xl shadow-xl w-full md:max-w-2xl max-h-[90vh] overflow-hidden relative">
            <div className="flex flex-col h-full">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  Reschedule Consultation
                </h2>
              </div>

              <div className="px-6 py-6 flex-1 space-y-4">
                {/* Date Picker */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Select New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={todayDate} // disables past dates
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-400 focus:outline-none"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Select Time (09:00–22:00)
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                    {Array.from({ length: 14 }, (_, i) => {
                      const hour = i + 9;
                      const timeValue = `${hour.toString().padStart(2, "0")}:00`;

                      // Disable past times if selected date is today
                      const isPastTime =
                        newDate === todayDate && hour <= currentHour;

                      return (
                        <button
                          key={timeValue}
                          type="button"
                          onClick={() => !isPastTime && setNewTime(timeValue)}
                          disabled={isPastTime}
                          className={`py-2 rounded-lg border text-sm font-medium transition ${
                            newTime === timeValue
                              ? "bg-primary-500 text-white"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
                          } ${isPastTime ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {timeValue}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Info Component
const Info = ({ label, value, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <strong className="text-gray-900 text-sm sm:text-base">{label}:</strong>
    <pre className="text-gray-700 font-mono text-sm sm:text-base whitespace-pre-wrap break-words mt-1">
      {value}
    </pre>
  </div>
);

export default ConsultationDetails;
