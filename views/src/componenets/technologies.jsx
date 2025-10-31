import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";


const technologies = [
  {
    logo: "https://blinktech.com.ng/wp-content/uploads/2024/06/I-Will-Write-Javascript-Html-Css-Php-Jquery-Code-For-You.jpeg",
  },
  {
    logo: "https://www.startechup.com/wp-content/uploads/January-11-2021-Nodejs-What-it-is-used-for-and-when-where-to-use-it-for-your-enterprise-app-development.jpg.webp",
  },
  {
    logo: "https://www.elbuild.it/assets/img/techs/mysql.png",
  },
  {
    logo: "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*z5I4J44MzcC478_RVg8VdA.png",
  },
  {
    logo: "https://www.techmonitor.ai/wp-content/uploads/sites/29/2016/07/wordpress-logo-1.jpg",
  },
  {
    logo: "https://i0.wp.com/the-saltstore.com/wp-content/uploads/2023/10/React-JS.png?w=1400&ssl=1",
  },
  {
    logo: "https://www.okoone.com/wp-content/uploads/2024/10/tailwindcss-logo-400x245.png",
  },
  {
    logo: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2Fhpg6if7btrwilqkidqbe.png",
  },
  {
    logo: "https://www.okoone.com/wp-content/uploads/2024/06/firebase-logo-400x245.png",
  },
];

const Technologies = () => {

  const controls = useAnimation();
  const carouselRef = useRef(null);

  useEffect(() => {
    controls.start({
      x: ["0%", "-50%"],
      transition: {
        x: { repeat: Infinity, repeatType: "loop", duration: 20, ease: "linear" },
      },
    });
  }, [controls]);

  return (
    <>
      <section className="py-20 bg-primary-200 overflow-hidden">
        <div className="lg:px-[5rem] px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-primary-800">
            Technologies We Use
          </h2>

          <motion.div
            className="flex space-x-12 cursor-grab"
            drag="x"
            dragConstraints={{ left: -1000, right: 0 }}
            whileTap={{ cursor: "grabbing" }}
            animate={controls}
            ref={carouselRef}
          >
            {[...technologies, ...technologies].map((tech, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md min-w-[120px] hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={tech.logo}
                  alt={`Tech Logo ${index + 1}`}
                  className="w-20 h-20 object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Technologies;
