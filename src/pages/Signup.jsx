import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiLogIn, FiArrowRight } from "react-icons/fi";

const Signup = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = {
    dark: "#181817",
    light: "#cbc0b2",
    primary: "#970112",
    secondary: "#7e6961",
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, email, password } = form;
    if (!name || !email || !password) {
      toast.warn("All fields are required");
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if user already exists
      const res = await axios.get(`http://localhost:5000/users?email=${email}`);
      if (res.data.length > 0) {
        toast.error("Email already registered");
        setIsSubmitting(false);
        return;
      }

      // Create new user
      const newUser = {
        id: uuid(),
        name,
        email,
        password,
        role: "user",
        isBlock: false,
        cart: [],
        wishlist: [],
        orders: [],
        created_at: new Date().toISOString(),
      };

      await axios.post("http://localhost:5000/users", newUser);

      toast.success("Account created successfully");
      loginUser(newUser);
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center p-4 bg-[${colors.light}]`}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`w-full max-w-md bg-[${colors.dark}] rounded-xl shadow-lg overflow-hidden p-8`}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center mb-8"
        >
          <h2 className={`text-3xl font-bold text-[${colors.primary}] mb-2`}>
            Join GlamCart
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4 }}
            className={`h-1 w-20 mx-auto bg-[${colors.secondary}]`}
          />
          <p className={`text-[${colors.secondary}] mt-3`}>
            Create your account to start shopping
          </p>
        </motion.div>

        <form onSubmit={handleSignup} className="space-y-5">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <FiUser className={`absolute left-3 top-3 text-[${colors.secondary}]`} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-3 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <FiMail className={`absolute left-3 top-3 text-[${colors.secondary}]`} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-3 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <FiLock className={`absolute left-3 top-3 text-[${colors.secondary}]`} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-3 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
              required
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-[${colors.primary}] hover:bg-[${colors.secondary}] text-[${colors.light}] rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                <FiArrowRight />
                Sign Up
              </>
            )}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={`text-sm text-center mt-6 text-[${colors.secondary}]`}
        >
          Already have an account?{" "}
          <motion.span
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/login")}
            className={`text-[${colors.primary}] cursor-pointer font-semibold inline-flex items-center gap-1`}
          >
            <FiLogIn />
            Login
          </motion.span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Signup;