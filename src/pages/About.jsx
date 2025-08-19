import React from "react";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";

const About = () => {
  const colors = {
    tan: "#E6D5C3",       // Primary background color
    cream: "#F5F0E8",     // Page background
    burgundy: "#800020",   // Primary accent color
    darkBurgundy: "#600018" // Darker burgundy for hover states
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 bg-[#F5F0E8]"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <motion.h1 
            variants={item}
            className="text-3xl md:text-4xl font-bold text-[#800020] mb-8"
          >
            About GlamCart
          </motion.h1>

          <motion.p 
            variants={item}
            className="text-lg mb-6 leading-relaxed text-[#333333]"
          >
            Welcome to <span className="font-semibold text-[#800020]">GlamCart</span>, your ultimate destination for women's topwear fashion. 
            Our store is dedicated to celebrating modern elegance, empowering women to express themselves through style — whether it's a casual day out or a formal event.
          </motion.p>

          <motion.p 
            variants={item}
            className="text-lg mb-6 leading-relaxed text-[#333333]"
          >
            We offer a hand-picked collection of women's <span className="font-medium text-[#800020]">T-shirts, Shirts, Tops, Tank Tops, Jackets, Formal Tops, Dresses</span>, and more. 
            At GlamCart, we believe that every woman deserves to feel confident, comfortable, and classy.
          </motion.p>

          <motion.p 
            variants={item}
            className="text-lg mb-8 leading-relaxed text-[#333333]"
          >
            💡 Our mission is to provide a smooth and personalized shopping experience with the help of smart tech — from wishlists and carts to smooth checkout.
          </motion.p>

          <motion.div 
            variants={item}
            className="mt-10 flex items-center justify-center gap-2 text-[#800020]"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FiHeart className="text-2xl" />
            </motion.div>
            <p className="font-semibold">Team GlamCart</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;