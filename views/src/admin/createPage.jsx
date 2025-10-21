import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { addPageData } from "../utilities/createPage";
import SweetAlert from "../utilities/sweetAlert";

const CreatePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
  });
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔹 Generate slug automatically from title
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");

  // 🔹 Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" ? { slug: generateSlug(value) } : {}),
    }));
  };

  // 🔹 Handle editor changes and update word count
  const handleEditorChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
    const text = value.replace(/<[^>]+>/g, "").trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  };

  // 🔹 Submit new page data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { title, slug, description, content } = formData;
      const response = await addPageData(title, slug, description, content);

      if (response?.success) {
        SweetAlert.alert("Success!", response.message || "Page created successfully.", "success");
        setFormData({ title: "", slug: "", description: "", content: "" });
        setWordCount(0);
      } else {
        SweetAlert.alert("Error!", response?.message || "Failed to create page.", "error");
      }
    } catch (error) {
      SweetAlert.alert("Error!", "Unexpected error occurred while creating the page.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Quill configuration
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ align: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
    table: true,
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true,
    },
  };

  return (
    <div className="min-h-screen py-5">
      <div className="w-full bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            Create New Page
          </h1>
          <NavLink
            to="/dashboard/page"
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm"
          >
            ← Back
          </NavLink>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Page Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter page title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              placeholder="example-page"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The slug is auto-generated from the title but can be edited.
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Short description about the page"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Page Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Page Content
            </label>
            <div className="border border-gray-300 rounded-xl overflow-hidden relative">
              <style>{`
                .ql-toolbar {
                  position: sticky;
                  top: 0;
                  z-index: 10;
                  background: white;
                  border-bottom: 1px solid #ddd;
                }
                .ql-container {
                  min-height: 500px;
                  border: none !important;
                }
              `}</style>

              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleEditorChange}
                modules={modules}
                placeholder="Start typing your page content..."
                className="h-[500px]"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Word count: <span className="font-semibold">{wordCount}</span>
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? "Publishing..." : "Publish Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
