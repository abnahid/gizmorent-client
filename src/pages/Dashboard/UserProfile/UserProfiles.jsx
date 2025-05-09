/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useModal } from "../../../Hooks/useModal";
import { updateUserProfile } from "../../../Redux/authSlice";
import { uploadImage } from "../../../utility/utility";

const UserProfiles = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});
  const axiosPublic = useAxiosPublic();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userEmail = user?.email;

  useEffect(() => {
    const fetchUserData = async () => {
      if (userEmail) {
        try {
          const response = await axiosPublic.get(`/users?email=${userEmail}`);
          if (response.data) {
            setFormData({
              name: response.data.name || "",
              email: response.data.email || user.email || "",
              photoURL: response.data.photoURL || user.photoURL || "",
              address: response.data.address || "",
              pickupCountry: response.data.pickupCountry || "",
              cityState: response.data.cityState || "",
              deliveryZip: response.data.deliveryZip || "",
              customerId: response.data.customerId || "",
              position: response.data.position || "",
              companyname: response.data.companyname || "",
            });
          } else {
            setFormData({
              name: user.displayName || "",
              email: user.email || "",
              photoURL: user.photoURL || "",
              address: "",
              pickupCountry: "",
              cityState: "",
              deliveryZip: "",
              customerId: "",
              position: "",
              companyname: "",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to fetch user data!",
          });
        }
      }
    };

    fetchUserData();
  }, [userEmail, user, axiosPublic]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      let updatedData = { ...formData };

      if (formData.image) {
        const uploadedImageUrl = await uploadImage(formData.image);
        if (uploadedImageUrl) {
          updatedData.photoURL = uploadedImageUrl;
        }
      }
      // Check if a new image is uploaded
      if (formData.image) {
        const uploadedImageUrl = await uploadImage(formData.image);
        if (uploadedImageUrl) {
          updatedData.photoURL = uploadedImageUrl; // Update the photoURL
          setFormData((prevFormData) => ({
            ...prevFormData,
            photoURL: uploadedImageUrl, // Reflect the updated photoURL in the form data
          }));
        }
      }

      await axiosPublic.patch(`/users/${userEmail}`, updatedData);

      dispatch(
        updateUserProfile({
          name: updatedData.name,
          photo: updatedData.photoURL,
        })
      );

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      closeModal(); // Close modal automatically after success
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update profile. Try again.",
      });
    }
  };

  const sections = [
    {
      id: "meta",
      title: "User Meta Info",
      content: (
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full">
            <img
              src={
                formData.photoURL ||
                "https://i.ibb.co/rQr6L83/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="user"
            />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 xl:text-left">
              {formData.name || "N/A"}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500">
                {formData.position || "N/A"}
              </p>
              <div className="hidden h-3.5 w-px bg-gray-300 xl:block"></div>
              <p className="text-sm text-gray-500">
                {formData.companyname || "N/A"}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "info",
      title: "Pickup & Delivery Info",
      content: (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
          <div>
            <p className="text-sm text-base-content/70 mb-1">Pickup Country</p>
            <p className="text-base font-medium text-base-content">
              {formData.pickupCountry || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-base-content/70 mb-1">City/State</p>
            <p className="text-base font-medium text-base-content">
              {formData.cityState || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-base-content/70 mb-1">Delivery ZIP</p>
            <p className="text-base font-medium text-base-content">
              {formData.deliveryZip || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-base-content/70 mb-1">Customer ID</p>
            <p className="text-base font-medium text-base-content">
              {formData.customerId || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "address",
      title: "Address & Email",
      content: (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm text-base-content/70 mb-1">Address</p>
            <p className="text-base font-medium text-base-content">
              {formData.address || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-base-content/70 mb-1">Email</p>
            <p className="text-base font-medium text-base-content">
              {formData.email || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-5 lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Profile
      </h3>
      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className="p-5 border border-base-300 rounded-2xl bg-base-100"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-lg font-bold text-base-content mb-4">
                  {section.title}
                </h4>
                {section.content}
              </div>
              <button
                onClick={() => {
                  setEditingSection(section.id);
                  openModal();
                }}
                className="btn btn-outline rounded-full btn-sm lg:btn-md"
              >
                <MdOutlineModeEdit />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h4 className="text-2xl font-bold text-base-content mb-2">
              Edit{" "}
              {sections.find((section) => section.id === editingSection)?.title}
            </h4>
            <form className="flex flex-col gap-4">
              {editingSection === "meta" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="form-control">
                    <label className="label">Photo</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                      }
                      className="file-input"
                    />
                  </div>
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                  <div>
                    <label>Position</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                  <div>
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="companyname"
                      value={formData.companyname}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                </div>
              )}
              {editingSection === "info" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <label>Pickup Country</label>
                    <input
                      type="text"
                      name="pickupCountry"
                      value={formData.pickupCountry}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                  <div>
                    <label>City/State</label>
                    <input
                      type="text"
                      name="cityState"
                      value={formData.cityState}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                  <div>
                    <label>Delivery ZIP</label>
                    <input
                      type="text"
                      name="deliveryZip"
                      value={formData.deliveryZip}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                  <div>
                    <label>Customer ID</label>
                    <input
                      type="text"
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleInputChange}
                      className="input input-bordered"
                    />
                  </div>
                </div>
              )}
              {editingSection === "address" && (
                <div className="flex flex-col gap-5">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input input-bordered"
                  />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-ghost"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfiles;
