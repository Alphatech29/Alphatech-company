import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "react-day-picker/dist/style.css";
import {
  useConsultationBooking,
} from "../utilities/useConsultation.jsx";
import TextArea from "../componenets/TextArea.jsx";
import Input from "../componenets/Input.jsx";
import Calendar from "../componenets/calendar.jsx";

export default function Book() {
  const {
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
  } = useConsultationBooking();


  return (
    <div className="w-full overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] pt-20 flex flex-col-reverse lg:flex-row items-center justify-center gap-10 px-5 sm:px-8 lg:px-20 py-16 bg-gradient-to-br from-primary-950 via-primary-800 to-primary-300 text-text overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-40 sm:h-40 bg-[#FCEDD4]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-44 h-44 sm:w-56 sm:h-56 bg-[#F66B04]/10 rounded-full blur-3xl animate-pulse" />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center lg:text-left max-w-3xl"
        >
          <p className="uppercase tracking-[0.25em] text-[#FCEDD4]/80 text-xs sm:text-sm mb-3">
            book a consultation
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-snug text-[#FFFFFF]">
            Transform Your Ideas Into <br className="hidden sm:block" /> Powerful Software Solutions
          </h1>
          <p className="text-[#FCEDD4] text-sm sm:text-base md:text-lg leading-relaxed mb-8">
            From concept to launch, Alphatech brings your vision to life with
            innovative web and mobile solutions. We combine creativity,
            technology, and strategy to craft high-performing digital
            experiences that engage users and elevate your brand.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document
                  .getElementById("booking-section")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 sm:px-8 py-3 bg-yellow-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition text-sm sm:text-base"
            >
              Book Consultation
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavLink
                to="/services"
                className="px-6 sm:px-8 py-3 border border-[#FCEDD4]/60 text-[#FCEDD4] rounded-full font-semibold hover:bg-secondary-500/10 transition text-sm sm:text-base inline-block"
              >
                Learn More
              </NavLink>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 w-full sm:max-w-md lg:w-[45%] bg-slate-800/40 backdrop-blur-md border border-slate-600/20 rounded-2xl shadow-xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
          </div>
          <pre className="text-left text-[#FCEDD4] text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto">
            <code>
              <span className="text-[#F66B04]">const</span> consultation = {"{"}{"\n"}
              {"  "}client: <span className="text-[#FCEDD4]">"Creative Brand"</span>,{"\n"}
              {"  "}goal: <span className="text-[#FCEDD4]">"Build lasting identity"</span>,{"\n"}
              {"  "}platform: <span className="text-[#FCEDD4]">"Digital Strategy"</span>,{"\n"}
              {"}"}
              {"\n\n"}
              <span className="text-[#F66B04]">function</span> <span className="text-[#FCEDD4]">bookConsultation</span>() {"{"}{"\n"}
              {"  "}return <span className="text-[#F66B04]">"Success"</span>;{"\n"}
              {"}"}
              {"\n\n"}
              <span className="text-[#F66B04]">console</span>.log(<span className="text-[#FCEDD4]">"Let’s start your project today!"</span>);
            </code>
          </pre>
        </motion.div>
      </section>

      {/* FORM SECTION */}
      <main
        id="booking-section"
        className="w-full max-w-4xl mx-auto bg-white rounded-2xl px-4 sm:px-6 md:px-10 shadow-xl border border-t-[10px] border-primary-800 py-10 my-20"
      >
        <header className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-900">
            Schedule Your Consultation
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Tailored sessions crafted to elevate your brand and business.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-100 border border-l-[6px] border-red-700 text-red-700 text-sm text-start">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-3 rounded-lg bg-green-100 border border-l-[6px] border-green-400 text-green-700 text-sm text-start">
            {success.message}
          </div>
        )}

       <form onSubmit={handleSubmit} className="space-y-6">
  {/* Full Name & Email */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      label="Full Name"
      name="fullName"
      value={form.fullName}
      onChange={handleChange}
      error={fieldErrors.fullName}
    />
    <Input
      label="Email"
      name="email"
      value={form.email}
      onChange={handleChange}
      error={fieldErrors.email}
    />
  </div>

  {/* Company & Role */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      label="Company"
      name="company"
      value={form.company}
      onChange={handleChange}
      error={fieldErrors.company}
    />
    <Input
      label="Role"
      name="role"
      value={form.role}
      onChange={handleChange}
      error={fieldErrors.role}
    />
  </div>

  {/* Phone Number */}
  <Input
    label="Phone Number"
    name="phone"
    type="tel"
    value={form.phone}
    onChange={handleChange}
    error={fieldErrors.phone}
  />

  {/* Country & Location */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      label="Country"
      name="country"
      value={form.country}
      onChange={handleChange}
      error={fieldErrors.country}
    />
    <Input
      label="City / Location"
      name="location"
      value={form.location}
      onChange={handleChange}
      error={fieldErrors.location}
    />
  </div>

  {/* Address */}
  <Input
    label="Address"
    name="address"
    value={form.address}
    onChange={handleChange}
    error={fieldErrors.address}
  />

  {/* Duration & Cost */}
  <div>
    <label className="text-sm font-medium text-primary-900 block mb-2">
      Choose Session Duration & Cost
    </label>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[
        { duration: "30 Minutes", cost: "₦15,000" },
        { duration: "45 Minutes", cost: "₦35,000" },
        { duration: "60 Minutes", cost: "₦50,000" },
      ].map(({ duration, cost }) => (
        <button
          key={duration}
          type="button"
          onClick={() => handleDurationSelect(duration, cost)}
          className={`p-2 rounded-lg border text-sm font-medium transition shadow-sm ${
            form.duration === duration
              ? "bg-gradient-to-r from-primary-900 to-secondary-500 text-white"
              : "bg-white text-primary-900 border-gray-300 hover:border-secondary-500"
          }`}
        >
          {duration} <br />
          <span className="text-[#D4AF37] font-semibold">{cost}</span>
        </button>
      ))}
    </div>
    {fieldErrors.duration && (
      <p className="text-red-600 text-xs mt-1">{fieldErrors.duration}</p>
    )}
  </div>

  {/* Consultation Mode */}
  <div>
    <label className="text-sm font-medium text-[#5B2C6F] block mb-2">
      Mode of Consultation
    </label>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {["WhatsApp Call", "Google Meeting", "Phone Call", "Video Call"].map(
        (mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setForm((f) => ({ ...f, mode }))}
            className={`py-2 rounded-lg border text-sm font-medium transition ${
              form.mode === mode
                ? "bg-gradient-to-r from-[#5B2C6F] to-[#D4AF37] text-white"
                : "bg-white text-[#5B2C6F] border-gray-300 hover:border-[#D4AF37]"
            }`}
          >
            {mode}
          </button>
        )
      )}
    </div>
    {fieldErrors.mode && (
      <p className="text-red-600 text-xs mt-1">{fieldErrors.mode}</p>
    )}
  </div>

  {/* WhatsApp Number */}
  {form.mode === "WhatsApp Call" && (
    <Input
      label="WhatsApp Number"
      name="whatsapp"
      type="tel"
      value={form.whatsapp}
      onChange={handleChange}
      error={fieldErrors.whatsapp}
    />
  )}

  {/* Date Picker */}
  <div>
    <label className="text-sm font-medium text-[#5B2C6F] block mb-2">
      Select Date
    </label>
    <button
      type="button"
      onClick={() => setShowCalendar(true)}
      className="w-full text-left px-4 py-3 rounded-xl border border-[#D4AF37]/40 bg-white hover:shadow-md transition flex items-center justify-between text-sm sm:text-base"
    >
      <span className="text-[#5B2C6F]">
        {form.date || "Tap to choose a date"}
      </span>
    </button>
    {fieldErrors.date && (
      <p className="text-red-600 text-xs mt-1">{fieldErrors.date}</p>
    )}
  </div>

  {/* Time Slots */}
  {!loading && form.date && (
    <div>
      <label className="text-sm font-medium text-[#5B2C6F] block mb-2">
        Available Time Slots
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {availableSlots.map((slot) => (
          <button
            key={slot.value}
            type="button"
            disabled={!slot.available}
            onClick={() => handleSlotSelect(slot)}
            className={`p-2 rounded-lg border text-sm transition ${
              selectedSlot?.value === slot.value
                ? "bg-gradient-to-r from-primary-900 to-secondary-500 text-white"
                : "bg-white text-primary-900 border-gray-300"
            } ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {slot.label}
          </button>
        ))}
      </div>
      {fieldErrors.time && (
        <p className="text-red-600 text-xs mt-1">{fieldErrors.time}</p>
      )}
    </div>
  )}

  {/* Inspiration Details */}
  <TextArea
    label="Inspiration / Reference Websites"
    name="referenceWebsites"
    rows={3}
    value={form.referenceWebsites}
    onChange={handleChange}
    placeholder="e.g., www.behance.net/yourdesign or describe your preferred style..."
    error={fieldErrors.referenceWebsites}
  />

  {/* Project Details */}
  <TextArea
    label="Tell Us About Your Project"
    name="projectDetails"
    rows={5}
    value={form.projectDetails}
    onChange={handleChange}
    placeholder="Describe your project goals..."
    error={fieldErrors.projectDetails}
  />

  {/* Submit */}
  <button
    type="submit"
    className="w-full py-3 rounded-lg bg-gradient-to-r from-primary-900 to-secondary-500 text-white font-semibold hover:opacity-95 transition text-base"
  >
    {loading ? "Processing…" : "Proceed to payment"}
  </button>
</form>
      </main>

         {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-200 via-primary-400 to-primary-300 py-20 text-center text-white ">
        <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
        <p className="mb-8 sm-px-4">Contact us today and let's build something amazing together.</p>
        <NavLink
          to="/hire-us"
          className="bg-white text-primary-500 font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-primary-100 transition"
        >
          Get in Touch
        </NavLink>
      </section>

      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendar && (
          <Calendar
            selectedDate={form.date}
            onSelect={(date) => {
              setForm((f) => ({ ...f, date }));
              setShowCalendar(false);
              setSelectedSlot(null);
            }}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

