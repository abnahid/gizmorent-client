import { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  MdAttachMoney,
  MdOutlineBorderColor,
  MdOutlineProductionQuantityLimits,
  MdOutlineRateReview,
} from "react-icons/md";
import { useSelector } from "react-redux";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useUser from "../../../Hooks/useUser";

const RenterStat = () => {
  const axiosPublic = useAxiosPublic();
  const [userData] = useUser();
  const [myGadgets, setMyGadgets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [renterEarnings, setRenterEarnings] = useState(0);
  const [reviews, setReviews] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userData && userData.email) {
      const fetchGadgets = async () => {
        try {
          const response = await axiosPublic.get("/gadgets");
          const filteredGadgets = response.data.filter(
            (gadget) => gadget.email === userData.email
          );
          setMyGadgets(filteredGadgets);
        } catch (error) {
          console.error("Error fetching gadgets:", error);
        }
      };

      fetchGadgets();
    }
  }, [axiosPublic, userData]);

  useEffect(() => {
    if (!userData?.renterCode) return;

    axiosPublic
      .get(`/renter-orders-summary/${userData.renterCode}`)
      .then((res) => {
        setOrders(res.data.totalOrders); // this is a number
        setRenterEarnings(res.data.renterEarnings);
      })
      .catch((err) => {
        console.error("Failed to fetch renter order summary:", err);
      });
  }, [axiosPublic, userData?.renterCode]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPublic.get(
          `/renter-orders-summary/${userData.renterCode}`
        );
        setRenterEarnings(response.data.renterEarnings);
      } catch (error) {
        console.error("Error fetching renter earnings:", error);
      }
    };

    fetchData();
  }, [axiosPublic, userData]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axiosPublic.get(
          `/renter-review/${userData.email}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReview();
  }, [axiosPublic, userData]);

  return (
    <div className="md:px-6 py-6">
      <div
        className=" h-[300px] md:h-[350px] bg-cover bg-center  rounded-xl shadow-md overflow-hidden bg-white "
        style={{
          backgroundImage: `linear-gradient(rgb(1, 152, 182), rgba(1, 152, 182, 0.7)), url(${user?.photoURL || "https://i.imgur.com/8Km9tLL.png"
            })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="  flex items-center justify-center">
          <div className="text-center p-6 flex flex-col items-center gap-4">
            <img
              src={user?.photoURL || "https://i.imgur.com/8Km9tLL.png"}
              alt={user?.displayName || "User"}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome Back, {user?.displayName?.split(" ")[1] || "User"}!
            </h1>
            <p className="text-purple-100 max-w-2xl mx-auto">
              Here's your personalized dashboard.
            </p>
          </div>
        </div>


      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 max-w-7xl mx-auto">

        {/* Total Gadgets */}
        <div className="rounded-xl shadow-md overflow-hidden bg-white flex flex-col h-40 justify-between">
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-sky-600">Total Gadgets</p>
              <h3 className="text-3xl font-bold mt-2">
                <CountUp end={myGadgets.length} duration={2} />
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
                <CountUp end={orders || 0} duration={2} />
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
                $<CountUp end={renterEarnings} duration={2} separator="," />K+
              </h3>
              <p className="text-xs mt-1 text-gray-500">+36% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-sky-100">
              <MdAttachMoney className="text-2xl text-sky-500" />
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
                <CountUp end={reviews.length} duration={2} />+
              </h3>
              <p className="text-xs mt-1 text-gray-500">+47% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-sky-100">
              <MdOutlineRateReview className="text-2xl text-sky-500" />
            </div>
          </div>
          <div className="h-1 bg-sky-200"></div>
        </div>

      </div>

    </div>
  );
};

export default RenterStat;
