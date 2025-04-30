import React, { useEffect, useState } from "react";

const RecentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("https://gizmorent-server.vercel.app/recent-payment");
        const data = await response.json();
        setPayments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recent payments:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div>Loading payments...</div>;
  }

  return (
    <div className="p-4 border border-gray-300 rounded-xl shadow-md overflow-hidden bg-white">
      <h2 className="text-2xl font-semibold mb-4">Recent Payments</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th>Email</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-100">
                <td>{payment.email}</td>
                <td className="font-semibold">${payment.amount}</td>
                <td>{payment.transactionId}</td>
                <td className="py-2 px-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                    Success
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

export default RecentPayments;
