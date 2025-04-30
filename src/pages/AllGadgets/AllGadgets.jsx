import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGadgets, setPagination } from "../../Redux/Feature/gadgetSlice";
import Filter from "./Filter";
import FilterCategory from "./FilterCategory";
import FilterPrice from "./FilterPrice";
import Gadget from "./Gadget";
import Search from "./Search";
import img from "../../assets/image/2106.q703.016.S.m004.c10.household appliance realistic.jpg";
import { RxHamburgerMenu } from "react-icons/rx";

const AllGadgets = () => {
  const dispatch = useDispatch();
  const { gadgets, filters, loading, error, pagination } = useSelector(
    (state) => state.gadgets
  );
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchGadgets({ ...filters, page: pagination.currentPage }));
  }, [dispatch, filters, pagination.currentPage]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setShowFilterDrawer(false);
      }
    };

    if (showFilterDrawer) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDrawer]);

  const handlePageChange = (newPage) => {
    if (newPage !== pagination.currentPage) {
      dispatch(setPagination({ currentPage: newPage }));
    }
  };

  return (
    <div className="max-w-7xl mt-3  mx-auto px-8 pb-6">
      <div className="md:grid grid-cols-5 gap-8">
        <div className="hidden md:block col-span-1">
          {/* Filters */}
          <div className=" rounded-lg ">
            <FilterCategory />
            <FilterPrice />
          </div>
        </div>
        <div className="col-span-4">
          <div
            className="h-[250px] w-full mb-6 bg-cover bg-center relative rounded-lg"
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h2 className="text-white text-4xl font-bold">Rent Your Needs</h2>
            </div>
          </div>

          <div className="md:flex items-center gap-[130px] justify-between">
            <Search />
            <div className="flex justify-between items-center">
              <Filter />
              <div className="flex justify-between items-center mt-4 md:hidden">
                <button
                  className="px-4 py-2 border rounded-lg"
                  onClick={() => setShowFilterDrawer(true)}
                >
                  <RxHamburgerMenu />
                </button>
              </div>
            </div>
          </div>
          <div className="my-12">
            {loading ? (
              <p>Loading gadgets...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <Gadget gadgets={gadgets} />
            )}
          </div>

          {/* Pagination  */}
          {gadgets && (
            <div className="flex flex-wrap space-y-2 justify-center items-center mt-6 space-x-2">
              {/* Previous  */}
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>

              {/* Page Number */}
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg ${
                    pagination.currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {/* Next  */}
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-start z-50">
          <div
            ref={drawerRef}
            className="w-3/4 bg-white p-6 h-full overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="text-gray-600"
              >
                Close
              </button>
            </div>
            <FilterCategory />
            <FilterPrice />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllGadgets;