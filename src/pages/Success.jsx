import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiShoppingBag, FiHome, FiGift } from "react-icons/fi";

const Success = () => {
  const [confetti, setConfetti] = useState([]);
  
  // Updated color palette from screenshot
  const colors = {
    tan: "#E6D5C3",       // TAN
    burgundy: "#800020",   // BURGUNDY
    cream: "#F5F0E8",      // CREAM
    dark: "#181817",       // Keeping dark for text
  };

  useEffect(() => {
    // Create confetti effect with new colors
    const newConfetti = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
      color: [colors.burgundy, colors.tan][Math.floor(Math.random() * 2)],
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen text-center px-4" 
      style={{ backgroundColor: colors.cream }}
    >
      {/* Confetti Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ y: piece.y, x: `${piece.x}%`, rotate: 0 }}
            animate={{
              y: "100vh",
              rotate: piece.rotation,
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: piece.delay,
              repeatDelay: 5,
              repeat: Infinity,
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${piece.x}%`,
              backgroundColor: piece.color,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative p-8 rounded-2xl shadow-xl max-w-md w-full mx-4"
        style={{ backgroundColor: colors.dark }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${colors.burgundy}20` }} // 20% opacity
        >
          <FiCheckCircle 
            className="text-5xl" 
            style={{ color: colors.burgundy }} 
          />
        </motion.div>

        <h2 
          className="text-3xl font-bold mb-3"
          style={{ color: colors.burgundy }}
        >
          Order Successful!
        </h2>
        <p 
          className="mb-8"
          style={{ color: colors.cream }}
        >
          Thank you for your purchase! Your order has been placed successfully.
          <br />
          <span 
            className="text-sm mt-2 block"
            style={{ color: colors.tan }}
          >
            Order ID: #{Math.floor(Math.random() * 1000000)}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: colors.burgundy,
              color: colors.cream,
              hover: { backgroundColor: colors.tan }
            }}
          >
            <FiShoppingBag /> Shop More
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors border"
            style={{ 
              backgroundColor: 'transparent',
              color: colors.cream,
              borderColor: colors.tan,
              hover: { backgroundColor: `${colors.tan}20` } // 20% opacity
            }}
          >
            <FiHome /> Go Home
          </Link>
        </div>

        {/* Bonus Offer */}
        <div 
          className="mt-8 pt-6"
          style={{ borderTop: `1px solid ${colors.tan}30` }} // 30% opacity
        >
          <div 
            className="flex items-center justify-center gap-2 mb-2"
            style={{ color: colors.tan }}
          >
            <FiGift />
            <span className="font-medium">Special Offer</span>
          </div>
          <p style={{ color: colors.cream }} className="text-sm">
            Use code <span 
              className="font-bold"
              style={{ color: colors.burgundy }}
            >WELCOME10</span> for 10% off your next order!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;