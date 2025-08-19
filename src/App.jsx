import { BrowserRouter as Router, Routes, Route, Navigate,Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./Admin/AdminLayout";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./Admin/components/ProtectedAdminRoute";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Success from "./pages/Success";

// Protected User Pages
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// Admin Pages
import Dashboard from "./Admin/pages/Dashboard";
import ProductsAdmin from "./Admin/pages/ProductsAdmin";
import OrdersAdmin from "./Admin/pages/OrdersAdmin";
import UsersAdmin from "./Admin/pages/UsersAdmin";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* ------------------------ */}
            {/* PUBLIC ROUTES */}
            {/* ------------------------ */}
            <Route path="/" element={
              <>
                <Navbar />
                <Outlet />
                <Footer />
              </>
            }>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="success" element={<Success />} />
            </Route>

            {/* ------------------------ */}
            {/* PROTECTED USER ROUTES */}
            {/* ------------------------ */}
            <Route path="/user" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Outlet />
                  <Footer />
                </>
              </ProtectedRoute>
            }>
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<Orders />} />
            </Route>

            {/* ------------------------ */}
            {/* ADMIN ROUTES */}
            {/* ------------------------ */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="orders" element={<OrdersAdmin />} />
              <Route path="users" element={<UsersAdmin />} />
            </Route>

            {/* ------------------------ */}
            {/* REDIRECTS */}
            {/* ------------------------ */}
            <Route path="/wishlist" element={<Navigate to="/user/wishlist" replace />} />
            <Route path="/cart" element={<Navigate to="/user/cart" replace />} />
            <Route path="/checkout" element={<Navigate to="/user/checkout" replace />} />
            <Route path="/orders" element={<Navigate to="/user/orders" replace />} />
            
            {/* 404 FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;