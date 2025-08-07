import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FiCreditCard, FiUser, FiMapPin, FiLock, FiCalendar } from "react-icons/fi";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, clearCart, totalPrice } = useContext(CartContext);
  const [formData, setFormData] = useState({
    shipping: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    payment: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      nameOnCard: "",
    },
    contact: {
      email: user?.email || "",
      phone: "",
    }
  });
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const colors = {
    dark: "#181817",
    light: "#cbc0b2",
    primary: "#970112",
    secondary: "#7e6961",
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.warn("Please login to checkout");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleInputChange = (e, section) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      const existingUser = res.data;
      const updatedOrders = [...(existingUser.orders || []), ...cart];

      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        orders: updatedOrders,
        cart: [],
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/success");
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  return (
    <div className={`min-h-screen bg-[${colors.light}] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Checkout Header */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl md:text-4xl font-bold text-[${colors.dark}] mb-3`}>
            Secure Checkout
          </h1>
          <div className={`w-24 h-1 bg-[${colors.primary}] mx-auto`}></div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center w-full max-w-lg">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= step ? `bg-[${colors.primary}] text-white` : `bg-[${colors.secondary}] text-[${colors.light}]`}`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 ${activeStep > step ? `bg-[${colors.primary}]` : `bg-[${colors.secondary}]`}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className={`bg-[${colors.dark}] rounded-xl p-12 text-center`}>
            <h3 className={`text-xl text-[${colors.light}] mb-2`}>Your cart is empty</h3>
            <button
              onClick={() => navigate('/products')}
              className={`bg-[${colors.primary}] hover:bg-[${colors.secondary}] text-[${colors.light}] px-6 py-3 rounded-lg transition-colors`}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className={`bg-[${colors.dark}] p-6 rounded-xl shadow-lg`}>
              <h3 className={`text-xl font-semibold text-[${colors.light}] mb-6`}>
                Your Order ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-4 border-b border-[#7e6961]/30 pb-4"
                  >
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className={`font-medium text-[${colors.light}]`}>{item.name}</p>
                      <p className={`text-sm text-[${colors.secondary}]`}>{item.category}</p>
                      <p className={`text-sm text-[${colors.secondary}]`}>Qty: {item.quantity}</p>
                    </div>
                    <p className={`font-bold text-[${colors.primary}]`}>₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className={`mt-6 pt-4 border-t border-[${colors.secondary}]/30`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[${colors.light}]`}>Subtotal</span>
                  <span className={`text-[${colors.light}]`}>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[${colors.light}]`}>Shipping</span>
                  <span className={`text-[${colors.light}]`}>FREE</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-lg font-bold text-[${colors.light}]`}>Total</span>
                  <span className={`text-lg font-bold text-[${colors.primary}]`}>₹{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className={`bg-[${colors.dark}] p-6 rounded-xl shadow-lg`}>
              {activeStep === 1 && (
                <div className="space-y-4">
                  <h3 className={`text-xl font-semibold text-[${colors.light}] mb-6`}>
                    <FiUser className="inline mr-2" /> Shipping Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.shipping.firstName}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        className={`w-full px-4 py-3 pl-10 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
                      />
                      <FiUser className="absolute left-3 top-3.5 text-[${colors.secondary}]" />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.shipping.lastName}
                        onChange={(e) => handleInputChange(e, 'shipping')}
                        className={`w-full px-4 py-3 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={formData.shipping.address}
                      onChange={(e) => handleInputChange(e, 'shipping')}
                      className={`w-full px-4 py-3 pl-10 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
                    />
                    <FiMapPin className="absolute left-3 top-3.5 text-[${colors.secondary}]" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.shipping.city}
                      onChange={(e) => handleInputChange(e, 'shipping')}
                      className={`px-4 py-3 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.shipping.state}
                      onChange={(e) => handleInputChange(e, 'shipping')}
                      className={`px-4 py-3 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
                    />
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP Code"
                      value={formData.shipping.zip}
                      onChange={(e) => handleInputChange(e, 'shipping')}
                      className={`px-4 py-3 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
                    />
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={nextStep}
                      className={`bg-[${colors.primary}] hover:bg-[${colors.secondary}] text-[${colors.light}] px-6 py-2 rounded-lg transition-colors`}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4">
                  <h3 className={`text-xl font-semibold text-[${colors.light}] mb-6`}>
                    <FiCreditCard className="inline mr-2" /> Payment Details
                  </h3>
                  
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.payment.cardNumber}
                      onChange={(e) => handleInputChange(e, 'payment')}
                      className={`w-full px-4 py-3 pl-10 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
                    />
                    <FiCreditCard className="absolute left-3 top-3.5 text-[${colors.secondary}]" />
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      name="nameOnCard"
                      placeholder="Name on Card"
                      value={formData.payment.nameOnCard}
                      onChange={(e) => handleInputChange(e, 'payment')}
                      className={`w-full px-4 py-3 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.payment.expiry}
                        onChange={(e) => handleInputChange(e, 'payment')}
                        className={`w-full px-4 py-3 pl-10 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
                      />
                      <FiCalendar className="absolute left-3 top-3.5 text-[${colors.secondary}]" />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={formData.payment.cvv}
                        onChange={(e) => handleInputChange(e, 'payment')}
                        className={`w-full px-4 py-3 pl-10 bg-[${colors.dark}] border border-[${colors.secondary}] rounded-lg text-[${colors.light}] focus:outline-none focus:ring-2 focus:ring-[${colors.primary}]`}
                      />
                      <FiLock className="absolute left-3 top-3.5 text-[${colors.secondary}]" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`bg-transparent hover:bg-[${colors.secondary}]/20 text-[${colors.light}] px-6 py-2 rounded-lg transition-colors border border-[${colors.secondary}]`}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className={`bg-[${colors.primary}] hover:bg-[${colors.secondary}] text-[${colors.light}] px-6 py-2 rounded-lg transition-colors`}
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-4">
                  <h3 className={`text-xl font-semibold text-[${colors.light}] mb-6`}>
                    Order Review
                  </h3>
                  
                  <div className={`p-4 rounded-lg bg-[${colors.dark}] border border-[${colors.secondary}]`}>
                    <h4 className={`font-medium text-[${colors.light}] mb-2`}>Shipping to:</h4>
                    <p className={`text-[${colors.secondary}]`}>
                      {formData.shipping.firstName} {formData.shipping.lastName}<br />
                      {formData.shipping.address}<br />
                      {formData.shipping.city}, {formData.shipping.state} {formData.shipping.zip}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg bg-[${colors.dark}] border border-[${colors.secondary}]`}>
                    <h4 className={`font-medium text-[${colors.light}] mb-2`}>Payment Method:</h4>
                    <p className={`text-[${colors.secondary}]`}>
                      **** **** **** {formData.payment.cardNumber.slice(-4)}<br />
                      Expires: {formData.payment.expiry}
                    </p>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`bg-transparent hover:bg-[${colors.secondary}]/20 text-[${colors.light}] px-6 py-2 rounded-lg transition-colors border border-[${colors.secondary}]`}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`bg-[${colors.primary}] hover:bg-[${colors.secondary}] text-[${colors.light}] px-6 py-2 rounded-lg transition-colors flex items-center gap-2`}
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
                        `Place Order ₹${totalPrice}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;