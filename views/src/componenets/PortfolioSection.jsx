import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPortfolioData } from "../utilities/portfolio";

export default function PortfolioSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState({
    id: null,
    text: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await getPortfolioData();
        if (response?.success && Array.isArray(response.data)) {
          setProjects(response.data);
        } else {
          setError("Failed to load portfolio data.");
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  // Tooltip Handlers
  const handleMouseEnter = (project, e) => {
    setTooltip({
      id: project.id,
      text: project.description,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
  };

  const handleMouseLeave = () => {
    setTooltip({ id: null, text: "", x: 0, y: 0 });
  };

  return (
    <section className="relative bg-primary-200 py-10 px-3 md:px-12 lg:px-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-96 h-96 bg-primary-400/30 blur-3xl rounded-full top-20 left-10 animate-pulse" />
        <div className="absolute w-80 h-80 bg-primary-700/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse delay-2000" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 text-lg animate-pulse">
          Loading beautiful projects...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center text-red-500 text-lg">{error}</div>
      )}

      {/* Projects */}
      {!loading && !error && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid gap-5 sm:grid-cols-1 md:grid-cols-3 relative z-10"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-[350px] object-cover transform transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Permanent Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-700/70 via-primary-950/40 to-transparent flex flex-col justify-end p-6">
                  {/* Category */}
                  {project.category && (
                    <span className="absolute top-4 left-4 bg-primary-500/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-md shadow-md">
                      {project.category}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                    {project.title}
                  </h3>

                  {/* Description (tooltip trigger) */}
                  <p
                    className="text-sm text-gray-200 line-clamp-3 cursor-pointer"
                    onMouseEnter={(e) => handleMouseEnter(project, e)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    {project.description}
                  </p>

                  {/* Owner */}
                  {project.owner && (
                    <p className="text-xs text-gray-400 mt-2 italic">
                      — CEO Alphatech
                    </p>
                  )}

                  {/* Link */}
                  {project.project_url && (
                    <p className="text-start items-start justify-start flex">
                      <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-sm font-medium bg-yellow-500 rounded-2xl p-2 text-primary-100 hover:text-primary-100 transition"
                    >
                      View Project →
                    </a>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Floating Tooltip */}
      <AnimatePresence>
        {tooltip.id && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] bg-white text-primary-900 text-xs rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm pointer-events-none max-w-xs"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 40,
            }}
          >
            {tooltip.text}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
