import React, { useState } from 'react';
import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <AdminNavbar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;