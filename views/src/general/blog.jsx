import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaTags } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { getBlogs } from "../utilities/blog";
import { formatDate } from "../utilities/formatDate";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        if (response.success) {
          const sortedBlogs = response.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setBlogs(sortedBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="min-h-[70vh] relative bg-gradient-to-br from-primary-950 via-primary-800 to-primary-300 text-white py-20 px-6 md:px-16 flex items-center justify-center">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Welcome to Our Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-primary-100 max-w-2xl mx-auto mb-6"
          >
            Explore insights, tutorials, and the latest trends in technology,
            design, and innovation — all in one place.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-primary-100 transition"
          >
            Explore Posts
          </motion.button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50 rounded-t-3xl"></div>
      </section>

      {/* BLOG LIST SECTION */}
      <section className="py-16 px-4 md:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Latest Blog Posts
          </h2>
          <p className="text-gray-600">
            Stay updated with insights, tutorials, and stories from experts in
            the tech world.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <NavLink to={`/blog/${blog.slug}`} className="block">
                <img
                  src={blog.cover_image}
                  alt={blog.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition">
                    {blog.title}
                  </h3>
                  <p
                    className="text-gray-600 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  ></p>

                  <div className="flex items-center justify-between text-gray-500 text-xs">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-primary-500" />
                      <span>{formatDate(blog.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTags className="text-primary-500" />
                      <span>{blog.category}</span>
                    </div>
                  </div>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
