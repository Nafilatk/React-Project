import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext); // ✅ fixed here
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // ✅ fixed here
    toast.info("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div>
        <Link to="/" className="text-xl font-bold text-pink-600">
          GlamCart
        </Link>
      </div>

      <ul className="flex space-x-5 text-gray-700 font-medium">
        <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
        <li><Link to="/products" className="hover:text-pink-600">Products</Link></li>
        <li><Link to="/wishlist" className="hover:text-pink-600">Wishlist</Link></li>
        <li><Link to="/cart" className="hover:text-pink-600">Cart</Link></li>
        <li><Link to="/orders" className="hover:text-pink-600">Orders</Link></li>
        <li><Link to="/about" className="hover:text-pink-600">About</Link></li>
      </ul>

      <div className="flex space-x-4">
        {user ? (
          <>
            <span className="text-gray-600 hidden md:inline">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded">
              Login
            </Link>
            <Link to="/signup" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1 rounded">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
