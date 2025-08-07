import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiLogIn, FiUserPlus } from "react-icons/fi";

const Login = () => {
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
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) {
      toast.warn("Please enter email and password");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/users?email=${email}&password=${password}`
      );

      if (res.data.length === 0) {
        toast.error("Invalid credentials");
        return;
      }

      const user = res.data[0];

      if (user.isBlock) {
        toast.error("Your account has been blocked");
        return;
      }

      loginUser(user);
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      toast.error("Login failed");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex items-center justify-center bg-[${colors.light}] p-4`}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
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
            Welcome Back
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4 }}
            className={`h-1 w-20 mx-auto bg-[${colors.secondary}]`}
          />
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <FiMail className={`absolute left-3 top-3 text-[${colors.secondary}]`} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
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
                Processing...
              </>
            ) : (
              <>
                <FiLogIn />
                Login
              </>
            )}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`text-sm text-center mt-6 text-[${colors.secondary}]`}
        >
          Don't have an account?{" "}
          <motion.span
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/signup")}
            className={`text-[${colors.primary}] cursor-pointer font-semibold inline-flex items-center gap-1`}
          >
            <FiUserPlus />
            Sign up
          </motion.span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Login;