
// ✅ Products.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  const { user } = useContext(AuthContext);

  const categories = [
    "All",
    "T-Shirts",
    "Shirts",
    "Tops",
    "Tank Tops",
    "Jackets",
    "Formal Tops",
    "Formal Dresses",
    "Casual Wear",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        const activeProducts = res.data.filter((p) => p.isActive);
        setProducts(activeProducts);
        setDisplayed(activeProducts);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (search.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (sort === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setDisplayed(filtered);
  }, [search, category, sort, products]);

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      const existingCart = res.data.cart || [];

      const alreadyInCart = existingCart.find((item) => item.id === product.id);
      if (alreadyInCart) {
        toast.info("Item already in cart");
        return;
      }

      const updatedCart = [...existingCart, { ...product, quantity: 1 }];

      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        cart: updatedCart,
      });

      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
        Our Products
      </h2>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* 📦 Product Grid */}
      {displayed.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayed.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;