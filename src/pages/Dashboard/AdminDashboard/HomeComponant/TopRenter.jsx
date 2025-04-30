import axios from "axios";
import React, { useEffect, useState } from 'react';

const TopRenter = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedContributions, setSortedContributions] = useState([]);

  // Fetch orders and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          axios.get("https://gizmorent-server.vercel.app/orders"),
          axios.get("https://gizmorent-server.vercel.app/user"),
        ]);

        setOrders(ordersRes.data.requests || []);
        setUsers(usersRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Match and calculate contributions
  useEffect(() => {
    if (!orders.length || !users.length) return;

    const contributions = {};

    orders.forEach((order) => {
      const customerEmail = order.customer_email;
      const userNahme = order.customer_name;
      const amount = parseFloat(order.amount);

      if (!customerEmail || isNaN(amount)) return;

      const user = users.find((u) => u.email === customerEmail);

      if (!contributions[customerEmail]) {
        contributions[customerEmail] = {
          email: customerEmail,
          name: user?.name || userNahme,
          totalContribution: 0,
        };
      }

      contributions[customerEmail].totalContribution += amount;
    });

    const sorted = Object.values(contributions).sort(
      (a, b) => b.totalContribution - a.totalContribution
    );

    setSortedContributions(sorted);
    setSortedContributions((prev) => {
      return prev.slice(0, 5); // Limit to top 5 contributors
    });
  }, [orders, users]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 border border-gray-300 rounded-xl shadow-md overflow-hidden bg-white">
      <h2 className="text-2xl font-semibold mb-4">Top Contributors</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th>Name</th>
              <th>Total Contribution</th>
            </tr>
          </thead>
          <tbody>
            {sortedContributions.map((contributor, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td>{contributor.name}</td>
                <td>${contributor.totalContribution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopRenter;