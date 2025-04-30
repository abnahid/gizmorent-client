import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
const HeroSection = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const toggleModal = () => {
    if (!user) {
      navigate("/login");
    } else {
      setModalOpen(!isModalOpen);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://gizmorent-server.vercel.app/renter_request",
        formData
      );
      console.log(response.data);
      toggleModal();
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occursky. Please try again.");
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            Find the Perfect Rental for You
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300">
            Explore a wide range of rental options and get started today.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="bg-Primary hover:bg-sky-600 px-6 py-3 rounded-lg text-lg font-semibold transition"
              onClick={toggleModal}
            >
              Become a Renter
            </button>
            <Link to="/dashboard/add-gadget">
              <button className="bg-Secondary hover:bg-sky-900 px-6 py-3 rounded-lg text-lg font-semibold transition">
                List Your Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Rental Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800/60 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
            <h3 className="text-2xl font-bold mb-4 text-center">Rental Application</h3>
            {errorMessage && (
              <p className="text-sky-500 mb-4 text-sm text-center">{errorMessage}</p>
            )}
            <form onSubmit={handleSubmit}>
              {["name", "email", "phone", "company", "address"].map((field) => (
                <div className="mb-4" key={field}>
                  <label htmlFor={field} className="block text-gray-700 mb-2 capitalize">
                    {field === "email" ? "Email Address" : field === "name" ? "Full Name" : field}
                  </label>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    id={field}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-Primary"
                    value={formData[field]}
                    onChange={handleChange}
                    readOnly={["name", "email"].includes(field) && user}
                    requisky
                  />
                </div>
              ))}
              <div className="text-right mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
