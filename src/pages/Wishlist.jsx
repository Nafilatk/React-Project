import React, { useContext, useCallback } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingBag, FiTrash2, FiHeart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const { user, isLoading } = useContext(AuthContext);
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleMoveToCart = useCallback(async (product) => {
    if (isLoading) return;

    if (!user) {
      toast.warn("Please login to add to cart");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      const currentCart = res.data.cart || [];
      
      if (currentCart.some(item => item.id === product.id)) {
        toast.info("Item already in cart");
        return;
      }

      const updatedCart = [...currentCart, { ...product, quantity: 1 }];
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        cart: updatedCart,
        wishlist: wishlist.filter(item => item.id !== product.id),
      });

      setCart(updatedCart);
      removeFromWishlist(product.id);
      toast.success(`${product.name} moved to cart!`);
    } catch (err) {
      toast.error("Failed to move to cart");
    }
  }, [user, isLoading, wishlist, setCart, removeFromWishlist, navigate]);

  const handleProductClick = useCallback((productId) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  if (isLoading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[50vh] bg-[#E6D5C3] flex items-center justify-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="animate-pulse text-[#800020] text-xl"
      >
        Loading your wishlist...
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F5F0E8] py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#800020] mb-3">
            Your Wishlist
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-1 bg-[#800020] mx-auto"
          />
        </motion.div>

        <AnimatePresence>
          {wishlist.length === 0 ? (
            <motion.div
              key="empty-wishlist"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#E6D5C3] rounded-lg p-8 text-center max-w-md mx-auto border border-[#800020]/20"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FiHeart className="mx-auto text-4xl text-[#800020] mb-4" />
              </motion.div>
              <h3 className="text-lg text-[#800020] mb-2">Your wishlist is empty</h3>
              <p className="text-[#800020]/80 mb-4">Save your favorite items here for later</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/products')}
                className="bg-[#800020] hover:bg-[#600018] text-[#F5F0E8] px-4 py-2 rounded-md transition-colors text-sm"
              >
                Browse Products
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="wishlist-items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {wishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-[#F5F0E8] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all group border border-[#E6D5C3]"
                >
                  {/* Product Image */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-square overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 
                      className="text-md font-semibold text-[#333] mb-1 truncate cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#800020]/80 italic mb-1">{product.category}</p>
                    <p className="text-lg font-bold text-[#800020] mb-2">₹{product.price}</p>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToCart(product);
                        }}
                        className="flex-1 bg-[#800020] hover:bg-[#600018] text-[#F5F0E8] py-1 px-2 rounded-md text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <FiShoppingBag size={14} /> Add to Cart
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(product.id);
                        }}
                        className="w-8 h-8 flex items-center justify-center border border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-[#F5F0E8] rounded-md transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <FiTrash2 size={14} />
                      </motion.button>
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

export default React.memo(Wishlist);