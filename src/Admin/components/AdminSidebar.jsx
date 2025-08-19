import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiPieChart, 
  FiShoppingBag, 
  FiHome, 
  FiUsers,
  FiSettings,
  FiX
} from 'react-icons/fi';

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`
      fixed inset-y-0 left-0 z-50
      w-64 h-full transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:relative md:translate-x-0
      bg-[#0B2B26] text-white
    `}>
      {/* Mobile close button */}
      <button 
        onClick={onClose}
        className="absolute right-4 top-4 p-1 md:hidden text-[#DAF1DE] hover:text-white"
      >
        <FiX className="h-6 w-6" />
      </button>

      <div className="p-4 border-b border-[#1A5347]">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      
      <nav className="p-4 h-[calc(100%-65px)] overflow-y-auto">
        <ul className="space-y-2">
          {[
            { path: "/admin/dashboard", icon: <FiPieChart className="mr-3" />, text: "Dashboard" },
            { path: "/admin/products", icon: <FiShoppingBag className="mr-3" />, text: "Products" },
            { path: "/admin/orders", icon: <FiHome className="mr-3" />, text: "Orders" },
            { path: "/admin/users", icon: <FiUsers className="mr-3" />, text: "Users" },
          ].map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg transition-colors
                  ${isActive ? 'bg-[#1A5347] text-white' : 'hover:bg-[#1A5347] text-[#DAF1DE]'}`
                }
              >
                {item.icon}
                {item.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;