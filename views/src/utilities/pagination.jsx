import React from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  // Generate dynamic page numbers with ellipsis
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (
      (i === currentPage - 2 && i > 1) ||
      (i === currentPage + 2 && i < totalPages)
    ) {
      pageNumbers.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
          currentPage === 1
            ? "cursor-not-allowed opacity-40 border-gray-300"
            : "hover:bg-primary-600 hover:text-white border-gray-300 text-primary-700"
        }`}
      >
        <FaChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: page !== "..." ? 1.1 : 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => page !== "..." && onPageChange(page)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-300 ${
              page === currentPage
                ? "bg-primary-600 text-white shadow-md"
                : page === "..."
                ? "cursor-default text-gray-400"
                : "bg-white border border-gray-200 hover:bg-primary-500 hover:text-white"
            }`}
          >
            {page}
          </motion.button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? "cursor-not-allowed opacity-40 border-gray-300"
            : "hover:bg-primary-600 hover:text-white border-gray-300 text-primary-700"
        }`}
      >
        Next
        <FaChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
