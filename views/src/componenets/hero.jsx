import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { FaArrowRight, FaUsers, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../utilities/authContext";

const Hero = () => {
    const { settings } = useAuth();
  const { scrollY } = useViewportScroll();
  const floatY1 = useTransform(scrollY, [0, 800], [0, -50]);
  const floatY2 = useTransform(scrollY, [0, 800], [0, 60]);
  const floatY3 = useTransform(scrollY, [0, 800], [0, -30]);

  const taglines = [
    "Innovation That Inspires",
    "Design Meets Performance",
    "Next-Gen Software Solutions",
    "Empowering Your Digital Presence",
  ];
  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTagline((prev) => (prev + 1) % taglines.length),
      3500
    );
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { icon: <FaCheckCircle />, label: "220+ Projects" },
    { icon: <FaUsers />, label: "90+ Industries" },
    { icon: <FaCheckCircle />, label: "99% Satisfaction" },
  ];

  // Generate random particle positions
  const particleCount = 15;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    size: Math.random() * 6 + 2,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.5 + 0.2,
    delay: Math.random() * 2,
  }));

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-primary-950 overflow-hidden flex items-center justify-center px-4 sm:px-6 md:px-12 lg:pt-36 lg:px-24">
      {/* Floating Neon Shapes */}
      <motion.div
        style={{ y: floatY1 }}
        className="absolute w-64 sm:w-80 md:w-[500px] h-64 sm:h-80 md:h-[500px] rounded-full bg-gradient-to-tr from-pink-500 to-primary-600 opacity-40 blur-[80px] sm:blur-[100px] md:blur-[120px] top-[-80px] left-[-80px] rotate-[30deg]"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: floatY2 }}
        className="absolute w-72 sm:w-96 md:w-[600px] h-72 sm:h-96 md:h-[600px] rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-30 blur-[100px] sm:blur-[120px] md:blur-[150px] bottom-[-120px] right-[-120px]"
        animate={{ rotate: [0, -20, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ y: floatY3 }}
        className="absolute w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 opacity-30 blur-[90px] sm:blur-[110px] md:blur-[130px] top-1/4 right-[-80px]"
        animate={{ rotate: [0, 25, -25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particle-like floating dots */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute bg-white rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            opacity: p.opacity,
          }}
          animate={{ y: [0, 10, 0], x: [0, 10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4 + Math.random() * 3,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl gap-6 sm:gap-8 md:gap-12">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left space-y-4 sm:space-y-6 md:space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Alphatech{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-primary-500 animate-gradient-x">
              Innovation Hub
            </span>
          </h1>

          {/* Animated Gradient Tagline */}
          <motion.p
            key={currentTagline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-500 animate-gradient-x"
          >
            {taglines[currentTagline]}
          </motion.p>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-md sm:max-w-lg md:max-w-xl mx-auto md:mx-0">
            {settings?.description || ""}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 justify-center md:justify-start">
            <motion.div whileHover={{ scale: 1.05 }}>
              <NavLink
                to="/hire-us"
                className="px-5 py-2 sm:px-4  bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-lg flex items-center gap-2 transition-transform text-sm sm:text-base"
              >
                Get Started <FaArrowRight />
              </NavLink>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <NavLink
                to="/pricing"
                className="px-5 py-2 sm:px-4  border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-gray-900 transition text-sm sm:text-base flex items-center justify-center"
              >
                Explore Pricing
              </NavLink>
            </motion.div>
          </div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, staggerChildren: 0.2 }}
            className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-10 justify-center md:justify-start text-white text-sm sm:text-base"
          >
            {metrics.map((metric, idx) => (
              <motion.div key={idx} className="flex flex-col items-center">
                <metric.icon.type className="text-xl sm:text-2xl mb-1 text-yellow-400" />
                <span className="text-sm sm:text-base md:text-lg font-semibold">
                  {metric.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Side Panel */}
        <motion.div
          style={{ y: useTransform(scrollY, [0, 800], [0, -20]) }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="hidden md:flex flex-col items-start gap-4 p-4 w-60 sm:w-72 lg:w-80 bg-white/5 backdrop-blur-md rounded-xl text-white shadow-lg"
        >
          <h3 className="text-lg sm:text-xl font-bold text-yellow-400">
            Why Choose Us?
          </h3>
          <ul className="space-y-2 text-sm sm:text-base">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-yellow-400" /> Cutting-edge
              Technology
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-yellow-400" /> Reliable & Scalable
              Solutions
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-yellow-400" /> Expert Team Support
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-yellow-400" /> Customer
              Satisfaction
            </li>
          </ul>
          <p className="text-gray-200 text-sm sm:text-base mt-2">
            Partner with Alphatech to accelerate your digital transformation and
            achieve measurable results.
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xl sm:text-2xl md:text-3xl"
      >
        ⬇
      </motion.div>
    </section>
  );
};

export default Hero;
