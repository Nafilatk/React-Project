import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiClock, FiShoppingBag } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Color palette
  const colors = {
    dark: "#181817",
    light: "#cbc0b2",
    primary: "#970112",
    secondary: "#7e6961",
  };

  useEffect(() => {
    if (!user) {
      toast.warn("Please login to view your orders");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${user.id}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        toast.error("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex justify-center items-center h-64 bg-[${colors.light}]`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="h-12 w-12 border-t-2 border-b-2 border-[#7e6961] rounded-full"
      />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen bg-[${colors.light}] py-10 px-4 sm:px-6`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className={`text-2xl md:text-3xl font-bold text-[${colors.dark}]`}>
            <FiPackage className="inline mr-2" /> My Orders
          </h2>
          <span className={`text-sm text-[${colors.secondary}]`}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </span>
        </motion.div>

        <AnimatePresence>
          {orders.length === 0 ? (
            <motion.div
              key="empty-orders"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`bg-[${colors.dark}] rounded-xl p-8 text-center`}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FiShoppingBag className={`mx-auto text-4xl text-[${colors.secondary}] mb-4`} />
              </motion.div>
              <h3 className={`text-xl text-[${colors.light}] mb-2`}>No Orders Yet</h3>
              <p className={`text-[${colors.secondary}] mb-6`}>Your order history will appear here</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/products')}
                className={`bg-[${colors.primary}] hover:bg-[${colors.secondary}] text-[${colors.light}] px-6 py-2 rounded-lg transition-colors`}
              >
                Start Shopping
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="orders-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {orders.map((order, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`bg-[${colors.dark}] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-[${colors.secondary}]/30`}
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(order.id)}
                  >
                    <img
                      src={order.image || order.images?.[0] || "/placeholder.jpg"}
                      alt={order.name || "Product"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 
                        className={`text-lg font-semibold text-[${colors.light}] cursor-pointer hover:text-[${colors.primary}] transition-colors`}
                        onClick={() => handleProductClick(order.id)}
                      >
                        {order.name}
                      </h3>
                    </div>
                  </motion.div>

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-sm text-[${colors.secondary}] capitalize`}>{order.category}</span>
                      <span className={`text-sm font-medium text-[${colors.primary}]`}>
                        {order.quantity || 1} × ₹{order.price}
                      </span>
                    </div>

                    <div className={`flex justify-between items-center pt-3 border-t border-[${colors.secondary}]/20`}>
                      <div className="flex items-center gap-1">
                        <FiClock className={`text-[${colors.secondary}]`} />
                        <span className={`text-xs text-[${colors.secondary}]`}>
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`font-bold text-[${colors.light}]`}>
                        ₹{(order.price * (order.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Orders;