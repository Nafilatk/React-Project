import  { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadCart = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      setCart(res.data.cart || []);
    } catch (err) {
      console.error("Failed to load cart", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);
  const syncCartToDB = async (updatedCart) => {
    try {
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        cart: updatedCart,
      });
    } catch (err) {
      toast.error("Cart update failed");
    }
  };
  const addToCart = async (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      toast.info("Item already in cart");
      return;
    }
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    syncCartToDB(updatedCart);
    toast.success("Added to cart!");
  };
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    syncCartToDB(updatedCart);
    toast.success("Removed from cart");
  };
  const clearCart = () => {
    setCart([]);
    syncCartToDB([]);
    toast.success("Cart cleared");
  };
  const incrementQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    syncCartToDB(updatedCart);
  };
  const decrementQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    syncCartToDB(updatedCart);
  };
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        incrementQty,
        decrementQty,
        totalPrice,
        
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
