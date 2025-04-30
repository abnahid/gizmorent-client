import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveRenter,
  fetchRenterRequests,
  rejectRenter,
} from "../../../../Redux/Feature/renterRequestSlice";

import Swal from "sweetalert2";
import Header from "../../../../Shared/Header";

const RenterApproval = () => {
  const dispatch = useDispatch();
  const { requests = [], loading } = useSelector(
    (state) => state.renterRequests
  ); // added fallback for requests

  useEffect(() => {
    dispatch(fetchRenterRequests());
  }, [dispatch]);

  console.log(requests);
  const handleApprove = (email) => {
    dispatch(approveRenter(email))
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Renter approved successfully!",
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to approve renter.",
        });
      });
  };

  const handleReject = (email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(rejectRenter(email))
          .unwrap()
          .then(() => {
            Swal.fire(
              "Rejected!",
              "The renter request has been rejected.",
              "success"
            );
          })
          .catch(() => {
            Swal.fire("Oops!", "Failed to reject renter.", "error");
          });
      }
    });
  };

  return (
    <div className="md:px-6 py-6">
      <Header
        header={"Approve Renter"}
        title={
          "Review renter applications, verify details, and approve trusted individuals for your rentals."
        }

      />
      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm bg-white p-4">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No requests found
                </td>
              </tr>
            ) : (
              requests.map((renter) => (
                <tr key={renter._id}>
                  <td>{renter.name}</td>
                  <td>{renter.email}</td>
                  <td>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleApprove(renter.email)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(renter.email)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RenterApproval;
