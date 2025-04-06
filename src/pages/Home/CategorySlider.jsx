import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, fetchGadgets } from "../../Redux/Feature/gadgetSlice";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const categories = [
  {
    name: "Smartphone",
    img: "https://i.ibb.co/ymq1PSjj/Adobe-Express-file-7.png",
  },
  {
    name: "Computer",
    img: "https://i.ibb.co/jv6t5FBN/Adobe-Express-file-9.png",
  },
  {
    name: "Cameras",
    img: "https://i.ibb.co/fdxdcJyh/Adobe-Express-file-8.png",
  },
  {
    name: "Gaming & VR",
    img: "https://i.ibb.co/gnhBhVf/Adobe-Express-file-10.png",
  },
  {
    name: "Audio & Music",
    img: "https://i.ibb.co/jvbVYsWs/Adobe-Express-file-6.png",
  },
  {
    name: "Wearables",
    img: "https://i.ibb.co/C5mbRDz0/Adobe-Express-file-11.png",
  },
  {
    name: "Laptop",
    img: "https://i.ibb.co/jv6t5FBN/Adobe-Express-file-9.png",
  },
];

const CategorySlider = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.gadgets.filters);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    const updatedFilters = { ...filters, category: categoryName };
    dispatch(setFilters(updatedFilters));
    dispatch(fetchGadgets(updatedFilters));
    navigate(`/allgadgets`);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="md:text-4xl text-2xl font-bold mb-4">Top Categories</h2>
        <div className="flex">
          <button className="prev-btn mr-3 bg-Accent p-2 shadow-lg rounded-full z-10">
            <FaChevronLeft />
          </button>

          <button className="next-btn bg-[#ffd166] p-2 shadow-lg rounded-full z-10">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Swiper Container */}
      <div className="w-full">
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={10}
          navigation={{
            nextEl: ".next-btn",
            prevEl: ".prev-btn",
          }}
          breakpoints={{
            480: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <div
                className="flex flex-col items-center w-44 h-44 bg-[#FFD166] p-4 rounded-lg cursor-pointer"
                onClick={() => handleCategoryClick(category.name)}
              >
                <img
                  src={category.img}
                  alt={category.name}
                  className="w-24 h-24 object-contain"
                />
                <p className="text-center font-medium">{category.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySlider;
