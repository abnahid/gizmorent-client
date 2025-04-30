import { useEffect, useState } from "react";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdNotificationsActive } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { createSelector } from "reselect";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { logoutUser } from "../Redux/authSlice";
import { setFilters } from "../Redux/Feature/gadgetSlice";
import useAdmin from "../Hooks/useAdmin";
import useRenter from "../Hooks/useRenter";

// Memoized selector
const selectUser = createSelector(
  (state) => state.auth.user,
  (user) => ({ ...user })
);


const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { displayName, email, photoURL } = user;
  const [query, setQuery] = useState("");
  const filters = useSelector((state) => state.gadgets.filters);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const axiosPublic = useAxiosPublic();
  const [isAdmin] = useAdmin();
  const [isRenter] = useRenter();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value;

      const updatedFilters = { ...filters, query: value };
      dispatch(setFilters(updatedFilters));
      navigate("/allgadgets");
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosPublic.get(`/notifications?email=${email}`);
        setNotifications(res.data);
        // setNotificationCount(res.data.length);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    let intervalId;
    if (email) {
      fetchNotifications();
      intervalId = setInterval(fetchNotifications, 10000);
    }

    return () => clearInterval(intervalId);
  }, [email, axiosPublic]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;



  return (
    <div>
      {/* Top Banner */}
      <div className="bg-Primary">
        <div className="w-11/12 mx-auto py-1 max-w-7xl flex justify-between items-center text-white">
          <div className="flex justify-center items-center space-x-2">
            <IoShieldCheckmark />
            <h2 className="text-sm text-white">Welcome To GizmoRent</h2>
          </div>
          <Link to="/tracking">
            <div className="flex justify-center items-center space-x-2">
              <TbTruckDelivery />
              <h2 className="text-sm text-white">Track Your Order</h2>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-11/12 mx-auto max-w-7xl">
        <div className="navbar  z-50">
          {/* Navbar Start (Logo and Search Bar) */}
          <div className="navbar-start gap-6">
            {/* Logo */}
            <div className="text-2xl font-bold text-Primary">
              <NavLink to="/">GizmoRent</NavLink>
            </div>

            {/* Search Bar (Hidden on Mobile) */}
            <div className="relative items-center hidden lg:flex w-full">
              <FaSearch className="absolute left-3 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for gadgets..."
                className="w-full pl-10 pr-4 py-2 border focus:border-none rounded-full focus:outline-none focus:ring-2 focus:ring-Primary"
              />
            </div>
          </div>

          {/* Navbar End (Icons and Dropdowns) */}
          <div className="navbar-end gap-2 md:gap-5">
            {/* Wishlist Dropdown */}
            <div className="dropdown dropdown-end">

              <Link to="/wishlist">
                <label tabIndex="0" className="btn btn-ghost btn-circle hidden md:flex item-center">
                  <AiOutlineHeart className="text-2xl" />
                </label>
              </Link>

            </div>

            {/* Cart Dropdown */}
            <div className="dropdown dropdown-end hidden md:flex item-center">

              <Link to="/cart">
                <label tabIndex="0" className="btn btn-ghost btn-circle ">
                  <AiOutlineShoppingCart className="text-2xl" />
                </label>
              </Link>


            </div>
            {/* Notification Icon */}
            <div className="dropdown dropdown-end">

              <Link to="/notifications" >
                <div className="relative bg-sky-100 p-1.5 rounded-lg cursor-pointer">
                  <MdNotificationsActive className="text-2xl text-gray-700" />
                  {unreadCount > 0 && (
                    <div className="px-1 py-0.5 bg-sky-500 min-w-5 rounded-full text-center text-white text-xs absolute -top-2 -end-1 translate-x-1/4 text-nowrap">
                      <div className="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-sky-200 w-full h-full"></div>
                      {unreadCount}
                    </div>
                  )}
                </div>
              </Link>



            </div>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                <div className="rounded-full">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="Profile"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <CgProfile className="text-2xl" />
                  )}
                </div>
              </label>
              <ul
                tabIndex="0"
                className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-64 z-50"
              >
                {/* User Profile */}
                <li className="flex items-center justify-between">
                  <div className="flex items-center flex-row">
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt="Profile"
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    ) : (
                      <CgProfile className="text-2xl" />
                    )}
                    <div className="ml-3">
                      <p className="font-bold">
                        {" "}
                        {displayName ? displayName : "User Name"}{" "}
                      </p>
                      <a href="/user-profile" className="text-sm text-blue-500">
                        See your profile
                      </a>
                    </div>
                  </div>
                </li>

                {/* Show Register and Login Buttons only if user is not logged in */}
                {!email && (
                  <div className="flex gap-2 mt-3 justify-center items-center mx-4">
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-Primary text-white rounded-lg text-sm font-semibold w-full text-center"
                    >
                      Register
                    </Link>
                    <Link
                      to="/login"
                      className="px-4 py-2 border border-gray-400 rounded-lg text-sm font-semibold w-full text-center"
                    >
                      Log in
                    </Link>
                  </div>
                )}

                {/* Settings and Logout */}
                {email && (
                  <>
                    <div className="mt-3">
                      <Link to="/contact-us">
                        <button className="block text-left w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                          Help Center
                        </button>
                      </Link>
                    </div>
                    <li>
                      <a
                        onClick={() => dispatch(logoutUser())}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <IoMdLogOut className="text-2xl" />
                        <span>Logout</span>
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Mobile Menu (Hamburger Icon) */}
            <div className="dropdown dropdown-end">
              <label tabIndex="0" className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </label>
              <ul
                tabIndex="0"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-40 p-1 shadow"
              >
                <li>
                  <Link to="/allgadgets">All Gadgets</Link>
                </li>

                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/pricing">Pricing</Link>
                </li>

                <li>
                  <Link to="/renter">Become a Renter</Link>
                </li>
                {(isAdmin || isRenter) && (
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                )}
                <li>
                  <Link to="/reviews">Reviews</Link>
                </li>
                <li className="md:hidden">
                <Link to="/wishlist">
                Wishlist
              </Link>
                </li>
                <li className="md:hidden"><Link to="/cart">
                CartList
              </Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
