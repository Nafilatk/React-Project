import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FiLogOut, FiMenu, FiUser } from 'react-icons/fi';

const AdminNavbar = ({ toggleSidebar }) => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <button 
          onClick={toggleSidebar}
          className="text-[#383832] focus:outline-none md:hidden"
        >
          <FiMenu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-[#DAF1DE] flex items-center justify-center">
              <FiUser className="text-[#0B2B26]" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#383832]">{user?.name}</p>
              <p className="text-xs text-[#1A5347]">Admin</p>
            </div>
            <button 
              onClick={logoutUser}
              className="ml-4 text-[#383832] hover:text-red-500 transition-colors"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;