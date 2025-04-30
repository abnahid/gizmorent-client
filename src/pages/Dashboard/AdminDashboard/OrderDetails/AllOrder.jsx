import React, { useEffect, useState } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { fetchorders, updateOrderStatus } from '../../../../Redux/Feature/OrderSlice';
import Header from '../../../../Shared/Header';

const statusOptions = ['pending', 'ordered', 'on the way', 'delivered', 'way to return', 'returned'];



const selectedStatusColors = {
  pending: 'bg-yellow-500 border-yellow-500',
  ordered: 'bg-blue-500 border-blue-500',
  'on the way': 'bg-purple-500 border-purple-500',
  delivered: 'bg-green-500 border-green-500',
  'way to return': 'border-sky-500 bg-sky-500',
  returned: 'bg-red-500 border-red-500',
};

const AllOrder = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState(''); // Add state for the status filter

  useEffect(() => {
    dispatch(fetchorders());
  }, [dispatch]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const result = orders.filter((order) => {
      const productName = order.product_name || '';
      const customerName = order.customer_name || '';
      const email = order.email || '';
      const matchesSearch =
        productName.toLowerCase().includes(lowerCaseQuery) ||
        customerName.toLowerCase().includes(lowerCaseQuery) ||
        email.toLowerCase().includes(lowerCaseQuery);
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      return matchesSearch && matchesStatus; // Match both search and status filter
    });
    setFilteredOrders(result);
  }, [searchQuery, statusFilter, orders]);

  const handleStatusChange = (orderId, status) => {
    const currentIndex = statusOptions.indexOf(selectedStatuses[orderId] || orders.find(o => o._id === orderId)?.status);
    const newIndex = statusOptions.indexOf(status);
    if (newIndex < currentIndex) return;

    setSelectedStatuses((prev) => ({
      ...prev,
      [orderId]: status,
    }));

    dispatch(updateOrderStatus({ orderId, newStatus: status }));
  };

  const getSelectedStatusesUpTo = (status) => {
    const index = statusOptions.indexOf(status);
    return statusOptions.slice(0, index + 1);
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="md:px-6 py-6">
      <Header
        header={"All Orders"}
        title={
          "View and manage all customer orders, track activity, and ensure smooth operations."
        }

      />

      {/* Search and Filter Section */}
      <div className="flex justify-between gap-4 mb-4 rounded-xl shadow-md  bg-white p-4 border border-gray-300">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product name, customer name, or email"
          className="w-1/2 p-2 border border-gray-300 rounded"
        />
        <div className="relative w-1/5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full p-2 pr-8 border border-gray-300 rounded-md"
          >
            <option value="">Filter by status</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <RiArrowDropDownLine className="text-gray-500" size={24} />
          </div>
        </div>

      </div>

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => {
            const selectedStatus = selectedStatuses[order._id] || order.status;
            const filledStatusList = getSelectedStatusesUpTo(selectedStatus);

            return (
              <div key={order._id} className="border border-gray-300 flex gap-4 flex-col p-6 rounded-xl shadow-md bg-white">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={order.product_img}
                    alt={order.product_name}
                    className="w-48 h-auto object-cover rounded mb-2"
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{order.product_name}</h3>
                      <p><strong>Customer:</strong> {order.customer_name}</p>
                      <p><strong>Email:</strong> {order.email}</p>
                      <p><strong>Phone:</strong> {order.customer_phone}</p>
                      <p><strong>Address:</strong> {order.customer_address}</p>
                      <p><strong>Amount:</strong> ${order.amount}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Renting Time:</strong> <br />From: {order.renting_time}</p>
                      <p>To: {order.returning_time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {statusOptions.map((status) => {
                    const isFilled = filledStatusList.includes(status);
                    return (
                      <label key={status} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name={`status-${order._id}`}
                          checked={selectedStatus === status}
                          onChange={() => handleStatusChange(order._id, status)}
                          className={`radio w-6 h-6 rounded-full border-2 transition-colors duration-300
                            ${isFilled ? selectedStatusColors[status] : 'bg-white border-gray-400'}`}
                        />
                        <span className="capitalize">{status}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default AllOrder;