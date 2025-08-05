import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // ❤️ icons

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);

  const isInWishlist = wishlist?.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!user && !isLoading) {
      toast.warn("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleWishlist = () => {
    if (!user && !isLoading) {
      toast.warn("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow hover:shadow-lg transition p-4 relative">
      {/* ❤️ Wishlist Heart Icon */}
      <div
        className="absolute top-3 right-3 cursor-pointer"
        onClick={handleWishlist}
      >
        {isInWishlist ? (
          <AiFillHeart size={22} className="text-pink-600" />
        ) : (
          <AiOutlineHeart size={22} className="text-gray-400 hover:text-pink-500" />
        )}
      </div>

      {/* 🖼️ Product Image */}
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-3"
      />

      <h3 className="text-lg font-semibold text-pink-700">{product.name}</h3>
      <p className="text-gray-600 mb-1">{product.category}</p>
      <p className="text-pink-600 font-bold mb-2">₹{product.price}</p>

      <button
        onClick={handleAddToCart}
        className="w-full bg-pink-600 text-white px-3 py-2 rounded hover:bg-pink-700 text-sm mt-2"
      >
        Add to Cart
      </button>

      <Link
        to={`/product/${product.id}`}
        className="block text-center text-sm text-blue-600 mt-3 hover:underline"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
