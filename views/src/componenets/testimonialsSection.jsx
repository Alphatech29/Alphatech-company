// TestimonialCarousel.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTestimonies } from "../utilities/testimonies";

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch testimonies from API
  useEffect(() => {
    const fetchData = async () => {
      const response = await getTestimonies();

      if (response.success && Array.isArray(response.data)) {
        setTestimonials(response.data);
      } else {
        console.error("Failed to load testimonies:", response.message);
      }
    };

    fetchData();
  }, []);

  // Convert rating number to star icons
  const renderStars = (rating) => {
    if (!rating || rating <= 0) return null;
    const totalStars = 5;
    const filledStars = Math.round((rating / 10) * totalStars);

    return (
      <div className="flex justify-center mt-2">
        {Array.from({ length: totalStars }, (_, i) => (
          <span key={i} className={`text-yellow-500 text-sm ${i < filledStars ? "" : "opacity-30"}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
      <div className="lg:px-[5rem] px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-12">
          What Our Clients Say
        </h2>

        <div
          className="relative flex overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex gap-6"
            animate={{ x: isHovered ? 0 : ["0%", "-100%"] }}
            transition={{
              ease: "linear",
              duration: 40,
              repeat: isHovered ? 0 : Infinity,
            }}
          >
            {[...testimonials, ...testimonials].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-2xl p-6 w-[300px] flex-shrink-0"
              >
                <p className="text-primary-700 text-sm leading-relaxed text-center">
                  “{testimonial.message}”
                </p>
                <h3 className="mt-4 text-sm font-semibold text-primary-900">
                  {testimonial.name}
                </h3>
                <span className="text-xs text-primary-500">
                  {testimonial.position || "Client"}
                </span>
                {renderStars(testimonial.rating)}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
