import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://gizmorent-server.vercel.app/recent-Order");
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Status background color function
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "returned":
        return "bg-red-500";
      case "on the way":
        return "bg-sky-500";
      case "way to return":
        return "bg-blue-500";
      case "ordered":
        return "bg-green-400";
      default:
        return "bg-gray-500";
    }
  };

  // Capitalize each word in the status text
  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="p-4 border border-gray-300 rounded-xl shadow-md overflow-hidden bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Orders</h2>
        <div className="flex space-x-2">
          <Link to='/dashboard/allorder'>
            <button className="btn btn-outline btn-sm">See all</button>
          </Link>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th>Products</th>
              <th>Customer</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="flex items-center space-x-3 py-2">
                  <div>
                    <img
                      src={order.product_img}
                      alt={order.product_name}
                      className="w-10 h-10 rounded-lg hidden md:block"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{order.product_name}</p>
                  </div>
                </td>
                <td>{order.customer_name}</td>
                <td className="font-semibold">${order.amount}</td>
                <td>
                  <span
                    className={`text-white px-3 py-1 text-sm font-semibold rounded-lg ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {capitalizeFirstLetter(order.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
