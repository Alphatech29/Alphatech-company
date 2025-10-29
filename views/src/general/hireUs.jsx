import { NavLink } from "react-router-dom";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaWhatsapp,
  FaCalendarAlt,
} from "react-icons/fa";

export default function HireUs({
  theme = "from-primary-950 to-secondary-500",
  text = "text-primary-200",
}) {
  useEffect(() => {
    document.title =
      "Hire Us | We create digital solutions that enhance communication and growth.";
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      <div
        className={`bg-gradient-to-br ${theme} ${text} min-h-screen flex flex-col`}
      >
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-40">
          <h1 className="text-5xl font-bold mb-4">Work With Us</h1>
          <p className="max-w-2xl text-lg opacity-80">
            We are a trusted software development company helping startups and
            enterprises build scalable, secure, and innovative digital
            solutions. From idea to launch, we deliver technology that drives
            growth and efficiency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {/* Get Started Button */}
            <a
              href="https://wa.me/2349129079450?text=Hello%20Alphatech%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-200 text-black px-6 py-3 rounded-2xl shadow-lg font-semibold hover:scale-105 transition"
            >
              Get Started
            </a>
          </div>
        </section>

        {/* Services Section */}
        <section className="grid md:grid-cols-3 gap-8 px-8 lg:px-[5rem] py-16">
          {[
            {
              title: "Web Development",
              desc: "Responsive, scalable, and modern websites powered by the latest technologies.",
            },
            {
              title: "Mobile Apps",
              desc: "Cross-platform and native mobile apps that deliver seamless user experiences.",
            },
            {
              title: "UI/UX Design",
              desc: "Intuitive, user-centered designs that enhance engagement and usability.",
            },
            {
              title: "Cloud Solutions",
              desc: "Robust cloud infrastructure to ensure security, flexibility, and scalability.",
            },
            {
              title: "Custom Software",
              desc: "Tailored solutions that fit your business needs and accelerate growth.",
            },
            {
              title: "Brand Strategy",
              desc: "Crafting digital strategies to strengthen your brand and presence in the market.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-primary-200/10 backdrop-blur-lg rounded-2xl p-8 hover:translate-y-[-5px] transition transform shadow-lg"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="opacity-80">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Why Choose Us */}
        <section className="px-8 py-20 text-center bg-primary-200/5">
          <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
          <p className="max-w-3xl mx-auto text-lg opacity-80 mb-10">
            With a team of experienced engineers, designers, and strategists, we
            deliver solutions that combine technical excellence with creative
            vision. Our agile process ensures transparency, on-time delivery,
            and results that align with your business goals.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { stat: "220+", label: "Projects Delivered" },
              { stat: "90+", label: "Industries Served" },
              { stat: "100%", label: "Client Satisfaction" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-primary-200/10 rounded-xl p-6 shadow-lg"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="text-4xl font-bold mb-2">{item.stat}</h3>
                <p className="opacity-80">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security & Trust Section */}
        <section className="px-8 py-20 text-center">
          <motion.h2
            className="text-3xl font-bold mb-6"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Security & Trust
          </motion.h2>
          <motion.p
            className="max-w-3xl mx-auto text-lg opacity-80 mb-10"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Your data security is our top priority. We follow best practices in
            cybersecurity, encryption, and compliance standards to ensure your
            information stays safe and protected.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <FaShieldAlt size={40} className="text-green-400" />,
                title: "Data Encryption",
                desc: "We use enterprise-grade encryption to secure sensitive information.",
              },
              {
                icon: <FaLock size={40} className="text-blue-400" />,
                title: "Secure Infrastructure",
                desc: "Our systems are built with multi-layered defenses against cyber threats.",
              },
              {
                icon: <FaUserShield size={40} className="text-orange-400" />,
                title: "Privacy First",
                desc: "Your privacy is central — we never compromise user confidentiality.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-primary-200/10 rounded-xl p-8 shadow-lg flex flex-col items-center text-center"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {item.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">
                  {item.title}
                </h3>
                <p className="opacity-80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Us Fast Section */}
        <section className="px-8 py-20 text-center bg-primary-200/10">
          <h2 className="text-3xl font-bold mb-6">Reach Us Fast</h2>
          <p className="max-w-2xl mx-auto text-lg opacity-80 mb-10">
            Need to get in touch quickly? Connect with us instantly through
            WhatsApp or schedule a consultation.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a
              href="https://wa.me/2349129079450?text=Hello%20Alphatech%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              <FaWhatsapp size={24} /> Chat on WhatsApp
            </a>
            <NavLink
              to="/book-a-consultation"
              className="flex items-center gap-3 bg-primary-500 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              <FaCalendarAlt size={24} /> Book a Consultation
            </NavLink>
          </div>
        </section>
      </div>
    </>
  );
}
