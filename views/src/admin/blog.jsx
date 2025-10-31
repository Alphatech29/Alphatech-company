import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaUser,
  FaClock,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { getBlogs, deleteBlog } from "../utilities/blog";
import SweetAlert from "../utilities/sweetAlert";
import { formatDate } from "../utilities/formatDate";

const BlogDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await getBlogs();
      if (response.success) {
        setBlogs(response.data);
      } else {
        console.error("Failed to fetch blogs:", response.message);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await SweetAlert.confirm(
      "Are you sure?",
      "This action will permanently delete the blog."
    );

    if (!confirmed) return;

    const response = await deleteBlog(id);
    if (response.success) {
      SweetAlert.alert("Deleted!", response.message, "success");
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    } else {
      SweetAlert.alert("Error!", response.message, "error");
    }
  };

  return (
    <div className="py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Blog Management
        </h1>
        <NavLink
          to="/dashboard/blog/create"
          className="flex px-3 items-center gap-2 bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium py-2 rounded-lg transition-all"
        >
          <FaPlus />
          Create Blog
        </NavLink>
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-gray-500">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Blog Image */}
              <img
                src={blog.cover_image || "https://via.placeholder.com/400x250"}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />

              {/* Blog Info */}
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {blog.title}
                </h2>
                <p
                  className="text-sm text-gray-500 mt-2 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                ></p>

                {/* Author & Date */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <span className="flex justify-center items-center gap-2">
                    <FaUser /> {blog.author}
                  </span>
                  <span className="flex justify-center items-center gap-2">
                    <FaClock /> {formatDate(blog.created_at)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-5 border-t pt-4">
                  <div>
                    <span className="flex justify-center items-center gap-2">
                      <FaEye /> views {blog.views}{" "}
                    </span>
                  </div>
                  <div className="flex gap-3 justify-center items-center">
                    <NavLink
                      to={`/dashboard/blog/edit/${blog.id}`} // <-- link to edit page
                      className="flex px-3 text-sm items-center gap-1 bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium py-2 rounded-lg transition-all"
                    >
                      <FaEdit /> Edit
                    </NavLink>

                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="flex px-3 text-sm items-center gap-1 bg-gradient-to-r from-red-200 to-red-700 text-white font-medium py-2 rounded-lg transition-all"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDashboard;
