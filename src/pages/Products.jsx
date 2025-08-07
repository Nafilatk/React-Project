import { useEffect, useState, useContext } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(AuthContext);

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

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart", error);
      toast.error("Failed to add item to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#cbc0b2] flex items-center justify-center">
        <div className="animate-pulse text-[#550b14] text-xl">Loading glamorous fashion...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#cbc0b2] py-12 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-[#550b14] mb-4">GlamCart Collection</h1>
        <p className="text-lg text-[#7e6961]">
          Discover the latest trends in women's fashion
        </p>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#181817] p-6 rounded-lg shadow-lg">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-[#cbc0b2] mb-2">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Find your perfect outfit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded border border-[#7e6961] bg-[#181817] text-[#cbc0b2] focus:ring-2 focus:ring-[#550b14] focus:outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#cbc0b2] mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded border border-[#7e6961] bg-[#181817] text-[#cbc0b2] focus:ring-2 focus:ring-[#550b14] focus:outline-none transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#181817]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-[#cbc0b2] mb-2">
              Sort By
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-2 rounded border border-[#7e6961] bg-[#181817] text-[#cbc0b2] focus:ring-2 focus:ring-[#550b14] focus:outline-none transition-all"
            >
              <option value="">Recommended</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid - 4 cards per row */}
      {displayed.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-xl text-[#550b14]">No products match your search.</p>
          <button 
            onClick={() => {
              setSearch("");
              setCategory("All");
              setSort("");
            }}
            className="mt-4 px-6 py-2 bg-[#550b14] text-[#cbc0b2] rounded-lg hover:bg-[#7e6961] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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