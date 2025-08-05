import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {/* ✅ Animation or GIF */}
      <video
        src="success.mp4        "
        alt="Success Animation"
        className="w-72 h-72 mb-6"
      />

      <h2 className="text-3xl font-bold text-green-600 mb-2">Order Successful!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase, Nafila! Your order has been placed successfully.
      </p>

      <Link
        to="/products"
        className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded text-lg font-semibold"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default Success;
