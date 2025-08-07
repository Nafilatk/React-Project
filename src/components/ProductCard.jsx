import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext); // Added cart context usage

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
      // Use either the passed onAddToCart prop or the context's addToCart
      if (onAddToCart) {
        await onAddToCart(product);
      } else if (addToCart) {
        await addToCart(product);
      }
      toast.success(`${product.name} added to cart`);
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
        toast.info("Removed from wishlist");
      } else {
        await addToWishlist(product);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error("Wishlist error:", error);
    }
  };

  return (
    <div 
      className="bg-[#181817] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative h-full flex flex-col border border-[#7e6961]/30 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Sale Badge */}
      {product.onSale && (
        <div className="absolute top-3 left-3 bg-[#550b14] text-[#cbc0b2] px-3 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
          SALE
        </div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-300 ${
            isInWishlist 
              ? "bg-[#550b14] text-[#cbc0b2]"
              : "bg-[#cbc0b2]/90 text-[#7e6961] hover:bg-[#550b14] hover:text-[#cbc0b2]"
          }`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? (
            <AiFillHeart size={20} className="text-current" />
          ) : (
            <AiOutlineHeart size={20} className="text-current" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[#cbc0b2] line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          <p className="text-sm text-[#7e6961] italic">{product.category}</p>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-[#970112]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[#7e6961] line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-[#550b14] hover:bg-[#7e6961] text-[#cbc0b2] py-2 px-3 rounded-lg transition-colors duration-300 font-medium text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);