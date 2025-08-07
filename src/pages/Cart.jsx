import React, { useContext, useCallback, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

const Cart = () => {
  const {
    cart,
    totalPrice,
    removeFromCart,
    clearCart,
    incrementQty,
    decrementQty,
    loading,
    loadCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const colors = {
    dark: "#181817",
    light: "#cbc0b2",
    primary: "#550b14",
    secondary: "#7e6961",
  };

  useEffect(() => {
    if (loadCart) loadCart();
  }, [loadCart]);

  // Memoized handlers
  const handleRemove = useCallback((id) => removeFromCart(id), [removeFromCart]);
  const handleIncrement = useCallback((id) => incrementQty(id), [incrementQty]);
  const handleDecrement = useCallback((id) => decrementQty(id), [decrementQty]);
  const handleClearCart = useCallback(() => clearCart(), [clearCart]);
  const handleCheckout = useCallback(() => navigate("/checkout"), [navigate]);
  const handleBrowseProducts = useCallback(() => navigate("/products"), [navigate]);

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-64 bg-[#cbc0b2]"
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
      className="min-h-screen bg-[#cbc0b2] w-full"
    >
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#181817] mb-2">
            Your Shopping Cart
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-1 bg-[#970112] mx-auto"
          />
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
          >
            <FiShoppingCart className="mx-auto text-5xl text-[#181817] mb-4" />
            <p className="text-xl text-[#181817] mb-6">Your cart is empty</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBrowseProducts}
              className="px-6 py-2 bg-[#550b14] text-[#cbc0b2] rounded-full shadow-md"
            >
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <>
            <AnimatePresence>
              <div className="space-y-6 mb-8">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-xl
                              bg-[#cbc0b2] shadow-md hover:shadow-lg border border-[#7e6961] gap-4"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-2/3">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-24 h-24 overflow-hidden rounded-lg"
                      >
                        <img
                          src={item.image?.[0] || item.image || "/default-product.png"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-product.png";
                          }}
                        />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-[#181817]">{item.name}</p>
                        <p className="text-[#7e6961] text-sm">{item.category}</p>
                        <p className="font-bold text-[#181817]">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.div className="flex items-center border border-[#181817] rounded-lg overflow-hidden">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDecrement(item.id)}
                          className="px-3 py-1 bg-[#181817] text-[#cbc0b2]"
                        >
                          <FiMinus />
                        </motion.button>
                        <span className="px-3 text-md font-medium text-[#181817]">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleIncrement(item.id)}
                          className="px-3 py-1 bg-[#181817] text-[#cbc0b2]"
                        >
                          <FiPlus />
                        </motion.button>
                      </motion.div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-[#181817] hover:text-[#550b14]"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#cbc0b2] p-6 rounded-xl shadow-sm mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl font-bold text-[#181817]">
                  Total: <span className="text-[#550b14]">₹{totalPrice}</span>
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearCart}
                  className="px-4 py-2 bg-[#550b14] text-[#cbc0b2] rounded-lg"
                >
                  Clear Cart
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full py-3 bg-[#550b14] text-[#cbc0b2] rounded-lg text-lg font-semibold shadow-md"
              >
                Proceed to Checkout
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(Cart);