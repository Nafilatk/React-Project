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
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);

  const isInWishlist = wishlist?.some((item) => item.id === id);
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const fetchProduct = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/products/${id}`);
      // Add more sample images if product has less than 4 images
      const productWithImages = {
        ...res.data,
        images: res.data.images.length < 4 
          ? [...res.data.images, ...Array(4 - res.data.images.length).fill(res.data.images[0])]
          : res.data.images.slice(0, 4)
      };
      setProduct(productWithImages);
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
    if (!selectedSize) {
      toast.warn("Please select a size");
      return;
    }
    const productWithQty = { ...product, quantity: 1, size: selectedSize };
    addToCart(productWithQty);
    toast.success(`${product.name} (Size: ${selectedSize}) added to cart`);
  }, [user, product, selectedSize, addToCart]);

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
        className="min-h-screen bg-[#F8F4E9] flex items-center justify-center"
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
          className="text-[#800020] text-xl"
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
        className="min-h-screen bg-[#F8F4E9] flex items-center justify-center"
      >
        <p className="text-[#800020] text-xl">Product not found</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#F8F4E9] py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-[#D2B48C]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <div className="space-y-6">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden rounded-lg aspect-square bg-[#F8F4E9]"
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-lg ${
                  isInWishlist
                    ? "bg-[#800020] text-[#F8F4E9]"
                    : "bg-[#F8F4E9] text-[#D2B48C] hover:bg-[#800020] hover:text-[#F8F4E9]"
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
              
              {product.onSale && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute top-4 left-4 bg-[#800020] text-[#F8F4E9] px-3 py-1 rounded-full text-sm font-bold"
                >
                  SALE
                </motion.div>
              )}
            </motion.div>

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
                      ? "border-[#800020]"
                      : "border-transparent hover:border-[#D2B48C]"
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
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#5a524a]"
          >
            <motion.h1 
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold mb-3 font-serif"
            >
              {product.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[#800020] italic mb-6 uppercase tracking-wider"
            >
              {product.category}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="text-2xl font-bold text-[#800020]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-[#D2B48C] line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h3 className="font-medium mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border-2 transition-all ${
                      selectedSize === size
                        ? "border-[#800020] bg-[#800020] text-[#F8F4E9]"
                        : "border-[#D2B48C] hover:border-[#800020]"
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8 leading-relaxed"
            >
              {product.description}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 bg-[#800020] hover:bg-[#600018] text-[#F8F4E9] py-3 px-6 rounded-lg font-medium transition-colors"
                disabled={!selectedSize}
              >
                {selectedSize ? `Add to Cart (${selectedSize})` : 'Select Size'}
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-6 border-t border-[#D2B48C]/30"
            >
              <h3 className="font-bold text-lg mb-4">Product Details</h3>
              <ul className="space-y-3 text-sm">
                <motion.li 
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex"
                >
                  <span className="w-32 text-[#D2B48C]">Material:</span>
                  <span>{product.material || "Premium cotton blend"}</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="flex"
                >
                  <span className="w-32 text-[#D2B48C]">Care:</span>
                  <span>{product.careInstructions || "Machine wash cold, tumble dry low"}</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="flex"
                >
                  <span className="w-32 text-[#D2B48C]">Fit:</span>
                  <span>{product.fit || "Regular fit"}</span>
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