import { useEffect, useRef, useState } from "react";
import { AiFillProduct, AiOutlineBars } from "react-icons/ai";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BsFillHouseAddFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import {
  IoBagAddSharp,
  IoCheckmarkDoneCircleSharp,
  IoWallet,
} from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";
import { MdNotificationsActive, MdOutlineEventNote } from "react-icons/md";

import { FaUsersViewfinder } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import useAdmin from "../../Hooks/useAdmin";
import useRenter from "../../Hooks/useRenter";

const Sidebar = () => {
  const [isActive, setActive] = useState(false);
  const [isAdmin] = useAdmin();

  const [isRenter] = useRenter();
  const sidebarRef = useRef(null);

  const handleToggle = () => {
    setActive(!isActive);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isActive
      ) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive]);
  return (
    <>
      {/* Small Screen Navbar */}
      <div className="bg-gray-100 text-gray-800 fixed w-full z-20  flex justify-between md:hidden">
        <div>
          <div className="block cursor-pointer p-4 font-bold">
            <Link to="/">
              <h2 className="text-xl  text-Primary font-semibold">GizmoRent</h2>
            </Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* bg-gradient-to-b from-sky-50 to-sky-100 */}
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`z-10 fixed flex flex-col justify-between overflow-x-hidden bg-Primary text-white w-64 space-y-6 px-2 py-4  inset-y-0 left-0 transform ${
          isActive ? "translate-x-0" : "-translate-x-full"}  md:translate-x-0  transition duration-200 ease-in-out`}
      >
        <div>
          <div>
            <Link to="/">
              <div className="w-full  px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-sky-100 mx-auto">
                <h2 className="text-xl text-Primary font-semibold">
                  GizmoRent
                </h2>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col justify-between flex-1 mt-6">
            <nav>
              {/*  Menu Items */}

              {(isAdmin || isRenter) && (
                <NavLink to="/dashboard">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <BsFillHouseAddFill></BsFillHouseAddFill> Home
                  </p>
                </NavLink>
              )}

              {(isAdmin || isRenter) && (
                <NavLink to="/dashboard/add-gadget">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <LuNotebookPen /> Add Gadget
                  </p>
                </NavLink>
              )}

              {(isAdmin || isRenter) && (
                <NavLink to="/dashboard/my-gadget">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <MdOutlineEventNote></MdOutlineEventNote> My Gadget
                  </p>
                </NavLink>
              )}

              {isAdmin ||
                (isRenter && (
                  <NavLink to="/dashboard/withdraw">
                    <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                      <BiMoneyWithdraw /> Withdraw
                    </p>
                  </NavLink>
                ))}

              {isAdmin && (
                <NavLink to="/dashboard/allorder">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <IoBagAddSharp /> All Orders
                  </p>
                </NavLink>
              )}

              {isAdmin && (
                <NavLink to="/dashboard/renterapprove">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <IoCheckmarkDoneCircleSharp></IoCheckmarkDoneCircleSharp>
                    Renter Approve
                  </p>
                </NavLink>
              )}

              {isAdmin && (
                <NavLink to="/dashboard/renter-gadget">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <AiFillProduct />
                    Gadget Approve
                  </p>
                </NavLink>
              )}

              {isAdmin && (
                <NavLink to="/dashboard/payment-history">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <IoWallet></IoWallet>
                    Payment
                  </p>
                </NavLink>
              )}

              {isAdmin && (
                <NavLink to="/dashboard/withdraw-request">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <BiMoneyWithdraw />
                    Withdraw Request
                  </p>
                </NavLink>
              )}

              {isAdmin && (
                <NavLink to="/dashboard/rental-list">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <FaUsersViewfinder></FaUsersViewfinder>
                    All Renter
                  </p>
                </NavLink>
              )}

              {isAdmin && (
                <NavLink to="/dashboard/Rental-earning">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <FaMoneyBill1Wave />
                    Rentar Earning
                  </p>
                </NavLink>
              )}

              {isAdmin && (
                <NavLink to="/dashboard/admin-notifications">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <MdNotificationsActive />
                    Admin Notifications
                  </p>
                </NavLink>
              )}

              {isRenter && (
                <NavLink to="/dashboard/userprofile">
                  <p className="flex items-center gap-2 px-6 py-3 font-semibold">
                    <CgProfile></CgProfile>
                    Profile
                  </p>
                </NavLink>
              )}
            </nav>
          </div>

        </div>
        <div
          className="mt-auto pt-6 text-center text-xs"
        >
          <p>gizmo-rent v1.2.0</p>
        </div>
      </div >
    </>
  );
};

export default Sidebar;
