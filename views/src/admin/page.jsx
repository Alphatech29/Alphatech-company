import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getPagesData } from "../utilities/createPage";
import {formatDateTime} from "../utilities/formatDate";

const Page = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const result = await getPagesData();
        if (result.success) {
          // Map backend fields to frontend format
          const formattedPages = result.data.map((page) => ({
            id: page.id,
            title: page.title,
            slug: page.slug,
            content: page.content,
            createdAt: page.created_at || new Date().toISOString().split("T")[0],
          }));
          setPages(formattedPages);
        } else {
          console.error("Failed to fetch pages:", result.message);
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      setPages((prev) => prev.filter((page) => page.id !== id));
    }
  };

  return (
    <div className="min-h-screen py-5 ">
      <div className="w-full bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b pb-3 gap-3">
          <h1 className="text-2xl font-extrabold text-gray-900">All Pages</h1>
          <NavLink
            to="/dashboard/page/create"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm sm:text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            + New Page
          </NavLink>
        </div>

        {/* Content Section */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading pages...</p>
        ) : pages.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No pages found. Click “+ New Page” to create one.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex flex-col justify-between bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all"
              >
                {/* Page Info */}
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{page.title}</h2>
                  <p className="text-sm text-gray-500">{page.slug}</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Published: {formatDateTime(page.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-end gap-2 sm:gap-3 flex-wrap">
                  <NavLink
                    to={`/dashboard/page/edit/${page.id}`}
                    className="flex items-center px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-primary-200 to-primary-700 text-white rounded-md hover:opacity-90 transition-all duration-200"
                  >
                    Edit
                  </NavLink>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
