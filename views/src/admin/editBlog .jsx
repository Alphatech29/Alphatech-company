import React, { useState, useEffect } from "react";
import { Card, Label, TextInput } from "flowbite-react";
import { HiUpload, HiArrowLeft } from "react-icons/hi";
import { motion } from "framer-motion";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { updateBlog, getBlogs } from "../utilities/blog";
import SweetAlert from "../utilities/sweetAlert";
import { useParams, NavLink } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    author: "",
    content: "",
    cover_image: null,
  });
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const result = await getBlogs();
        const blog = result.data.find((b) => String(b.id) === String(id));
        if (!blog) {
          SweetAlert.alert("Error", "Blog not found", "error");
          return;
        }
        setFormData({
          title: blog.title,
          slug: blog.slug,
          category: blog.category,
          author: blog.author,
          content: blog.content,
          cover_image: null,
        });
        setPreview(blog.cover_image || null);
        const text = blog.content.replace(/<[^>]+>/g, "").trim();
        setWordCount(text ? text.split(/\s+/).length : 0);
      } catch (err) {
        console.error(err);
        SweetAlert.alert("Error", "Failed to load blog data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" ? { slug: generateSlug(value) } : {}),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cover_image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditorChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
    const text = value.replace(/<[^>]+>/g, "").trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
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
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { title, slug, category, author, content, cover_image } = formData;

    if (!title || !slug || !category || !author || !content) {
      SweetAlert.alert("Missing Fields", "All fields are required.", "warning");
      setLoading(false);
      return;
    }

    const blogPayload = { title, slug, category, author, content };
    const imageToSend = cover_image || preview;

    const response = await updateBlog(id, blogPayload, imageToSend);

    if (response.success) {
      SweetAlert.alert(
        "Success",
        response.message || "Blog updated successfully!",
        "success"
      );
    } else {
      SweetAlert.alert(
        "Error",
        response.message || "Failed to update blog.",
        "error"
      );
    }
  } catch (error) {
    SweetAlert.alert(
      "Unexpected Error",
      error.message || "Something went wrong.",
      "error"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full shadow-md border rounded-2xl md:p-6 bg-white">
        {/* Back Button */}
        <NavLink
          to="/dashboard/blog"
          className="flex items-center gap-2 text-primary-600 mb-4 hover:underline"
        >
          <HiArrowLeft className="text-xl" />
          Back to Blogs
        </NavLink>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Blog Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" value="Title" />
            <TextInput
              id="title"
              name="title"
              placeholder="Enter blog title"
              required
              onChange={handleChange}
              value={formData.title}
            />
          </div>

          <div>
            <Label htmlFor="slug" value="Slug" />
            <TextInput
              id="slug"
              name="slug"
              placeholder="auto-generated-from-title"
              required
              onChange={handleChange}
              value={formData.slug}
            />
          </div>

          <div>
            <Label htmlFor="category" value="Category" />
            <TextInput
              id="category"
              name="category"
              placeholder="e.g. Technology, Lifestyle..."
              required
              onChange={handleChange}
              value={formData.category}
            />
          </div>

          <div>
            <Label htmlFor="author" value="Author" />
            <TextInput
              id="author"
              name="author"
              placeholder="Author name"
              required
              onChange={handleChange}
              value={formData.author}
            />
          </div>

          <div>
            <Label htmlFor="cover_image" value="Cover Image" />
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <HiUpload className="text-3xl" />
                  <p className="mt-2 text-sm">Click to upload cover image</p>
                </div>
              )}
              <input
                type="file"
                id="cover_image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <Label htmlFor="content" value="Content" />
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
                  min-height: 400px;
                  border: none !important;
                }
              `}</style>

              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleEditorChange}
                modules={modules}
                placeholder="Start writing your blog content..."
                className="h-[400px]"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Word count: <span className="font-semibold">{wordCount}</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-primary-200 to-primary-700 text-white font-medium py-2 rounded-lg transition-all ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </Card>
    </motion.div>
  );
};

export default EditBlog;
