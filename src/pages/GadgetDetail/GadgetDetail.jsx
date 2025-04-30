import React, { useEffect } from "react";
import { FaRegStar } from "react-icons/fa6";

import { LuUsers } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import CheckAvail from "./CheckAvail";
import Description from "./Description";
import Message from "./Message";
import ReviewdData from "./ReviewdData";
import ReviewInput from "./ReviewInput";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGadgetDetails } from "../../Redux/Feature/gadgetSlice";
import { addToCart } from "../../Redux/Feature/cartSlice";
import { addToWishlist } from "../../Redux/wishlistSlice";
import Swal from "sweetalert2";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
const GadgetDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const user = useSelector((state) => state.auth.user);

  const { gadgetDetails, loading, error } = useSelector(
    (state) => state.gadgets
  );

  const cartItems = useSelector((state) => state.cart.items);

  const handleAddToCart = () => {
    const isAlreadyInCart = cartItems.some(
      (item) => item.gadgetId === gadgetDetails._id
    );

    if (isAlreadyInCart) {
      Swal.fire({
        icon: "info",
        title: "Already in Cart",
        text: "This item is already in your cart!",
      });
      return;
    }

    if (user?.email) {
      dispatch(
        addToCart({ gadget: gadgetDetails, email: user?.email, quantity: 1 })
      );
      Swal.fire("Success", "Item added to cart!", "success");
    } else {
      Swal.fire("Error", "You need to log in first.", "error");
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchGadgetDetails(id));
    }
  }, [dispatch, id]);

  const handleAddToWishlist = () => {
    const isAlreadyWishlisted = wishlistItems.some(
      (item) => item._id === gadgetDetails._id
    );

    if (isAlreadyWishlisted) {
      Swal.fire({
        icon: "info",
        title: "Already in Wishlist",
        text: "This item is already in your wishlist!",
      });
      return;
    }

    if (!user?.email) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please log in to add items to your wishlist.",
      });
      return;
    }

    // ✅ Pass both gadget and email
    dispatch(addToWishlist({ gadget: gadgetDetails, email: user?.email }));

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Item added to wishlist",
      showConfirmButton: false,
      timer: 1500,
    });

    navigate("/wishlist");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!gadgetDetails) {
    return <div>No gadget details found</div>;
  }

  return (
    <div>
      <div className="md:grid md:grid-cols-2 md:mx-12 p-6 md:p-12">
        <div className="md:col-span-1  items-center">
          <div className="border border-gray-300  rounded-lg">
            <img
              className="md:w-[400px] md:h-[400px] mx-auto cover"
              src={gadgetDetails.image}
              alt={gadgetDetails.name}
            />
          </div>

          <div className="flex justify-center my-6 gap-8">
            <button
              onClick={handleAddToCart}
              className=" text-Primary gap-2 items-center md:font-bold flex  mt-4 uppercase rounded-lg"
            >
              <AiOutlineShoppingCart className="font-bold text-sm md:text-2xl"></AiOutlineShoppingCart>{" "}
              Add to cartlist
            </button>
            <button
              onClick={handleAddToWishlist}
              className="text-Primary gap-2 items-center md:font-bold flex  mt-4 uppercase rounded-lg"
            >
              <AiOutlineHeart className="font-bold text-sm md:text-2xl"></AiOutlineHeart>{" "}
              add to wishlist
            </button>
          </div>
        </div>

        <div className="col-span-1 space-y-4 md:mx-6">
          {/* short describe */}
          <div className="bg-sky-100 md:px-5 rounded-lg space-y-2 ">
            <h2 className="text-2xl">{gadgetDetails.name}</h2>
            <p>{gadgetDetails.category}</p>
            <h6 className="font-bold text-Primary text-2xl">
              ${gadgetDetails.price || "48.00"}/
              <span className="text-sm font-normal">day</span>
            </h6>
          </div>

          <div>
            <CheckAvail />
          </div>
        </div>
      </div>

      {/* description start */}
      <div className="md:grid bg-sky-100 grid-cols-3 md:px-12 py-8 max-sm:py-4">
        <div className="col-span-2 mx-6">
          <Description gadgetDetails={gadgetDetails} />
        </div>

        <div className=" max-sm:mx-6 bg-white rounded-lg ">
          <div className="space-y-5 max-sm:mt-4 max-sm:pt-3 rounded-lg">
            <ReviewInput />
          </div>
          <div className=" mx-6 overflow-y-scroll h-[320px]">
            <ReviewdData productId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GadgetDetail;
