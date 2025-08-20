import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FiUser, FiShoppingCart, FiHeart, FiLogIn, FiMenu, FiX, FiKey } from "react-icons/fi";

const colors = {
  tan: "#D2B48C",   
  burgundy: "#800020", 
  cream: "#F5F0E8",    
  textDark: "#333333",  
  textLight: "#FFFFFF"  
};

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  const handleLogout = () => {
    logoutUser();
    toast.info("Logged out successfully!");
    navigate("/login");
    setIsUserDropdownOpen(false);
  };

  const getNavLinkClass = (path) => {
    return pathname === path 
      ? "font-bold text-burgundy" 
      : "text-dark hover:text-burgundy";
  };


const handlePasswordChange = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    toast.warn("Please fill all fields");
    return;
  }

  if (currentPassword !== user.password) {
    toast.error("Current password is incorrect");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("New password and confirm password do not match");
    return;
  }

  try {
    await axios.patch(`http://localhost:5000/users/${user.id}`, {
      password: newPassword,
    });
    toast.success("Password updated successfully!");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    toast.error("Failed to update password");
    console.error(err);
  }
};

  return (
    <nav 
      className="sticky top-0 z-50 py-4 px-6 border-b"
      style={{ backgroundColor: colors.cream, borderColor: colors.tan }}
    >
{showPasswordModal && (
  <div className="fixed inset-0 bg-[#F5F0E8] bg-opacity-50 flex items-center justify-center z-50">
    <div 
      className="bg-cream p-6 rounded-lg max-w-md w-full border"
      style={{ borderColor: colors.tan }}
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: colors.burgundy }}>
        Change Password
      </h3>

      {/* Current Password */}
      <input
        type="password"
        placeholder="Enter current password"
        className="w-full p-2 border rounded mb-4"
        style={{ borderColor: colors.tan }}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      {/* New Password */}
      <input
        type="password"
        placeholder="Enter new password"
        className="w-full p-2 border rounded mb-4"
        style={{ borderColor: colors.tan }}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      {/* Confirm Password */}
      <input
        type="password"
        placeholder="Confirm new password"
        className="w-full p-2 border rounded mb-4"
        style={{ borderColor: colors.tan }}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div className="flex justify-end space-x-2">
        <button 
          onClick={() => setShowPasswordModal(false)}
          className="px-4 py-2 rounded"
          style={{ color: colors.textDark }}
        >
          Cancel
        </button>
        <button 
          onClick={handlePasswordChange}
          className="px-4 py-2 text-cream rounded"
          style={{ backgroundColor: colors.burgundy }}
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="font-bold text-xl tracking-wide"
          style={{ color: colors.burgundy }}
        >
          GLAMCART
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={getNavLinkClass("/")}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={getNavLinkClass("/products")}
          >
            Products
          </Link>
          <Link 
            to="/about" 
            className={getNavLinkClass("/about")}
          >
            About
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/wishlist" 
              className="flex items-center relative"
              style={{ color: colors.textDark }}
            >
              <FiHeart className="mr-1" />
              {wishlistCount > 0 && (
                <span 
                  className="absolute -top-2 -right-2 text-cream text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  style={{ backgroundColor: colors.burgundy }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link 
              to="/cart" 
              className="flex items-center relative"
              style={{ color: colors.textDark }}
            >
              <FiShoppingCart className="mr-1" />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-2 -right-2 text-cream text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  style={{ backgroundColor: colors.burgundy }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {user ? (
            <div className="relative">
              <button 
                className="flex items-center space-x-1 focus:outline-none"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <FiUser style={{ color: colors.burgundy }} />
                <span className="hidden md:inline" style={{ color: colors.textDark }}>
                  {user.name}
                </span>
              </button>
              
              {isUserDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50"
                  style={{ 
                    backgroundColor: colors.cream,
                    borderColor: colors.tan,
                    borderWidth: '1px'
                  }}
                >
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-tan"
                    style={{ color: colors.textDark }}
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      setShowPasswordModal(true);
                      setIsUserDropdownOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-tan"
                    style={{ color: colors.textDark }}
                  >
                    <FiKey className="mr-2" />
                    Change Password 
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-tan"
                    style={{ color: colors.textDark }}
                  >
                    <FiLogIn className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 rounded font-bold flex items-center"
              style={{ 
                backgroundColor: colors.burgundy,
                color: colors.cream
              }}
            >
              <FiLogIn className="mr-2" />
              <span className="hidden md:inline">Login</span>
            </Link>
          )}

          <button 
            className="md:hidden focus:outline-none"
            style={{ color: colors.textDark }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="md:hidden absolute top-full left-0 right-0 z-40 py-4 px-6"
          style={{ 
            backgroundColor: colors.cream,
            borderTopColor: colors.tan,
            borderTopWidth: '1px'
          }}
        >
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={getNavLinkClass("/")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={getNavLinkClass("/products")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={getNavLinkClass("/about")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/wishlist" 
              className="flex items-center"
              style={{ color: colors.textDark }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiHeart className="mr-2" />
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <Link 
              to="/cart" 
              className="flex items-center"
              style={{ color: colors.textDark }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiShoppingCart className="mr-2" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;