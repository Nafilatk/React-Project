import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FiUsers, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

const Dashboard = () => {
  const colors = {
    primary: "#0B2B26",   
    secondary: "#1A5347", 
    accent: "#8EB69B",    
    highlight: "#DAF1DE", 
    background: "#F5F5F5",
    card: "#FFFFFF",      
    textDark: "#383832",  
    textLight: "#FFFFFF"  
  };

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [usersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/users'),
        axios.get('http://localhost:5000/products')
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);

      const allOrders = usersRes.data.flatMap(user => user.orders || []);
      setOrders(allOrders);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  const monthlyRevenue = Array(12).fill(0);
  orders.forEach(order => {
    if (order.date) {
      const month = new Date(order.date).getMonth();
      monthlyRevenue[month] += order.total || 0;
    }
  });

  const revenueData = monthlyRevenue.map((value, index) => ({
    month: new Date(0, index).toLocaleString('default', { month: 'short' }),
    revenue: value
  }));

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: colors.background
    }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: `4px solid ${colors.primary}`,
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
  );

  if (error) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: colors.background
    }}>
      <div style={{ 
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: '#FEE2E2',
        color: '#DC2626'
      }}>
        Error: {error}
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '24px',
      backgroundColor: colors.background
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: '600', 
        marginBottom: '24px',
        color: colors.primary
      }}>
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow-sm p-6" style={{ borderLeft: `4px solid ${colors.primary}` }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium" style={{ color: colors.textDark }}>Total Users</p>
              <p className="text-3xl font-bold mt-2" style={{ color: colors.primary }}>{users.length}</p>
              <p className="text-xs mt-1" style={{ color: colors.accent }}>+5.2% from last month</p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: colors.highlight }}>
              <FiUsers className="text-xl" style={{ color: colors.primary }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6" style={{ borderLeft: `4px solid ${colors.accent}` }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium" style={{ color: colors.textDark }}>Total Products</p>
              <p className="text-3xl font-bold mt-2" style={{ color: colors.accent }}>{products.length}</p>
              <p className="text-xs mt-1" style={{ color: colors.accent }}>+12.7% from last month</p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: colors.highlight }}>
              <FiShoppingBag className="text-xl" style={{ color: colors.accent }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6" style={{ borderLeft: `4px solid ${colors.secondary}` }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium" style={{ color: colors.textDark }}>Annual Revenue</p>
              <p className="text-3xl font-bold mt-2" style={{ color: colors.secondary }}>₹{totalRevenue.toLocaleString()}</p>
              <p className="text-xs mt-1" style={{ color: colors.accent }}>+18.3% from last year</p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: colors.highlight }}>
              <FiDollarSign className="text-xl" style={{ color: colors.secondary }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: colors.card,
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '16px',
          color: colors.primary
        }}>
          Monthly Revenue
        </h2>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke={colors.highlight}
              />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.textDark }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: colors.textDark }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: colors.card,
                  border: `1px solid ${colors.highlight}`,
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Bar 
                dataKey="revenue" 
                radius={[4, 4, 0, 0]}
                style={{ fill: colors.accent }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;