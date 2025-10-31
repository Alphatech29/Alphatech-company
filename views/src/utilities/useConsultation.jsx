import { useState, useEffect } from "react";
import {
  createConsultationBooking,
  verifyConsultationTransaction,
  getAllConsultationBookings,
} from "./consultation";

export function useConsultationBooking() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    whatsapp: "",
    country: "",
    location: "",
    address: "",
    mode: "",
    date: "",
    time: "",
    duration: "",
    cost: "",
    referenceWebsites: "",
    projectDetails: "",
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [bookedSlotsMap, setBookedSlotsMap] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);


   useEffect(() => {
      document.title = "Consultation | We build digital solutions that help businesses connect and grow..";
    }, []);

  /** Verify transaction if reference exists */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");
    if (!reference) return;

    const verifyTransaction = async () => {
      try {
        setLoading(true);
        const result = await verifyConsultationTransaction(reference);
        if (result?.success) {
          setSuccess({ message: result.message, data: result.data });
        } else {
          setError(result?.message || "Verification failed.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyTransaction();
  }, []);

  /** Fetch all bookings */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getAllConsultationBookings();
        if (result?.success) {
          const map = {};
          result.data.forEach((b) => {
            const localDate = new Date(b.date).toISOString().split("T")[0];
            const [hour, minute] = b.time.split(":");
            const timeFormatted = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
            if (!map[localDate]) map[localDate] = new Set();
            map[localDate].add(timeFormatted);
          });
          setBookedSlotsMap(map);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  /** Generate available slots */
  useEffect(() => {
    if (!form.date) return setAvailableSlots([]);

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const baseHours = Array.from({ length: 14 }, (_, i) => i + 9);
    const bookedSlotsForDate = bookedSlotsMap[form.date] || new Set();

    const slots = baseHours.map((h) => {
      const slotStr = `${String(h).padStart(2, "0")}:00`;
      const dateTimeStr = `${form.date}T${slotStr}`;
      const isPast = form.date === todayStr && h * 60 <= currentTime;
      const available = !isPast && !bookedSlotsForDate.has(slotStr);

      return {
        label: `${h % 12 === 0 ? 12 : h % 12}:00 ${h >= 12 ? "PM" : "AM"}`,
        value: dateTimeStr,
        available,
      };
    });

    setAvailableSlots(slots);
  }, [form.date, bookedSlotsMap]);

  /** Handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSlotSelect = (slot) => {
    if (!slot.available) return;
    const [datePart, timePart] = slot.value.split("T");
    setSelectedSlot(slot);
    setForm((f) => ({ ...f, date: datePart, time: timePart }));
  };

  const handleDurationSelect = (duration, cost) =>
    setForm((f) => ({ ...f, duration, cost }));

  const validate = () => {
    const errors = {};
    if (!form.fullName) errors.fullName = "Enter your full name.";
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))
      errors.email = "Enter a valid email.";
    if (!form.phone) errors.phone = "Enter your phone number.";
    if (!form.duration) errors.duration = "Select a session duration.";
    if (!form.date) errors.date = "Select a date.";
    if (!selectedSlot) errors.time = "Select a time slot.";
    if (!form.mode) errors.mode = "Select a consultation mode.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", form);
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const result = await createConsultationBooking(form);
      console.log("Booking result:", result);

      if (result?.success) {
        setSuccess({ message: result.message });
        if (result.authorization_url) {
          console.log("Redirecting to:", result.authorization_url);
          window.location.href = result.authorization_url;
        }
      } else {
        setError(result?.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    availableSlots,
    selectedSlot,
    setSelectedSlot,
    loading,
    success,
    error,
    fieldErrors,
    showCalendar,
    setShowCalendar,
    handleChange,
    handleSlotSelect,
    handleDurationSelect,
    handleSubmit,
  };
}
