import React from "react";
import { DayPicker } from "react-day-picker";
import { motion } from "framer-motion";
import "react-day-picker/dist/style.css";

export default function Calendar({ selectedDate, onSelect, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-2xl border border-secondary-500/40 w-full md:max-w-sm"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        <DayPicker
          mode="single"
          selected={selectedDate ? new Date(selectedDate + "T00:00:00") : undefined}
          onSelect={(date) => {
            if (date) {
              const formatted = date.toLocaleDateString("en-CA");
              onSelect(formatted);
            }
          }}
          disabled={{ before: new Date() }}
          modifiersClassNames={{
            selected: "bg-primary-900 text-white rounded-lg",
            today: "border border-primary-900 rounded-lg font-semibold",
          }}
        />

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg text-primary-900 border border-secondary-500/40 hover:bg-secondary-500 hover:text-white transition"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}