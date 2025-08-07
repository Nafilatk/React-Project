import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className=" text-[#cbc0b2]">
      {/* Hero Section */}
      <section
        className="relative h-[90vh] flex flex-col justify-center items-left text-left px-6 bg-cover bg-center "
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/10/43/9c/10439ccfe99970caa1e955ac5a2be50a.jpg')",
          backgroundSize: "100% auto",
          
        }}
      >
        
        <div className="absolute inset-0 bg-[#181817]/70 z-0" />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow pb-4.5">
            Style Your Mind
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-[#cbc0b2] pb-4.5">
            Discover earthy tones & timeless style in women's fashion.
          </p>
          <Link
            to="/products"
            className="bg-[#550b14] hover:bg-[#7e6961] text-[#cbc0b2] px-8 py-3 rounded-full transition duration-300 pb-4.5"
          >
            Shop Now
          </Link>
        </div>
      </section>
      {/* Categories */}
      <section className="py-20 px-6 bg-[#7e6961] text-[#cbc0b2]">
        <h2 className="text-3xl font-bold text-center mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {["T-Shirts", "Shirts", "Tops", "Jackets"].map((cat) => (
            <div
              key={cat}
              className="bg-[#181817] hover:bg-[#550b14] transition p-6 rounded-xl shadow-lg text-center cursor-pointer"
            >
              <p className="text-xl font-semibold">{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section
        className="relative h-[70vh] flex flex-col justify-center items-center text-center px-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/5a/c7/bd/5ac7bd64e027c9d6a329d4f849105c28.jpg')",
          backgroundSize: "100% auto",
        }}
      >
{/*        
          <Link 
            to="/products"
            className="bg-[#550b14] hover:bg-[#7e6961] text-[#cbc0b2] px-8 py-3 rounded-full transition duration-300 "
          >
            Shop Now
          </Link> */}
        
      </section>

      {/* Connect With Us Section */}
      <section className="py-20 px-6 bg-[#cbc0b2] text-[#181817] text-center">
        <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
        <p className="mb-8">Stay in touch for updates, offers, and nature-inspired fashion.</p>
        
        <div className="flex justify-center gap-6 flex-wrap">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/nafilaeaa?igsh=b3hhOWg5ZXIzMnFu"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#550b14] hover:bg-[#7e6961] text-[#cbc0b2] px-6 py-3 rounded-full transition flex items-center gap-2"
          >
            <i className="fab fa-instagram"></i> Instagram
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/918113854750"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#550b14] hover:bg-[#7e6961] text-[#cbc0b2] px-6 py-3 rounded-full transition flex items-center gap-2"
          >
            <i className="fab fa-whatsapp"></i> WhatsApp
          </a>

          {/* Email */}
          <a
            href="mailto:nafilatk7@gmail.com"
            className="bg-[#550b14] hover:bg-[#7e6961] text-[#cbc0b2] px-6 py-3 rounded-full transition flex items-center gap-2"
          >
            <i className="fas fa-envelope"></i> Email
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;