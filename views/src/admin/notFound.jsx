import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center ">
      <div className="text-center max-w-2xl mt-44">
        {/* 404 Title */}
        <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-extrabold text-primary-600 animate-bounce">
          404
        </h1>

        {/* Subheading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mt-2 mb-6 text-sm sm:text-base md:text-lg">
          Oops! The page you are looking for does not exist or has been moved.
        </p>

        {/* Go Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-200 to-primary-800 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
        >
          <FaArrowLeft /> Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
