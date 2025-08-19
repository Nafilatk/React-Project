import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrdersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [openUser, setOpenUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const colors = {
    darkGreen: "#235347",
    green: "#8EB69B",
    lightGreen: "#DAF7DE",
    darkRed: "#B20B26",
    gray: "#383838"
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Toggle dropdown for user
  const toggleUser = (userId) => {
    setOpenUser(openUser === userId ? null : userId);
  };

  // Update order status in DB
  const updateOrderStatus = async (userId, orderId, newStatus) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      await axios.patch(`http://localhost:5000/users/${userId}`, {
        orders: updatedOrders,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, orders: updatedOrders } : u
        )
      );
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" >
        <div 
          className="h-12 w-12 border-t-4 border-b-4 rounded-full animate-spin"
          style={{ borderColor: colors.darkGreen }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8" style={{ color: colors.darkGreen }}>
          Orders Admin Dashboard
        </h2>

        {users.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl" style={{ color: colors.gray }}>No users found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg overflow-hidden shadow-sm bg-white"
              >
                {/* User Header */}
                <div
                  onClick={() => toggleUser(user.id)}
                  className="p-4 flex justify-between items-center cursor-pointer"
                  style={{ backgroundColor: colors.lightpGreen }}
                >
                  <div>
                    <p className="font-semibold text-lg" style={{ color: colors.darkGreen }}>
                      {user.name}
                    </p>
                    <p className="text-sm" style={{ color: colors.gray }}>
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" 
                      style={{ 
                        backgroundColor: colors.darkGreen,
                        color: 'white'
                      }}>
                      {user.orders?.length || 0} orders
                    </span>
                    <span className="text-lg" style={{ color: colors.darkGreen }}>
                      {openUser === user.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Dropdown Orders */}
                {openUser === user.id && (
                  <div className="p-4" >
                    {user.orders && user.orders.length > 0 ? (
                      <div className="space-y-4">
                        {user.orders.map((order) => (
                          <div
                            key={order.id}
                            className="border rounded-lg p-4 bg-white shadow-xs"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="font-medium" style={{ color: colors.gray }}>
                                  <span className="font-semibold" style={{ color: colors.darkGreen }}>
                                    Order ID:
                                  </span> {order.id}
                                </p>
                                <p className="font-medium" style={{ color: colors.gray }}>
                                  <span className="font-semibold" style={{ color: colors.darkGreen }}>
                                    Date:
                                  </span> {new Date(order.date).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium" style={{ color: colors.gray }}>
                                  <span className="font-semibold" style={{ color: colors.darkGreen }}>
                                    Payment:
                                  </span> {order.paymentMethod}
                                </p>
                                <p className="font-medium" style={{ color: colors.gray }}>
                                  <span className="font-semibold" style={{ color: colors.darkGreen }}>
                                    Total:
                                  </span> <span style={{ color: colors.darkRed }}>₹{order.total}</span>
                                </p>
                              </div>
                            </div>

                            <div className="mb-3">
                              <p className="font-semibold" style={{ color: colors.darkGreen }}>
                                Shipping Address:
                              </p>
                              <p style={{ color: colors.gray }}>
                                {order.shippingAddress || "No address provided"}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold" style={{ color: colors.darkGreen }}>
                                  Status:
                                </span>
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    updateOrderStatus(user.id, order.id, e.target.value)
                                  }
                                  className="border rounded px-3 py-1 text-sm"
                                  style={{ 
                                    borderColor: colors.green,
                                    color: colors.gray
                                  }}
                                >
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-semibold" style={{ color: colors.darkGreen }}>
                                  Items:
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs" 
                                  style={{ 
                                    backgroundColor: colors.darkGreen,
                                    color: 'white'
                                  }}>
                                  {order.items?.length || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4" style={{ color: colors.gray }}>
                        No orders found for this user
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersAdmin;