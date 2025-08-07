import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiShoppingBag, FiHome, FiGift } from "react-icons/fi";

const Success = () => {
  const [confetti, setConfetti] = useState([]);
  const colors = {
    dark: "#181817",
    light: "#cbc0b2",
    primary: "#970112",
    secondary: "#7e6961",
  };

  useEffect(() => {
    // Create confetti effect
    const newConfetti = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
      color: [colors.primary, colors.secondary][Math.floor(Math.random() * 2)],
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen text-center px-4 bg-[${colors.light}]`}>
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
            className={`absolute w-2 h-2 rounded-full bg-[${piece.color}]`}
            style={{
              left: `${piece.x}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative bg-[${colors.dark}] p-8 rounded-2xl shadow-xl max-w-md w-full mx-4`}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={`mx-auto mb-6 w-24 h-24 rounded-full bg-[${colors.primary}]/20 flex items-center justify-center`}
        >
          <FiCheckCircle className={`text-[${colors.primary}] text-5xl`} />
        </motion.div>

        <h2 className={`text-3xl font-bold text-[${colors.primary}] mb-3`}>
          Order Successful!
        </h2>
        <p className={`text-[${colors.light}] mb-8`}>
          Thank you for your purchase! Your order has been placed successfully.
          <br />
          <span className={`text-[${colors.secondary}] text-sm mt-2 block`}>
            Order ID: #{Math.floor(Math.random() * 1000000)}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/products"
            className={`flex items-center justify-center gap-2 bg-[${colors.primary}] hover:bg-[${colors.secondary}] text-[${colors.light}] px-4 py-3 rounded-lg font-medium transition-colors`}
          >
            <FiShoppingBag /> Shop More
          </Link>
          <Link
            to="/"
            className={`flex items-center justify-center gap-2 bg-transparent hover:bg-[${colors.secondary}]/20 text-[${colors.light}] px-4 py-3 rounded-lg font-medium transition-colors border border-[${colors.secondary}]`}
          >
            <FiHome /> Go Home
          </Link>
        </div>

        {/* Bonus Offer */}
        <div className={`mt-8 pt-6 border-t border-[${colors.secondary}]/30`}>
          <div className={`flex items-center justify-center gap-2 text-[${colors.secondary}] mb-2`}>
            <FiGift />
            <span className="font-medium">Special Offer</span>
          </div>
          <p className={`text-sm text-[${colors.light}]`}>
            Use code <span className={`font-bold text-[${colors.primary}]`}>WELCOME10</span> for 10% off your next order!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;