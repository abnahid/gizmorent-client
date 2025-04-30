import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, fetchGadgets } from "../../Redux/Feature/gadgetSlice";
import { useNavigate } from "react-router-dom";

const FilterBar = () => {
  const globalFilters = useSelector((state) => state.gadgets.filters);

  const [filters, setLocalFilters] = useState({
    ...globalFilters,
    price: "",
    rating: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Price options mapped by category
  const priceOptionsByCategory = {
    Laptop: ["0-50", "50-500", "500+"],
    Speakers: ["0-50", "50-150", "150+"],
    Desktop: ["0-200", "200-700", "700+"],
    Projector: ["0-100", "100-300", "300+"],
    "Air Conditioner": ["0-300", "300-800", "800+"],
    default: ["0-50", "50-200", "200+"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };

    // Reset price when category changes
    if (name === "category") {
      updated.price = "";
    }

    setLocalFilters(updated);
  };

  const handleSearch = () => {
    let updatedFilters = { ...filters };

    // Convert price to min/max
    if (updatedFilters.price) {
      if (updatedFilters.price.includes("-")) {
        const [min, max] = updatedFilters.price.split("-").map(Number);
        updatedFilters.minPrice = min;
        updatedFilters.maxPrice = max;
      } else if (updatedFilters.price.includes("+")) {
        const min = parseInt(updatedFilters.price.replace("+", ""));
        updatedFilters.minPrice = min;
        updatedFilters.maxPrice = 999999;
      }
      delete updatedFilters.price;
    }

    dispatch(setFilters(updatedFilters));
    dispatch(fetchGadgets(updatedFilters));
    navigate("/allgadgets");
  };

  const currentPriceOptions =
    priceOptionsByCategory[filters.category] || priceOptionsByCategory.default;

  return (
    <div className="my-10 px-4 py-6 bg-white rounded-2xl shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-center mb-3">Filters</h2>
      <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center">

        {/* Category Filter */}
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="select p-2 w-36 border border-gray-300 rounded-md outline-Primary"
        >
          <option value="">Category</option>
          <option value="Laptop">Laptop</option>
          <option value="Speakers">Speakers</option>
          <option value="Desktop">Desktop</option>
          <option value="Projector">Projector</option>
          <option value="Air Conditioner">Air Conditioner</option>
        </select>

        {/* Price Filter (dynamic) */}
        <select
          name="price"
          value={filters.price}
          onChange={handleChange}
          className="select p-2 w-36 border border-gray-300 rounded-md outline-Primary"
        >
          <option value="">Price</option>
          {currentPriceOptions.map((range, idx) => (
            <option key={idx} value={range}>${range}</option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          name="rating"
          value={filters.rating}
          onChange={handleChange}
          className="select p-2 w-36 border border-gray-300 rounded-md outline-Primary"
        >
          <option value="">Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars & Up</option>
          <option value="3">3 Stars & Up</option>
        </select>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-Primary text-white px-4 py-2 rounded-md font-semibold hover:bg-sky-600"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
