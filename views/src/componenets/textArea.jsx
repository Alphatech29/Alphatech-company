import React from "react";

export default function TextArea({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#5B2C6F] mb-1 block">
        {label}
      </span>
      <textarea
        {...props}
        className={`w-full rounded-lg px-3 py-2 border text-gray-700 text-sm sm:text-base bg-white shadow-sm transition
          ${error
            ? "border-red-500 focus:ring-2 focus:ring-red-400 focus:border-red-500"
            : "border-gray-300 focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] hover:shadow-md"
          }`}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </label>
  );
}
