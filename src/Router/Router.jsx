import { createBrowserRouter } from "react-router-dom";
import Root from "../MainLayout/Root";

import AdminDashboard from "../MainLayout/Dashboard/AdminDashboard/AdminDashboard";
import DashboardLayout from "../MainLayout/DashboardLayout";
import AboutPage from "../pages/About/AboutPage";
import AllGadgets from "../pages/AllGadgets/AllGadgets";
import Renter from "../pages/BecomeRenter/Renter";
import Checkout from "../pages/Checkout/Checkout";
import CreditPayment from "../pages/Checkout/Creditpayment/CreditPayment.jsx";
import PaymentCancel from "../pages/Checkout/SSLCommerzService/PaymentCancel.jsx";
import PaymentFail from "../pages/Checkout/SSLCommerzService/PaymentFail.jsx";
import PaymentSuccess from "../pages/Checkout/SSLCommerzService/PaymentSuccess.jsx";
import AddGadget from "../pages/Dashboard/AddGadget";
import HomeAdmin from "../pages/Dashboard/AdminDashboard/HomeAdmin";
import RenterApproval from '../pages/Dashboard/AdminDashboard/RenterApproval/RenterApproval.jsx';
import DashboardHome from "../pages/Dashboard/DashboardHome";
import MyGadget from "../pages/Dashboard/MyGadget";
import PaymentPage from "../pages/Dashboard/PaymentPage";
import UpdateGadget from "../pages/Dashboard/UpdateGadget.jsx";
import UserProfiles from "../pages/Dashboard/UserProfile/UserProfiles";
import ErrorPage from "../pages/ErrorPage";
import GadgetDetail from "../pages/GadgetDetail/GadgetDetail";
import Home from "../pages/Home/Home";
import ForgotPassword from "../pages/Login/ForgotPassword";
import Login from "../pages/Login/Login";
import ResetPasswordPage from "../pages/Login/ResetPasswordPage";
import PackagePage from "../pages/Package/PackagePage";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import Register from "../pages/Register/Register";
import CartList from "../pages/Shopping/CartList";
import Wishlist from "../pages/Shopping/Wishlist";
import OrderForm from "../pages/TrackingPage/OrderForm";
import TrackingPage from "../pages/TrackingPage/TrackingPage";

import CreditPayment from "../pages/Checkout/Creditpayment/CreditPayment.jsx";
import AllOrder from "../pages/Dashboard/AdminDashboard/OrderDetails/AllOrder.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cart",
        element: <CartList />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      {
        path: "/AdminDashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/gadgetdetail/:id",
        element: <GadgetDetail />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },

      {
        path: "/creditpayment",
        element: <CreditPayment></CreditPayment>,
      },
      {
        path: "/renter",
        element: <Renter />,
      },
      {
        path: "/allgadgets",
        element: <AllGadgets />,
      },
      {
        path: "/tracking-page",
        element: <TrackingPage></TrackingPage>,
      },
      {
        path: "/tracking",
        element: <OrderForm></OrderForm>,
      },
      {
        path: "/pricing",
        element: <PackagePage></PackagePage>,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy></PrivacyPolicy>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardHome />,
      },
      {
        path: "add-gadget",
        element: <AddGadget />,
      },

      {
        path: "allorder",
        element: <AllOrder></AllOrder>,
      },
    
      {
        path: "update-gadget/:id",
        element: <UpdateGadget />,
        loader: async ({ params }) => {
          const response = await fetch(`http://localhost:5000/gadgets/${params.id}`);
          if (!response.ok) {
            throw new Error(`Gadget not found for ID: ${params.id}`);
          }
          const data = await response.json();
          return data;
        }
      },
      {
        path: "my-gadget",
        element: <MyGadget />,
      },
      {
        path: "userprofile",
        element: <UserProfiles />,
      },
      // admin
      {
        path: "adminhome",
        element: <HomeAdmin></HomeAdmin>,
      },
      {
        path: "renterapprove",
        element: <RenterApproval></RenterApproval>
      },
      {
        path: "payment-history",
        element: <PaymentPage></PaymentPage>
      },
    ],
  },
  {
    path: "/payment-success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment-cancel",
    element: <PaymentCancel />,
  },
  {
    path: "/payment-fail",
    element: <PaymentFail />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);