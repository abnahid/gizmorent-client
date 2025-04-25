import Lottie from "lottie-react";
import { Link, useRouteError } from "react-router-dom";
import Error404 from "../assets/lottie/Lost in Space.json";
function ErrorPage() {
  const error = useRouteError();
  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="m-2 w-2/3">
          <Lottie animationData={Error404} loop={true} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 mt-2">
          <i>Sorry, {error.statusText || error.message}</i>
        </p>
        <Link to="/">
          <button className="mt-6 mb-12 px-4 py-2 bg-Primary text-white rounded-lg shadow-lg hover:bg-orange-400">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
