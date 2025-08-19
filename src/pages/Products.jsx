import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const categories = [
    "All",
    "T-Shirts",
    "Tops",
    "Shirts",
    "Jackets",
    "Casual Dresses",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        const activeProducts = res.data.filter((p) => p.isActive);
        setProducts(activeProducts);
        setDisplayed(activeProducts);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
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

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCart(product);
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#F8F4E9] flex items-center justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#800020] text-xl"
        >
          Loading glamorous fashion...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F8F4E9] py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-[#800020] mb-4 font-serif">
          GlamCart Collection
        </h1>
        <p className="text-lg text-[#D2B48C] font-medium">
          Timeless elegance in every piece
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F8F4E9] p-6 rounded-lg shadow-sm border border-[#D2B48C]">
          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-[#5a524a] mb-2"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Find your perfect outfit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded border border-[#D2B48C] bg-white text-[#5a524a] focus:ring-2 focus:ring-[#800020] focus:outline-none transition-all"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-[#5a524a] mb-2"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded border border-[#D2B48C] bg-white text-[#5a524a] focus:ring-2 focus:ring-[#800020] focus:outline-none transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white">
                  {cat}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-[#5a524a] mb-2"
            >
              Sort By
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-2 rounded border border-[#D2B48C] bg-white text-[#5a524a] focus:ring-2 focus:ring-[#800020] focus:outline-none transition-all"
            >
              <option value="">Recommended</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </motion.div>
        </div>
      </motion.div>

      {displayed.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto text-center py-12"
        >
          <p className="text-xl text-[#800020]">
            No products match your search.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearch("");
              setCategory("All");
              setSort("");
            }}
            className="mt-4 px-6 py-2 bg-[#800020] text-[#F8F4E9] rounded-lg hover:bg-[#600018] transition-colors"
          >
            Reset Filters
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {displayed.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Products;