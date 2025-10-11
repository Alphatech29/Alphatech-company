import React from "react";

export default function Footer() {
  return (
    <footer className=" bottom-0 left-0 right-0 h-16 bg-white shadow-inner flex items-center justify-center text-gray-600 text-sm lg:pl-64">
      © {new Date().getFullYear()} Alphatech. All rights reserved.
    </footer>
  );
}
