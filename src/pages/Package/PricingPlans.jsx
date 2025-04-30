import React from "react";
import { useSelector } from "react-redux";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router";

const plans = [
  {
    id: 1,
    name: "Basic Plan",
    price: 25,
    period: "/month",
    features: [
      "Rent 1 Gadget",
      "7-Day Rental Period",
      "Standard Support",
      "Limited Access to Premium Devices",
    ],
    popular: false,
  },
  {
    id: 2,
    name: "Premium Plan",
    price: 50,
    period: "/month",
    features: [
      "Rent 3 Gadgets",
      "14-Day Rental Period",
      "Priority Support",
      "Access to High-End Devices",
      "Free Maintenance & Replacement",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "Professional Plan",
    price: 100,
    period: "/month",
    features: [
      "Unlimited Gadget Rentals",
      "30-Day Rental Period",
      "24/7 Premium Support",
      "Exclusive Access to Latest Tech",
      "Free Delivery & Pickup",
    ],
    popular: false,
  },
];



const PricingPlans = () => {

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const axiosPubic = useAxiosPublic();
  const handlePlan = async (plan) => {

    if (!user) {
      navigate("/login");
      return;}

    const planDetails = {
      email: user.email,
      planName: plan.name,
      planPrice: plan.price,
      planPeriod: plan.period,
    };
    try {
      const response = await axiosPubic.post("/subscription", planDetails);
      console.log(response.data);
      alert("Subscription successful!");
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Subscription failed. Try again.");
    }
  };
  return (
    <div>
      <div id="pricing" className="py-20 md:px-20 lg:px-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span
              className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-sm font-bold"
              data-aos="fade-down"
            >
              Our Pricing
            </span>
            <h2
              className="text-black text-[30px] mt-4 font-bold"
              data-aos="fade-down"
            >
              Choose Your Perfect Package
            </h2>
            <p
              className="mx-auto mt-4 max-w-2xl text-gray-400"
              data-aos="fade-down"
            >
              Select from our carefully curated photography packages designed to
              meet your specific needs and budget.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white border-gray-200 px-6 py-10 rounded-xl shadow-lg ${
                  plan.popular
                    ? "border-2 border-orange-500 hover:transform hover:-translate-y-2 transition-all duration-300"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-600 px-3 py-1 text-white text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {plan.name}
                  </h3>
                  <div className="mt-4 text-center">
                    <span className="text-4xl text-orange-500 font-bold">
                      {plan.price}
                    </span>
                    <span className="text-sm">{plan.period}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="mr-2 h-5 w-5 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9 12l2 2 4-4"></path>
                        </svg>
                        <span className="text-gray-800">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <span
                    onClick={() => handlePlan(plan)}
                    className="cursor-pointer w-full py-3 px-6 text-center text-white font-semibold rounded-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg hover:from-orange-600 hover:to-orange-700 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Choose Plan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
