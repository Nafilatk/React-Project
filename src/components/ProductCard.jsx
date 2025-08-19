import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { motion } from "framer-motion";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext); 

  const isInWishlist = wishlist?.some((item) => item.id === product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user && !isLoading) {
      toast.warn("Please login to add items to cart");
      navigate("/login");
      return;
    }
    
    try {
      if (onAddToCart) {
        await onAddToCart(product);
      } else if (addToCart) {
        await addToCart(product);
      }
      // toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error("Add to cart error:", error);
    }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user && !isLoading) {
      toast.warn("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        // toast.info("Removed from wishlist");
      } else {
        await addToWishlist(product);
        // toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error("Wishlist error:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="bg-[#F8F4E9] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group relative h-full flex flex-col border border-[#D2B48C] cursor-pointer"
      onClick={handleCardClick}
    >
      {product.onSale && (
        <div className="absolute top-3 left-0 bg-[#800020] text-[#F8F4E9] px-2 py-1 text-xs font-medium tracking-wider z-10">
          <div className="absolute left-0 bottom-[-6px] w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-[#600018]"></div>
          SALE
        </div>
      )}

      <div className="relative overflow-hidden aspect-square bg-[#F8F4E9]">
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-full ${
            isInWishlist 
              ? "bg-[#800020] text-[#F8F4E9]"
              : "bg-[#F8F4E9] text-[#D2B48C] hover:bg-[#800020] hover:text-[#F8F4E9]"
          }`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? (
            <AiFillHeart size={18} className="text-current" />
          ) : (
            <AiOutlineHeart size={18} className="text-current" />
          )}
        </motion.button>
      </div>

      {/* Product Info - Compact Layout */}
      <div className="p-3 flex-grow flex flex-col">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-[#5a524a] tracking-tight line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-[#800020] uppercase tracking-wider mt-1 font-medium">
            {product.category}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-2">
            <span className="text-base font-semibold text-[#800020]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#D2B48C] line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ 
              backgroundColor: "#600018",
              transition: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-[#800020] text-[#F8F4E9] py-2 px-2 rounded text-xs font-medium tracking-wide"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ProductCard);