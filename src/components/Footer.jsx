import { Link } from "react-router-dom";

const Footer = () => {
  const colors = {
    dark: "#181817",
    light: "#cbc0b2",
    primary: "#550b34",
    secondary: "#7e6961",
  };

  return (
    <footer className={`bg-[${colors.dark}] text-[${colors.light}] text-sm `}>
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className={`text-lg font-semibold text-[${colors.primary}] mb-3`}>GlamCart</h2>
          <p className={`text-[${colors.secondary}]`}>
            Discover stylish tops & outfits for every occasion. Made for women who love fashion & comfort.
          </p>
        </div>

        <div>
          <h3 className={`font-semibold mb-3 text-[${colors.primary}]`}>Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className={`hover:text-[${colors.primary}] transition-colors`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/products" 
                className={`hover:text-[${colors.primary}] transition-colors`}
              >
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/wishlist" 
                className={`hover:text-[${colors.primary}] transition-colors`}
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link 
                to="/cart" 
                className={`hover:text-[${colors.primary}] transition-colors`}
              >
                Cart
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`hover:text-[${colors.primary}] transition-colors`}
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-semibold mb-3 text-[${colors.primary}]`}>Contact Us</h3>
          <div className={`space-y-2 text-[${colors.secondary}]`}>
            <p>Email: support@glamcart.com</p>
            <p>Instagram: @glamcart.official</p>
            <p>Malappuram, Kerala</p>
          </div>
        </div>
      </div>

      <div className={`text-center py-4 border-t border-[${colors.secondary}]/30`}>
        <p className={`text-[${colors.secondary}]`}>
          &copy; {new Date().getFullYear()} GlamCart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;