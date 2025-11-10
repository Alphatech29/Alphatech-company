import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaTags } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { getBlogs } from "../utilities/blog";
import { formatDate } from "../utilities/formatDate";

const ShortBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        if (response.success) {
          const sortedBlogs = response.data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4); // 👈 Only take the 4 most recent posts
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
      {/* BLOG LIST SECTION */}
      <section className="py-10 px-4 md:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Latest Blog Posts
          </h2>
          <p className="text-gray-600">
            Stay updated with insights, tutorials, and stories from experts in
            the tech world.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
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
                  <div>
                    <NavLink to={`/blog/${blog.slug}`} className="text-primary-600 hover:shadow-md text-sm font-medium mt-4 inline-block">
                      Read More
                    </NavLink>
                    
                  </div>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <NavLink to="/blog" className="mt-8 inline-block px-6 py-2 bg-gradient-to-r from-purple-800 to-secondary-500  text-white font-medium rounded-lg hover:bg-primary-700 transition">
            View All Blogs
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default ShortBlog;
