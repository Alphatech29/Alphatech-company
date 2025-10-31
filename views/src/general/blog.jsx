// Blog.jsx
import { motion } from "framer-motion";
import { FaCalendarAlt, FaTags } from "react-icons/fa";

const blogs = [
  {
    id: 1,
    title: "The Future of Web Development in 2025",
    excerpt:
      "Discover how AI, WebAssembly, and serverless technologies are shaping the future of modern web applications.",
    image: "https://source.unsplash.com/random/800x600?technology",
    tags: ["Web", "AI", "Trends"],
    date: "October 31, 2025",
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS: From Basics to Advanced",
    excerpt:
      "Learn how to harness the full power of Tailwind CSS to build visually stunning and efficient UIs.",
    image: "https://source.unsplash.com/random/800x600?design",
    tags: ["Tailwind", "UI", "CSS"],
    date: "October 22, 2025",
  },
  {
    id: 3,
    title: "Why React Still Dominates Frontend Development",
    excerpt:
      "Even with new frameworks emerging, React remains a top choice. Here’s why developers still love it.",
    image: "https://source.unsplash.com/random/800x600?reactjs",
    tags: ["React", "Frontend"],
    date: "October 18, 2025",
  },
];

const Blog = () => {
  return (
    <div>
      {/* =========================
          HERO SECTION
      ========================== */}
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

        {/* Optional Decorative Shape */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50 rounded-t-3xl"></div>
      </section>

      {/* =========================
          BLOG LIST SECTION
      ========================== */}
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
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-orange-600 transition">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>

                <div className="flex items-center justify-between text-gray-500 text-xs">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-orange-500" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaTags className="text-orange-500" />
                    <span>{blog.tags.join(", ")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
