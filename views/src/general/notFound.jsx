// notFound.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-purple-200 p-6 text-center">
      
      <h1 className="text-9xl font-extrabold text-purple-900 animate-bounce">
        404
      </h1>

      <h2 className="text-4xl md:text-5xl font-bold text-purple-800 mt-4">
        Oops! Page not found
      </h2>

      <p className="text-purple-700 mt-3 max-w-lg leading-relaxed">
        Alphatech creates modern web and mobile experiences. 
        The page you are looking for might have been removed or never existed. 
        But don’t worry, we’ll get you back home!
      </p>

      <NavLink
        to="/"
        className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 font-semibold rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300"
      >
        Go Back Home
      </NavLink>

      <p className="mt-6 text-sm text-purple-700 opacity-70">
        Need help? Contact our support team.
      </p>
    </div>
  );
};

export default NotFound;
