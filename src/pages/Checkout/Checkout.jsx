import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setFormData } from "../../Redux/Feature/checkoutSlice";
import LocationSelector from "../../Shared/LocationSelector";
import CartTotal from "./CartTotal";
import { initiateSSLCOMMERZPayment } from "./SSLCommerzService/sslcommerzPayment";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
const Checkout = () => {
  const dispatch = useDispatch();

  const { bookingDetails, paymentDetails, checkoutProduct, loading, error } =
    useSelector((state) => state.checkout);

  const { user } = useSelector((state) => state.auth);
  const axiosPubic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await axiosPubic.get(
          `/subscription/active?email=${user?.email}`
        );
        const data = res.data;
        if (data?.active) {
          setHasActivePlan(true);
          setSubscriptionData(data.subscription);
        } else {
          setHasActivePlan(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.email) {
      fetchSubscription();
    }
  }, [user, axiosPubic]);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    if (data.paymentMethod === "Order with Subscription") {
      if (!hasActivePlan) {
        alert("You must purchase a subscription plan first.");
        navigate("/pricing");
        return;
      }
      const orderData = checkoutProduct.map((product) => ({
        amount: 0,
        product_name: product.name,
        product_id: product.gadgetId,
        product_img: product.image,
        customer_name: data?.name,
        email: user.email,
        customer_phone: data?.phone,
        customer_address: `${data?.upazila}, ${data?.district}`,
        renting_time: data?.pickupDate,
        returning_time: data?.dropDate,
        status: "pending",
        quantity: product.quantity,
        orderId: product._id,
        date: new Date(),
        renterId: product.renterId,
      }));

      await axiosSecure.post("/orders", orderData);

      Swal.fire({
        icon: "success",
        title: "Order Complete",
        text: "Your Order is now Pending. Wait for Confirm.",
      });

      return;
    }

    dispatch(setFormData(data));
    if (data.paymentMethod === "Credit Card") {
      navigate("/creditpayment");
      return;
    }
    if (data.paymentMethod === "SSLCommerz") {
      setIsProcessing(true);
      await initiateSSLCOMMERZPayment(paymentDetails, data);
      setIsProcessing(false);
    }

    if (!paymentDetails?.total) {
      alert("Invalid payment amount. Please check your cart.");
      return;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-5 mb-6">
      <h2 className="text-4xl font-semibold mb-4">Checkout</h2>
      <div className="flex flex-col-reverse md:flex-row gap-6">
        <div className="md:w-2/3">
          <div>
            <h3 className="text-xl font-semibold">Billing Details</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mt-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-semibold">
                  {" "}
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={bookingDetails?.name}
                  {...register("name", { required: "Name is required" })}
                  className="input w-full py-6"
                  placeholder="Name*"
                />
              </div>
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
              <div>
                <label htmlFor="phone" className="block mb-1 font-semibold">
                  {" "}
                  Phone Number{" "}
                </label>
                <input
                  type="number"
                  defaultValue={bookingDetails?.phone}
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="input w-full py-6"
                  placeholder="Phone Number*"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}

              <label htmlFor="email" className="block mb-1 font-semibold">
                Email
              </label>

              <input
                type="email"
                defaultValue={bookingDetails?.email || user?.email}
                {...register("email", { required: "Email is required" })}
                className="input w-full py-6"
                placeholder="Email*"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}

              <label htmlFor="pickupDate" className="block mb-1 font-semibold">
                Pickup Date
              </label>
              <input
                type="date"
                {...register("pickupDate", {
                  required: "Pickup date is required",
                })}
                className="input w-full py-6"
                placeholder="Pickup Date*"
              />
              {errors.pickupDate && (
                <p className="text-red-500">{errors.pickupDate.message}</p>
              )}

              <label htmlFor="dropDate" className="block mb-1 font-semibold">
                Drop Date
              </label>
              <input
                type="date"
                {...register("dropDate", { required: "Drop date is required" })}
                className="input w-full py-6"
                placeholder="Drop Date*"
              />
              {errors.dropDate && (
                <p className="text-red-500">{errors.dropDate.message}</p>
              )}

              <LocationSelector
                control={control}
                register={register}
                setValue={setValue}
                watch={watch}
              />

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Payment Method</h3>
                <div className="space-y-2">
                  {hasActivePlan && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        {...register("paymentMethod", {
                          required: "Please select a payment method",
                        })}
                        value="Order with Subscription"
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span>
                        Order with Subscription (Active Plan:{" "}
                        {subscriptionData?.planName})
                      </span>
                    </label>
                  )}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      {...register("paymentMethod", {
                        required: "Please select a payment method",
                      })}
                      value="Credit Card"
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span>Credit Card</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      {...register("paymentMethod", {
                        required: "Please select a payment method",
                      })}
                      value="SSLCommerz"
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span>SSLCommerz</span>
                  </label>
                </div>

                {errors.paymentMethod && (
                  <p className="text-red-500">{errors.paymentMethod.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`bg-Primary py-4 px-10 mt-4 text-white ${
                  isProcessing && "opacity-50 cursor-not-allowed"
                }`}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
        <div className="md:w-1/3">
          <CartTotal />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
