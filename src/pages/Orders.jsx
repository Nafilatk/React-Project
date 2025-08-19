import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiClock,
  FiShoppingBag,
  FiCheckCircle,
  FiTruck,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Color palette
  const colors = {
    tan: "#E6D5C3",
    cream: "#F5F0E8",
    burgundy: "#800020",
    darkBurgundy: "#600018",
    textDark: "#333333",
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
        const ordersData = Array.isArray(res.data?.orders)
          ? res.data.orders.map((order, index) => ({
              ...order,
              id: order.id || `order-${index}-${Date.now()}`,
              items: order.items || [],
              total: order.total || 0,
              status: order.status || "Processing",
              date: order.date || new Date().toISOString(),
            }))
          : [];

        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <FiCheckCircle className="text-green-500" />;
      case "shipped":
        return <FiTruck className="text-blue-500" />;
      default:
        return <FiClock className="text-orange-500" />;
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-64"
        style={{ backgroundColor: colors.cream }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 rounded-full"
          style={{ borderColor: colors.burgundy }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: colors.cream }}
      >
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: colors.burgundy }}
          >
            Error Loading Orders
          </h2>
          <p className="mb-4" style={{ color: colors.textDark }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-cream px-4 py-2 rounded"
            style={{ backgroundColor: colors.burgundy }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8 px-4 sm:px-6"
      style={{ backgroundColor: colors.cream }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: colors.darkBurgundy }}
          >
            <FiPackage className="inline mr-2" /> My Orders
          </h2>
          <span className="text-sm" style={{ color: colors.burgundy }}>
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        <AnimatePresence>
          {orders.length === 0 ? (
            <motion.div
              key="empty-orders"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 text-center shadow-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FiShoppingBag
                  className="mx-auto text-4xl"
                  style={{ color: colors.burgundy }}
                />
              </motion.div>
              <h3
                className="text-xl mb-2"
                style={{ color: colors.darkBurgundy }}
              >
                No Orders Yet
              </h3>
              <p className="mb-6" style={{ color: colors.textDark }}>
                Your order history will appear here
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/products")}
                className="text-cream px-6 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: colors.burgundy }}
              >
                Start Shopping
              </motion.button>
            </motion.div>
          ) : (
            <motion.ul className="space-y-4">
              {orders.map((order) => (
                <motion.li
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(order.status)}
                          <span
                            className="text-sm capitalize"
                            style={{ color: colors.textDark }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: colors.textDark }}>
                          Ordered on:{" "}
                          {new Date(order.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-lg font-bold block"
                          style={{ color: colors.burgundy }}
                        >
                          ₹{order.total.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 cursor-pointer"
                          onClick={() => handleProductClick(item.id)}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                            }}
                          />
                          <div className="flex-1">
                            <h3
                              className="text-md font-semibold mb-1"
                              style={{ color: colors.darkBurgundy }}
                            >
                              {item.name}
                            </h3>
                            <p
                              className="text-sm"
                              style={{ color: colors.textDark }}
                            >
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span
                            className="font-medium"
                            style={{ color: colors.burgundy }}
                          >
                            ₹{item.price}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      className="flex justify-between items-center mt-4 pt-3"
                      style={{ borderTop: `1px solid ${colors.tan}` }}
                    >
                      <div
                        className="text-sm"
                        style={{ color: colors.textDark }}
                      >
                        Order #: {order.id.slice(0, 8)}
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: colors.burgundy }}
                      >
                        Payment: {order.paymentMethod || "N/A"}
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Orders;
