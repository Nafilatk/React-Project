import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCreditCard, FiTruck, FiCheckCircle } from "react-icons/fi";
import axios from "axios";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, clearCart, totalPrice } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        userId: user.id,
        date: new Date().toISOString(),
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || item.images?.[0],
          category: item.category,
          size: item.size
        })),
        total: totalPrice,
        shippingAddress: formData.address,
        paymentMethod: "Credit Card",
        status: "Processing"
      };

      const userResponse = await axios.get(`http://localhost:5000/users/${user.id}`);
      const currentUser = userResponse.data;
      
      const updatedUser = {
        ...currentUser,
        orders: [...(currentUser.orders || []), orderData]
      };

      await axios.put(`http://localhost:5000/users/${user.id}`, updatedUser);
      
      clearCart();
      navigate("/success");
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    tan: "#E6D5C3",
    cream: "#F5F0E8",
    burgundy: "#800020",
    darkBurgundy: "#600018",
    textDark: "#333333"
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-4">
        <div className="bg-[#E6D5C3] p-8 rounded-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#800020] mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-[#800020] hover:bg-[#600018] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#800020] mb-2">Checkout</h1>
          <div className="w-24 h-1 bg-[#800020] mx-auto"></div>
        </div>

        <div className="bg-[#E6D5C3] rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#800020] mb-4 flex items-center gap-2">
                <FiTruck /> Shipping Details
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-[#800020]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]/50"
                  required
                />
                <textarea
                  name="address"
                  placeholder="Shipping Address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 bg-white border border-[#800020]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]/50"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#800020] mb-4 flex items-center gap-2">
                <FiCreditCard /> Payment Method
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-[#800020]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]/50"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    className="px-4 py-2 bg-white border border-[#800020]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]/50"
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="px-4 py-2 bg-white border border-[#800020]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]/50"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#800020] mb-4">Order Summary</h2>
              <div className="bg-white p-4 rounded-lg">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-[#800020]/10">
                    <span className="text-[#333333]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-[#800020]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 font-bold text-lg mt-2">
                  <span>Total</span>
                  <span className="text-[#800020]">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#800020] hover:bg-[#600018] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiCheckCircle size={18} /> Place Order
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;