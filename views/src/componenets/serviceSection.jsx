import React from "react";
import { FaDesktop, FaMobileAlt, FaCloud, FaPalette, FaDatabase, FaTools } from "react-icons/fa";
import { motion } from "framer-motion";

// Card animation (scroll-in) variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

// Icon animation variants
const iconVariants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const ServiceSection = () => {
  return (
    <section className="bg-purple-100 py-16 px-6 pc:px-[5rem]">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-primary-800 mb-4">Our Services</h2>
        <p className="text-primary-700 max-w-2xl mx-auto">
          Discover our cutting-edge software solutions and exceptional user experiences.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 tab:grid-cols-2 pc:grid-cols-3">
        {/* Website Development */}
        <motion.div
          className="bg-primary-50 p-6 rounded-xl border border-primary-200 shadow-sm shadow-primary-800 hover:shadow-lg hover:shadow-primary-800 transition-shadow duration-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={cardVariants}
        >
          <motion.div
            className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-primary-700"
            variants={iconVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.2 }}
            viewport={{ once: true }}
          >
            <FaDesktop className="text-white text-3xl" />
          </motion.div>
          <h3 className="text-primary-800 font-semibold text-lg mb-2">Website Development</h3>
          <p className="text-primary-700 text-base">
            Our collaborative team innovates your online presence, turning ideas into reality. We deliver solutions, from simple business websites to intricate e-commerce platforms, setting you apart from the competition.
          </p>
        </motion.div>

        {/* Mobile App Development */}
        <motion.div
          className="bg-primary-50 p-6 rounded-xl border border-primary-200 shadow-sm shadow-primary-800 hover:shadow-lg hover:shadow-primary-800 transition-shadow duration-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          variants={cardVariants}
        >
          <motion.div
            className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-yellow-400"
            variants={iconVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.2 }}
            viewport={{ once: true }}
          >
            <FaMobileAlt className="text-primary-700 text-3xl" />
          </motion.div>
          <h3 className="text-primary-800 font-semibold text-lg mb-2">Mobile App Development</h3>
          <p className="text-primary-700 text-base">
            Trust us for outstanding iOS and Android apps, meticulously designed for a captivating user experience. From concept to testing, we bring your mobile app vision to life, propelling your business forward.
          </p>
        </motion.div>

        {/* Cloud App Development */}
        <motion.div
          className="bg-primary-50 p-6 rounded-xl border border-primary-200 shadow-sm shadow-primary-800 hover:shadow-lg hover:shadow-primary-800 transition-shadow duration-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          variants={cardVariants}
        >
          <motion.div
            className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-primary-700"
            variants={iconVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.2 }}
            viewport={{ once: true }}
          >
            <FaCloud className="text-white text-3xl" />
          </motion.div>
          <h3 className="text-primary-800 font-semibold text-lg mb-2">Cloud App Development</h3>
          <p className="text-primary-700 text-base">
            Modern web and mobile products demand a robust, scalable backend operating on cloud infrastructure. Ensure seamless performance and flexibility for your applications with our reliable backend solutions.
          </p>
        </motion.div>

        {/* UI & UX Designing */}
        <motion.div
          className="bg-primary-50 p-6 rounded-xl border border-primary-200 shadow-sm shadow-primary-800 hover:shadow-lg hover:shadow-primary-800 transition-shadow duration-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          variants={cardVariants}
        >
          <motion.div
            className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-cyan-400"
            variants={iconVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.2 }}
            viewport={{ once: true }}
          >
            <FaPalette className="text-primary-700 text-3xl" />
          </motion.div>
          <h3 className="text-primary-800 font-semibold text-lg mb-2">UI & UX Designing</h3>
          <p className="text-primary-700 text-base">
            Our designers harmonize aesthetics with functionality, creating visually stunning interfaces and engaging user experiences for seamless interactions, enhancing online brand presence.
          </p>
        </motion.div>

        {/* Data Science */}
        <motion.div
          className="bg-primary-50 p-6 rounded-xl border border-primary-200 shadow-sm shadow-primary-800 hover:shadow-lg hover:shadow-primary-800 transition-shadow duration-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={4}
          variants={cardVariants}
        >
          <motion.div
            className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-primary-700"
            variants={iconVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.2 }}
            viewport={{ once: true }}
          >
            <FaDatabase className="text-white text-3xl" />
          </motion.div>
          <h3 className="text-primary-800 font-semibold text-lg mb-2">Data Management</h3>
          <p className="text-primary-700 text-sm">
            Empowering clients to overcome complex data challenges, we optimize database performance, ensure data integrity, and enable secure, scalable systems that drive efficiency, support decision-making, and strengthen business strategies.
          </p>
        </motion.div>

        {/* Product Management */}
        <motion.div
          className="bg-primary-50 p-6 rounded-xl border border-primary-200 shadow-sm shadow-primary-800 hover:shadow-lg hover:shadow-primary-800 transition-shadow duration-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={5}
          variants={cardVariants}
        >
          <motion.div
            className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-yellow-400"
            variants={iconVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.2 }}
            viewport={{ once: true }}
          >
            <FaTools className="text-primary-700 text-3xl" />
          </motion.div>
          <h3 className="text-primary-800 font-semibold text-lg mb-2">Web Management</h3>
          <p className="text-primary-700 text-base">
            Delivering tailored web management solutions, we align online strategies with business goals, optimize digital processes, and integrate best practices. Our flexible approach ensures adaptability to change while focusing on what matters most for long-term success.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceSection;
