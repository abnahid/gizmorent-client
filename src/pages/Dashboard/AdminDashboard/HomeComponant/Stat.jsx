import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CountUp from "react-countup";
import { FaDollarSign, FaUsers } from 'react-icons/fa';
import { MdOutlineBorderColor, MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { fetchorders } from '../../../../Redux/Feature/OrderSlice';

const Stat = () => {
  const dispatch = useDispatch();
  const [gadgets, setGadgets] = useState([]);
  const [users, setUsers] = useState([]);
  const [amount, setAmount] = useState([])
  const { orders } = useSelector((state) => state.order);
  const [totalRevenue, setTotalRevenue] = useState(0);


  useEffect(() => {
    dispatch(fetchorders());
  }, [dispatch]);

  useEffect(() => {
    const fetchGadgets = async () => {
      try {
        const res = await axios.get("https://gizmorent-server.vercel.app/gadgets");
        setGadgets(res.data);
      } catch (err) {
        console.error("Error fetching gadgets:", err);
      }
    };

    fetchGadgets();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://gizmorent-server.vercel.app/user");
        setUsers(res.data); // assuming your backend returns an array of users
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("https://gizmorent-server.vercel.app/payments");
        console.log('Fetched payments:', res.data);
        setAmount(res.data);
        const total = res.data.reduce((sum, payment) => sum + payment.amount, 0);
        const totalPrice = total / 1000
        const totalAmount = Math.floor(totalPrice);
        setTotalRevenue(totalAmount);
      } catch (err) {
        console.error("Error fetching Payments:", err);
      }
    };
    fetchPayments();
  }, []);




  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 max-w-7xl mx-auto">

        {/* Total Gadgets */}
        <div className="rounded-xl shadow-md overflow-hidden bg-white flex flex-col h-40 justify-between">
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-sky-600">Total Gadgets</p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={gadgets.length} duration={2} />
              </h3>
              <p className="text-xs mt-1 text-gray-500">10 Gadgets add everyday</p>
            </div>
            <div className="p-3 rounded-lg bg-sky-100">
              <MdOutlineProductionQuantityLimits className="text-2xl text-sky-500" />
            </div>
          </div>
          <div className="h-1 bg-sky-200"></div>
        </div>

        {/* Total Orders */}
        <div className="rounded-xl shadow-md overflow-hidden bg-white flex flex-col h-40 justify-between">
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-sky-600">Total Orders</p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={orders.length} duration={2} />
              </h3>
              <p className="text-xs mt-1 text-gray-500">10% Order place every day</p>
            </div>
            <div className="p-3 rounded-lg bg-sky-100">
              <MdOutlineBorderColor className="text-2xl text-sky-500" />
            </div>
          </div>
          <div className="h-1 bg-sky-200"></div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-xl shadow-md overflow-hidden bg-white flex flex-col h-40 justify-between">
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-sky-600">Total Revenue</p>
              <h3 className="text-3xl font-bold mt-2">
                $<CountUp end={totalRevenue} duration={2} separator="," />K+
              </h3>
              <p className="text-xs mt-1 text-gray-500">+36% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-sky-100">
              <FaDollarSign className="text-2xl text-sky-500" />
            </div>
          </div>
          <div className="h-1 bg-sky-200"></div>
        </div>

        {/* Total Users */}
        <div className="rounded-xl shadow-md overflow-hidden bg-white flex flex-col h-40 justify-between">
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-sky-600">Total Users</p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={users.length} duration={2} />+
              </h3>
              <p className="text-xs mt-1 text-gray-500">+47% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-sky-100">
              <FaUsers className="text-2xl text-sky-500" />
            </div>
          </div>
          <div className="h-1 bg-sky-200"></div>
        </div>

      </div>

    </div>
  );
};

export default Stat;
