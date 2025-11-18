import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FAQ from "../componenets/faq";
import { NavLink } from "react-router-dom";
import { getCeoBio } from "../utilities/founder";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function AboutUs() {
  const [ceo, setCeo] = useState(null);

  useEffect(() => {
    document.title =
      "About Us | Empowering businesses with innovation, creativity, and growth.";

    const metaDescription = document.querySelector("meta[name='description']");
    const descriptionContent =
      "Learn about our journey, values, and leadership. We are a forward-thinking company driven by innovation and led by visionary minds.";
    if (metaDescription) {
      metaDescription.setAttribute("content", descriptionContent);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = descriptionContent;
      document.head.appendChild(meta);
    }

    // Fetch CEO bio once
    const fetchCeo = async () => {
      const result = await getCeoBio();
      if (result.success && result.data.length > 0) {
        setCeo(result.data[0]);
      }
    };

    fetchCeo();
  }, []);

  return (
    <div className="bg-gradient-to-b from-primary-950 via-primary-700 to-primary-950 text-primary-100 px-4 sm:px-6 lg:px-20 py-10 sm:py-14 lg:py-20">
      {/* Hero Section */}
      <motion.div
        className="pt-20 mt-10 sm:mt-14 lg:mt-20 text-center py-16 sm:py-20"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          We are <span className="text-primary">Redefining Innovation</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-sm sm:text-base lg:text-lg">
          A global company transforming ambitious ideas into scalable products.
          With creativity, strategy, and technology, we empower businesses to
          grow beyond limits.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <NavLink
            to="/hire-us"
            className="rounded-full bg-primary-900 px-5 sm:px-6 py-2 sm:py-3 font-medium text-white shadow-md shadow-primary-800 hover:bg-primary-800/90 transition text-sm sm:text-base"
          >
            Work with us
          </NavLink>
          <NavLink
            to="/portfolio"
            className="rounded-full border border-primary-700 px-5 sm:px-6 py-2 sm:py-3 font-medium text-gray-200 hover:bg-primary-800 transition text-sm sm:text-base"
          >
            Our work
          </NavLink>
        </div>
      </motion.div>

      {/* Company Story */}
      <motion.div
        className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center py-7 sm:py-16"
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Who We Are</h2>
          <p className="mt-4 text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
            Founded with the mission to disrupt industries through technology,
            we are a multidisciplinary team passionate about design, engineering,
            and innovation. Our focus is on creating solutions that not only
            meet today’s challenges but also anticipate tomorrow’s opportunities.
          </p>
          <p className="mt-4 text-gray-400 text-xs sm:text-sm lg:text-base">
            From startups to enterprises, we have collaborated with 100+ brands
            across 20+ countries. Our DNA is rooted in innovation, collaboration,
            and long-term impact.
          </p>
        </div>
        <motion.div
          className="rounded-2xl bg-gradient-to-br from-primary/20 to-transparent p-6 border border-primary/30"
          variants={fadeInUp}
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-3">What We Do</h3>
          <ul className="space-y-3 text-gray-300 text-xs sm:text-sm lg:text-base">
            <li>🚀 Digital Product Development</li>
            <li>🎨 Creative & Brand Design</li>
            <li>📊 Data-driven Business Strategies</li>
            <li>🌍 Global Expansion Solutions</li>
          </ul>
        </motion.div>
      </motion.div>

     {/* Founder / CEO Section */}
{ceo && (
  <motion.div
    className="relative bg-gradient-to-r from-primary-900 via-primary-700 to-primary-950 py-16 sm:py-20 rounded-3xl overflow-hidden"
    variants={fadeInUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-10 items-center">
      <div className="relative group w-full h-72 sm:h-96 lg:h-[500px] overflow-hidden rounded-3xl border border-gray-700 shadow-lg">
        <img
          src={ceo.avatar || "/ceo.jpg"}
          alt={ceo.full_name}
          className="w-full h-full object-cover transform transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>
      <div className="space-y-6 text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
          Meet Our <span className="text-primary">Founder & CEO</span>
        </h2>
        <p
          className="text-gray-300 leading-relaxed text-base sm:text-base"
          dangerouslySetInnerHTML={{ __html: ceo.bio.split("\r\n")[0] }}
        />

        <div className="mt-6">
          <p className="text-primary font-extrabold text-lg tracking-wide italic">
            — {ceo.full_name}
          </p>
          <p className="text-gray-300 text-xs sm:text-sm">{ceo.role}</p>
        </div>
      </div>
    </div>
  </motion.div>
)}


      {/* Message from the CEO */}
      <motion.div
        className="max-w-4xl mx-auto py-12 sm:py-16 text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="rounded-2xl border border-primary-700 bg-primary-800/40 p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
            A Message from the CEO
          </h2>
          <p className="text-primary-300 leading-relaxed italic text-sm sm:text-base lg:text-lg">
            “When I founded this company, my vision was clear: to create a space
            where innovation meets impact. Every project we take on is not just
            about solving problems, but about shaping the future. I believe in
            empowering teams, celebrating creativity, and delivering solutions
            that truly matter.”
          </p>
          <p className="mt-6 text-primary font-semibold text-sm sm:text-base lg:text-lg">
            — {ceo?.full_name}, {ceo?.role}
          </p>
        </div>
      </motion.div>

      {/* Core Values Section */}
      <motion.div
        className="max-w-6xl mx-auto py-12 sm:py-16"
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10">
          Our Core Values
        </h2>
        <div className="grid gap-6 sm:grid-cols lg:grid-cols-3">
          {[
            {
              title: "Innovation First",
              desc: "We push boundaries to deliver creative, future-ready solutions.",
            },
            {
              title: "People-Centric",
              desc: "Our focus is on empowering people—clients, teams, and communities.",
            },
            {
              title: "Excellence",
              desc: "We execute with precision, accountability, and pride.",
            },
          ].map((value) => (
            <motion.div
              key={value.title}
              className="rounded-2xl border border-primary-700 bg-primary-800/40 p-6"
              variants={fadeInUp}
            >
              <h3 className="font-semibold text-base sm:text-lg text-primary">
                {value.title}
              </h3>
              <p className="mt-2 text-primary-400 text-xs sm:text-sm lg:text-base">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <FAQ />

      {/* CTA Section */}
      <motion.div
        className="max-w-5xl mx-auto py-16 sm:py-20 text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="rounded-3xl border border-primary-700 bg-gradient-to-r from-primary/10 to-transparent p-6 sm:p-10">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Let’s Build the Future Together
          </h3>
          <p className="mt-3 text-primary-400 text-sm sm:text-base lg:text-lg">
            Whether you’re a startup or an enterprise, we’re here to help bring
            your vision to life.
          </p>
          <NavLink
            to="/hire-us"
            className="mt-6 rounded-full bg-primary px-5 sm:px-6 py-2 sm:py-3 font-medium text-white shadow-md hover:bg-primary/90 transition text-sm sm:text-base"
          >
            Start a Project
          </NavLink>
        </div>
      </motion.div>
    </div>
  );
}
