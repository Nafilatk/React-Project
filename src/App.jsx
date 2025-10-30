import { lazy,Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate,Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./Admin/AdminLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./Admin/components/ProtectedAdminRoute";

// Lazy load user pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Success = lazy(() => import("./pages/Success"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));

// Lazy load admin pages
const Dashboard = lazy(() => import("./Admin/pages/Dashboard"));
const ProductsAdmin = lazy(() => import("./Admin/pages/ProductsAdmin"));
const OrdersAdmin = lazy(() => import("./Admin/pages/OrdersAdmin"));
const UsersAdmin = lazy(() => import("./Admin/pages/UsersAdmin"));

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <Routes>
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
            <Route path="/wishlist" element={<Navigate to="/user/wishlist" replace />} />
            <Route path="/cart" element={<Navigate to="/user/cart" replace />} />
            <Route path="/checkout" element={<Navigate to="/user/checkout" replace />} />
            <Route path="/orders" element={<Navigate to="/user/orders" replace />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          </Suspense>

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