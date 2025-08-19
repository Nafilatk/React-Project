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
      className="flex justify-center items-center h-64 bg-[#F8F4E9]"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="h-12 w-12 border-t-2 border-b-2 border-[#D2B48C] rounded-full"
      />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F8F4E9] w-full"
    >
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#5a524a] mb-2 font-serif">
            Your Shopping Cart
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-1 bg-[#800020] mx-auto"
          />
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
          >
            <FiShoppingCart className="mx-auto text-5xl text-[#5a524a] mb-4" />
            <p className="text-xl text-[#5a524a] mb-6">Your cart is empty</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBrowseProducts}
              className="px-6 py-2 bg-[#800020] text-[#F8F4E9] rounded-full shadow-md"
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
                              bg-white shadow-md hover:shadow-lg border border-[#D2B48C] gap-4"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-2/3">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-24 h-24 overflow-hidden rounded-lg"
                      >
                        <img
                          src={item.images?.[0] || item.images||"/default-product.png" }
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-product.png";
                          }}
                        />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-[#5a524a]">{item.name}</p>
                        <p className="text-[#D2B48C] text-sm">{item.category}</p>
                        <p className="font-bold text-[#800020]">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.div className="flex items-center border border-[#5a524a] rounded-lg overflow-hidden">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDecrement(item.id)}
                          className="px-3 py-1 bg-[#5a524a] text-[#F8F4E9]"
                        >
                          <FiMinus />
                        </motion.button>
                        <span className="px-3 text-md font-medium text-[#5a524a]">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleIncrement(item.id)}
                          className="px-3 py-1 bg-[#5a524a] text-[#F8F4E9]"
                        >
                          <FiPlus />
                        </motion.button>
                      </motion.div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-[#5a524a] hover:text-[#800020]"
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
              className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-[#D2B48C]"
            >
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl font-bold text-[#5a524a]">
                  Total: <span className="text-[#800020]">₹{totalPrice}</span>
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearCart}
                  className="px-4 py-2 bg-[#800020] text-[#F8F4E9] rounded-lg"
                >
                  Clear Cart
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full py-3 bg-[#800020] text-[#F8F4E9] rounded-lg text-lg font-semibold shadow-md hover:bg-[#600018] transition-colors"
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