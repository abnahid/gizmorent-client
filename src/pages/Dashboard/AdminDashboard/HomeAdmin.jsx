import React from "react";
import { useSelector } from "react-redux";
import Charts from './HomeComponant/Charts';
import ProductData from './HomeComponant/ProductData';
import RecentOrders from './HomeComponant/RecentOrders';
import RecentTransection from './HomeComponant/RecentTransection';
import Stat from './HomeComponant/Stat';
import TopRenter from './HomeComponant/TopRenter';
const HomeAdmin = () => {
  // const axiosPublic = useAxiosPublic();

  const { user } = useSelector((state) => state.auth);
  // const userEmail = user?.email;

  // useEffect(() => {

  //   const response = axiosPublic.get(`/users?email=${userEmail}`);
  //   // Handle the response if needed
  //   console.log(response.data);

  // }, [userEmail, axiosPublic]);

  return (

    <div className='md:px-6 py-6 mt-4'>

      {/* home hader */}
      <div
        className=" h-[300px] md:h-[350px] bg-cover bg-center  rounded-xl shadow-md overflow-hidden bg-white"
        style={{
          backgroundImage: `linear-gradient(rgb(1, 152, 182), rgba(1, 152, 182, 0.7)), url(${user?.photoURL || "https://i.imgur.com/8Km9tLL.png"
            })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className=" inset-0 flex items-center justify-center">
          <div className="text-center p-6 flex flex-col items-center gap-4">
            <img
              src={user?.photoURL || "https://i.imgur.com/8Km9tLL.png"}
              alt={user?.displayName || "User"}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome Back, {user?.displayName?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-purple-100 max-w-2xl mx-auto">
              Here's your personalized dashboard.
            </p>
          </div>
        </div>


      </div>

      <Stat></Stat>
      <Charts></Charts>
      <div className='mt-8 md:grid gap-8 grid-cols-6 '>

        <div className='col-span-2'>
          <ProductData></ProductData>
        </div>

        <div className='col-span-4'>
          <RecentOrders></RecentOrders>
        </div>


      </div>

      <div className='mt-8 md:grid gap-8 space-y-6 grid-cols-6 '>

        <div className='col-span-2'>
          <TopRenter></TopRenter>
        </div>

        <div className='col-span-4'>
          <RecentTransection></RecentTransection>
        </div>


      </div>

    </div>
  );
};

export default HomeAdmin;