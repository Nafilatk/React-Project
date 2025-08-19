import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const sectionAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8 }
};

const staggeredAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};

const Home = () => {
  // Color palette from screenshot
  const colors = {
    tan: "#E6D5C3",
    cream: "#F5F0E8",
    burgundy: "#800020",
    textDark: "#333333"
  };

  return (
    <div style={{ color: colors.textDark }}>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[90vh] sm:h-[90vh] flex flex-col justify-center items-left text-left px-4 sm:px-6 bg-center"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/f2/7d/a9/f27da96b0785bc23ff08fe3d4a154889.jpg')",
        }}
      >
        <div className="absolute inset-0 z-0" style={{ backgroundColor: `${colors.burgundy}70` }} />
        <motion.div 
          className="relative z-10"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow pb-4 font-serif" style={{ color: colors.cream }}>
            Style Your Mind
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 pb-4 font-bold" style={{ color: colors.cream }}>
            Discover earthy tones & timeless style in women's fashion.
          </p>
          <Link
            to="/products"
            className="px-6 sm:px-8 py-2 sm:py-3 rounded-full transition duration-300 text-sm sm:text-base"
            style={{ 
              backgroundColor: colors.burgundy,
              color: colors.cream
            }}
          >
            Shop Now
          </Link>
        </motion.div>
      </motion.section>

      <motion.section
        {...sectionAnimation}
        className="relative py-12 px-4 sm:px-6 overflow-hidden"
        style={{ backgroundColor: colors.burgundy }}
      >
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif" style={{ color: colors.cream }}>
            Featured Products
          </h2>
          <p className="mt-2 max-w-2xl mx-auto" style={{ color: colors.tan }}>
            Discover our most popular and trending items
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex overflow-x-auto pb-8 hide-scrollbar">
            <div className="flex space-x-6 px-4">
              {[
                {
                  id: 1,
                  name: "Premium Denim Jacket",
                  price: 89.99,
                  image: "https://i.pinimg.com/1200x/f4/9f/49/f49f490332ec32c30ccf6fd8fc4e5835.jpg",
                  category: "Jackets"
                },
                {
                  id: 2,
                  name: "Classic White Shirt",
                  price: 49.99,
                  image: "https://i.pinimg.com/1200x/de/71/3c/de713cd72ad7fe7ff1d3df4ace8e2f79.jpg",
                  category: "Shirts"
                },
                {
                  id: 3,
                  name: "Floral Summer Dress",
                  price: 65.99,
                  image: "https://i.pinimg.com/736x/70/96/16/7096160d9d3bc4805a754f90a24e4fb7.jpg",
                  category: "Dresses"
                },
                {
                  id: 4,
                  name: "Formal Office Top",
                  price: 55.99,
                  image: "https://i.pinimg.com/1200x/64/eb/4d/64eb4d69346a3a47f5ae2af45e0a5d78.jpg",
                  category: "Tops"
                },
                {
                  id: 5,
                  name: "Casual Cotton T-Shirt",
                  price: 29.99,
                  image: "https://i.pinimg.com/736x/d8/e2/b4/d8e2b4f2717aa2b3cf4799a459d950d7.jpg",
                  category: "T-Shirts"
                }
              ].map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 w-64 sm:w-72 rounded-lg overflow-hidden shadow-lg"
                  style={{ backgroundColor: colors.tan }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-64 sm:h-80 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: colors.burgundy,
                          color: colors.cream
                        }}
                      >
                        {product.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>


      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://i.pinimg.com/1200x/5a/c7/bd/5ac7bd64e027c9d6a329d4f849105c28.jpg')",
          backgroundSize: "cover",
        }}
      ></motion.section>


      <motion.section
        {...sectionAnimation}
        className="relative h-[85vh] p-6 sm:p-8 md:p-12"
        style={{ backgroundColor: colors.burgundy }}
      >
        <motion.h2
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-center sm:mb-8 md:mb-12"
          style={{ color: colors.cream }}
        >
          Why Choose Us?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            {
              icon: (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ),
              title: "Quality Products",
              description: "We source only the highest quality products from trusted suppliers worldwide."
            },
            {
              icon: (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Best Prices",
              description: "Competitive pricing without compromising on quality or customer service."
            },
            {
              icon: (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
              title: "Fast Shipping",
              description: "Quick and reliable delivery with real-time tracking to your doorstep."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              {...staggeredAnimation}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl shadow-sm text-center hover:shadow-md transition-shadow"
              style={{ backgroundColor: colors.tan }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="inline-block"
                style={{ color: colors.burgundy }}
              >
                {item.icon}
              </motion.div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3" style={{ color: colors.burgundy }}>{item.title}</h3>
              <p className="text-sm sm:text-base" style={{ color: colors.textDark }}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
      


      <motion.section
        {...sectionAnimation}
        className="py-12 sm:py-20 px-4 sm:px-6 text-center"
        style={{ backgroundColor: colors.tan }}
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: colors.burgundy }}>Connect With Us</h3>
        <p className="mb-6 sm:mb-8 text-sm sm:text-base" style={{ color: colors.textDark }}>
          Stay in touch for updates, offers, and nature-inspired fashion.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.instagram.com/nafilaeaa?igsh=b3hhOWg5ZXIzMnFu"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-full transition flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{ 
              backgroundColor: colors.burgundy,
              color: colors.cream
            }}
          >
            <i className="fab fa-instagram"></i> Instagram
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://wa.me/918113854750"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-full transition flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{ 
              backgroundColor: colors.burgundy,
              color: colors.cream
            }}
          >
            <i className="fab fa-whatsapp"></i> WhatsApp
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:nafilatk7@gmail.com"
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-full transition flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{ 
              backgroundColor: colors.burgundy,
              color: colors.cream
            }}
          >
            <i className="fas fa-envelope"></i> Email
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;