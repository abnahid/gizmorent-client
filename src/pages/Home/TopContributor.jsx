import axios from "axios";
import React, { useEffect, useState } from "react";

const TopContributor = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topContributor, setTopContributor] = useState(null);
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
      const amount = parseFloat(order.amount);
      const userNahme = order.customer_name;

      if (!customerEmail || isNaN(amount)) return;

      const user = users.find((u) => u.email === customerEmail);

      if (!contributions[customerEmail]) {
        contributions[customerEmail] = {
          email: customerEmail,
          name: user?.name || userNahme || "Unknown",
          profileImage:
            user?.photoURL ||
            "https://i.ibb.co/rQr6L83/default-avatar-icon-of-social-media-user-vector.jpg",
          orders: [],
          totalContribution: 0,
        };
      }

      contributions[customerEmail].orders.push(order);
      contributions[customerEmail].totalContribution += amount;
    });

    const sorted = Object.values(contributions)
      .map((user) => ({
        ...user,
        totalOrders: user.orders.length,
      }))
      .sort((a, b) => b.totalContribution - a.totalContribution);

    setSortedContributions(sorted);
    setTopContributor(sorted[0]);
  }, [orders, users]);

  const filteredContributions = sortedContributions.filter(
    (contributor) => contributor.email !== topContributor?.email
  );

  if (loading) return <p>Loading...</p>;

  return (

    <div className="">   
     <h2 className=" md:text-4xl text-2xl font-bold">Top Contributor</h2>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
     
      {/* Top Contributor Card */}
      {topContributor && (
        <div className="h-full bg-white rounded-lg shadow-md p-6 flex flex-col justify-center items-center ">
          <div className="relative w-[120px] h-[120px] hover:scale-105">
            <div className="rounded-full border-4 border-Primary overflow-hidden shadow-md  transition-transform duration-300">
              <img
                src={topContributor.profileImage}
                alt={topContributor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-[32px] h-[32px] transform rotate-45">
              <svg
                fill="#0198b6"
                className="w-9 h-9"
                viewBox="0 0 220 220"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M220,98.865c0-12.728-10.355-23.083-23.083-23.083s-23.083,10.355-23.083,23.083c0,5.79,2.148,11.084,5.681,15.14 l-23.862,21.89L125.22,73.002l17.787-20.892l-32.882-38.623L77.244,52.111l16.995,19.962l-30.216,63.464l-23.527-21.544 c3.528-4.055,5.671-9.344,5.671-15.128c0-12.728-10.355-23.083-23.083-23.083C10.355,75.782,0,86.137,0,98.865 c0,11.794,8.895,21.545,20.328,22.913l7.073,84.735H192.6l7.073-84.735C211.105,120.41,220,110.659,220,98.865z" />
              </svg>
            </div>
          </div>

          <h1 className="text-lg font-bold text-gray-800 mt-4">
            {topContributor.name}
          </h1>
          <p className="text-md text-gray-600">
            Total Contribution: ${topContributor.totalContribution}
          </p>
          <p className="text-md text-gray-500">
            Total Orders: {topContributor.totalOrders}
          </p>
        </div>
      )}

      {/* Contribution Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border-b w-[50px]">#</th>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Total Orders</th>
              <th className="p-2 border-b">Total Contribution</th>
            </tr>
          </thead>
          <tbody>
            {filteredContributions.slice(0, 6).map((user, index) => (
              <tr key={index} className="border-t">
                <td className="p-2 text-center">{index + 1}</td>
                <td className="p-2 flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0
                      ? "bg-Primary"
                      : index === 1
                        ? "bg-sky-500"
                        : index === 2
                          ? "bg-Secondary"
                          : "bg-transparent"
                      }`}
                  >
                    <img
                      src={user.profileImage}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  </div>
                  {user.name}
                </td>

                <td className="p-2 text-center">{user.totalOrders}</td>
                <td className="p-2">${user.totalContribution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div> 
    </div>
    
  
  );
};

export default TopContributor;
