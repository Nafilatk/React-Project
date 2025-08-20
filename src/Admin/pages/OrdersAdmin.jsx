import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  

  const colors = {
    darkGreen: "#235347",
    green: "#8EB69B",
    lightGreen: "#DAF7DE",
    darkRed: "#B20B26",
    gray: "#383838"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await axios.get("http://localhost:5000/users");
        setUsers(resUsers.data);

        const allOrders = [];
        resUsers.data.forEach((user) => {
          if (user.orders && user.orders.length > 0) {
            user.orders.forEach((order) => {
              allOrders.push({
                ...order,
                userId: user.id,
                userName: user.name,
                userEmail: user.email
              });
            });
          }
        });
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId && o.userId === userId
            ? { ...o, status: newStatus }
            : o
        )
      );

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

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="h-12 w-12 border-t-4 border-b-4 rounded-full animate-spin"
          style={{ borderColor: colors.darkGreen }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8" style={{ color: colors.darkGreen }}>
          Orders Admin Dashboard
        </h2>

        <div className="mb-6 flex items-center gap-3">
          <label className="font-medium" style={{ color: colors.darkGreen }}>
            Filter by Status:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
            style={{
              borderColor: colors.green,
              color: colors.gray,
            }}
          >
            <option value="All">All</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>

          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl" style={{ color: colors.gray }}>
              No orders found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={`${order.userId}-${order.id}`}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
                  <div>
                    <p className="font-medium" style={{ color: colors.gray }}>
                      <span className="font-semibold" style={{ color: colors.darkGreen }}>
                        Order ID:
                      </span>{" "}
                      {order.id}
                    </p>
                    <p className="font-medium" style={{ color: colors.gray }}>
                      <span className="font-semibold" style={{ color: colors.darkGreen }}>
                        Date:
                      </span>{" "}
                      {new Date(order.date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: colors.gray }}>
                      <span className="font-semibold" style={{ color: colors.darkGreen }}>
                        Payment:
                      </span>{" "}
                      {order.paymentMethod}
                    </p>
                    <p className="font-medium" style={{ color: colors.gray }}>
                      <span className="font-semibold" style={{ color: colors.darkGreen }}>
                        Total:
                      </span>{" "}
                      <span style={{ color: colors.darkRed }}>₹{order.total}</span>
                    </p>
                  </div>
                </div>

                <div className="mb-1">
                  <p className="font-medium" style={{ color: colors.gray }}>
                    <span className="font-semibold" style={{ color: colors.darkGreen }}>
                      User:
                    </span>{" "}
                    {order.userName} ({order.userEmail})
                  </p>
                </div>

                <div className="mb-1">
                  <p className="font-semibold" style={{ color: colors.darkGreen }}>
                    Shipping Address:
                  </p>
                  <p style={{ color: colors.gray }}>
                    {order.shippingAddress || "No address provided"}
                  </p>
                </div>

                <div className="mb-1">
                  <p className="font-semibold mb-1" style={{ color: colors.darkGreen }}>
                    Items:
                  </p>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 border rounded-lg p-2"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-15 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: colors.gray }}>
                            {item.name}
                          </p>
                          <p className="text-sm" style={{ color: colors.darkGreen }}>
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="font-semibold" style={{ color: colors.darkRed }}>
                          ₹{item.quantity * item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold" style={{ color: colors.darkGreen }}>
                      Status:
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.userId, order.id, e.target.value)
                      }
                      className="border rounded px-3 py-1 text-sm"
                      style={{
                        backgroundColor:colors.darkGreen,
                        borderColor: colors.green,
                        color:"whitesmoke",
                      }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>

                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersAdmin;
