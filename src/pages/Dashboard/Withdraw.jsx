import React from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useUser from "../../Hooks/useUser";
import Swal from "sweetalert2";

const Withdraw = () => {
  const axiosPublic = useAxiosPublic();
  const [userData] = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    if (!userData) {
      console.error("User data not found!");
      return;
    }

    const withdrawalInfo = {
      ...data,
      name: userData?.displayName,
      email: userData?.email,
      status: "pending",
      date: new Date().toISOString(),
    };

    try {
      const res = await axiosPublic.post("/withdraw", withdrawalInfo);
      console.log(res.data);
      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Withdrawal Request Submitted Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        reset();
      }
    } catch (error) {
      console.error("Withdrawal Failed:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const withdrawalAmount = watch("withdrawalAmount");

  return (
    <div className="max-w-lg mx-auto md:p-6 rounded-md shadow-md mt-14">
      <h1 className="text-2xl font-bold mb-6 text-center">Withdraw</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Withdrawal Amount */}
        <div>
          <label className="block mb-1 font-semibold">
            Withdrawal Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("withdrawalAmount", {
              required: "Amount is required",
            })}
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.withdrawalAmount && (
            <p className="text-red-500 text-sm">
              {errors.withdrawalAmount.message}
            </p>
          )}
        </div>

        {/* Payment System */}
        <div>
          <label className="block mb-1 font-semibold">
            Select Payment System
          </label>
          <select
            {...register("paymentSystem", {
              required: "Payment system is required",
            })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select</option>
            <option value="bkash">Bkash</option>
            <option value="nagad">Nagad</option>
            <option value="rocket">Rocket</option>
            <option value="upay">Upay</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
          </select>
          {errors.paymentSystem && (
            <p className="text-red-500 text-sm">
              {errors.paymentSystem.message}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label className="block mb-1 font-semibold">Account Number</label>
          <input
            type="text"
            placeholder="Enter your account number"
            {...register("accountNumber", {
              required: "Account number is required",
            })}
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.accountNumber && (
            <p className="text-red-500 text-sm">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white font-semibold ${
            withdrawalAmount > 0
              ? "bg-black text-white"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={withdrawalAmount <= 0}
        >
          Withdraw
        </button>
      </form>
    </div>
  );
};

export default Withdraw;
