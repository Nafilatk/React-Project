import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);

  const isInWishlist = wishlist?.some((item) => item.id === id);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      toast.error("Product not found");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = useCallback(() => {
    if (!user) {
      toast.warn("Please login to add to cart");
      return;
    }
    const productWithQty = { ...product, quantity: 1 }; // Default quantity to 1
    addToCart(productWithQty);
    toast.success(`${product.name} added to cart`);
  }, [user, product, addToCart]);

  const handleWishlist = useCallback(() => {
    if (!user) {
      toast.warn("Please login to manage wishlist");
      return;
    }
    setIsWishlistAnimating(true);
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
    setTimeout(() => setIsWishlistAnimating(false), 1000);
  }, [user, isInWishlist, product, addToWishlist, removeFromWishlist]);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#cbc0b2] flex items-center justify-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }}
          className="text-[#550b14] text-xl"
        >
          Loading product details...
        </motion.div>
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#cbc0b2] flex items-center justify-center"
      >
        <p className="text-[#550b14] text-xl">Product not found</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#cbc0b2] py-8 px-4 sm:px-6 lg:px-8"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto bg-[#181817] rounded-xl shadow-lg overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-lg aspect-square bg-[#7e6961]/20"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </AnimatePresence>
              
              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-lg ${
                  isInWishlist
                    ? "bg-[#550b14] text-[#cbc0b2]"
                    : "bg-[#cbc0b2] text-[#7e6961] hover:bg-[#550b14] hover:text-[#cbc0b2]"
                }`}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <AnimatePresence mode="wait">
                  {isWishlistAnimating ? (
                    <motion.div
                      key="heart-animate"
                      initial={{ scale: 0.5, rotate: -45 }}
                      animate={{ scale: 1.2, rotate: 0 }}
                      exit={{ scale: 0.5, rotate: 45 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {isInWishlist ? (
                        <AiFillHeart size={24} />
                      ) : (
                        <AiOutlineHeart size={24} />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="heart-static"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1 }}
                    >
                      {isInWishlist ? (
                        <AiFillHeart size={24} />
                      ) : (
                        <AiOutlineHeart size={24} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              
              {/* Sale Badge */}
              {product.onSale && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute top-4 left-4 bg-[#550b14] text-[#cbc0b2] px-3 py-1 rounded-full text-sm font-bold"
                >
                  SALE
                </motion.div>
              )}
            </motion.div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-4 gap-3"
              >
                {product.images.map((img, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      activeImage === index
                        ? "border-[#550b14]"
                        : "border-transparent hover:border-[#7e6961]"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#cbc0b2]"
          >
            <motion.h1 
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold mb-2"
            >
              {product.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[#7e6961] italic mb-4"
            >
              {product.category}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="text-2xl font-bold text-[#970112]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-[#7e6961] line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6 leading-relaxed"
            >
              {product.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 bg-[#550b14] hover:bg-[#7e6961] text-[#cbc0b2] py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Add to Cart
              </motion.button>
            </motion.div>

            {/* Additional Info */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-6 border-t border-[#7e6961]/30"
            >
              <h3 className="font-bold text-lg mb-3">Product Details</h3>
              <ul className="space-y-2 text-sm">
                <motion.li 
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex"
                >
                  <span className="w-32 text-[#7e6961]">Material:</span>
                  <span>{product.material || "Cotton"}</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex"
                >
                  <span className="w-32 text-[#7e6961]">Care:</span>
                  <span>{product.careInstructions || "Machine wash cold"}</span>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ProductDetails);