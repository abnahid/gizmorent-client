import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Swal from "sweetalert";
import useAdmin from "../../Hooks/useAdmin";
<<<<<<< HEAD
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useRenter from "../../Hooks/useRenter";
import useUser from "../../Hooks/useUser";
import Header from "../../Shared/Header";
import { uploadImage } from "../../utility/utility";
import useUser from "../../Hooks/useUser";
import useRenter from "../../Hooks/useRenter";
import useAdmin from "../../Hooks/useAdmin";
import useCategory from "../../Hooks/useCategory";
import Header from "../../Shared/Header";
const AddGadget = () => {
  const axiosPubic = useAxiosPublic();
  const [userData] = useUser();
  const [isRenter] = useRenter();
  const [isAdmin] = useAdmin();
  const { categories } = useCategory();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useSelector((state) => state.auth);

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const onSubmit = async (data) => {
    if (!data.image) {
      alert("Please upload an image.");
      return;
    }

    try {
      setUploading(true);

      const imageUrl = await uploadImage(data.image);

      const formattedData = {
        ...data,
        specifications: data.specifications
          .split("\n")
          .map((spec) => spec.trim())
          .filter(Boolean),
        features: data.features
          .split("\n")
          .map((feature) => feature.trim())
          .filter(Boolean),
        image: imageUrl,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity, 10),
      };
      if (isRenter) {
        formattedData.status = "pending";
        formattedData.renterId = userData?.renterCode;
        formattedData.companyname = userData?.companyname;
        await axiosPubic.post("/renter-gadgets", formattedData);
        console.log("Renter Gadget Data:", formattedData);
      } else if (isAdmin) {
        await axiosPubic.post("/gadgets", formattedData);
      }
      Swal({
        title: "Gadget added successfully!",
        text: "The form will reset in 3 seconds.",
        icon: "success",
        timer: 3000,
        button: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
        allowOutsideClick: false,
        timerProgressBar: true,
      }).then(() => {
        reset();
        setImagePreview(null);
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="md:px-6 py-6">
      <Header
        header={"Add Gadget"}
        title={
          "Manage your listed gadgets and track their rental activity easily."
        }

      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4">
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="input w-full py-6 rounded-lg"
          placeholder="Email*"
          value={user.email}
          readOnly={user}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          type="number"
          {...register("phone", { required: "Phone number is required" })}
          className="input w-full py-6 rounded-lg"
          placeholder="Phone Number*"
        />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

        <input
          type="text"
          {...register("name", { required: "Product Name is required" })}
          className="input w-full py-6 rounded-lg"
          placeholder="Product Name*"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <select
          {...register("category", { required: "Category is required" })}
          className="select select-bordered w-full "
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500">{errors.category.message}</p>
        )}

        <input
          type="number"
          {...register("price", { required: "Price is required", min: 1 })}
          className="input w-full py-6 rounded-lg"
          placeholder="Price*"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}

        <input
          type="number"
          {...register("quantity", {
            required: "Quantity is required",
            min: 1,
          })}
          className="input w-full py-6 rounded-lg"
          placeholder="Quantity*"
        />
        {errors.quantity && (
          <p className="text-red-500">{errors.quantity.message}</p>
        )}

        <div className="flex items-center gap-4">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-full border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full text-gray-500 border-2 border-gray-300 flex items-center justify-center">
              <FaPlus />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleImageChange}
          />
        </div>

        <textarea
          {...register("specifications", {
            required: "Specifications are required",
          })}
          className="w-full p-2 textarea rounded-lg mb-4"
          rows="5"
          placeholder="Enter specifications (one per line) e.g.:
Model: Wisdom Window Winner
Storage: Dual SD Card Slots
Battery Life: Approx. 580 shots per charge"
        ></textarea>
        {errors.specifications && (
          <p className="text-red-500">{errors.specifications.message}</p>
        )}

        <textarea
          {...register("features", { required: "Features are required" })}
          className="w-full p-2 textarea rounded-lg mb-4"
          rows="5"
          placeholder="Enter features (one per line) e.g.:
High-Resolution Sensor
Advanced Autofocus
4K Video Recording"
        ></textarea>
        {errors.features && (
          <p className="text-red-500">{errors.features.message}</p>
        )}

        <textarea
          {...register("description", { required: "Description is required" })}
          className="w-full p-2 textarea rounded-lg mb-4"
          rows="5"
          placeholder="Description"
        ></textarea>
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <button
          type="submit"
          className="btn bg-Primary text-white py-6 rounded-lg px-10 mt-4"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Add Gadget"}
        </button>
      </form>
    </div>
  );
};

export default AddGadget;