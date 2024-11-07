import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://tripplanner-2ccq.onrender.com/api/reviews`
        );
        console.log(response.data);

        if (Array.isArray(response.data.reviews)) {
          setReviews(response.data.reviews);
        } else {
          setError("Received data is not in the expected format.");
        }
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "Error fetching reviews"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const staticProfilePic =
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"; // Static profile picture

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Reviews
      </h2>
      {reviews.length === 0 ? (
        <p className="text-center">No reviews yet.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex items-start p-4 border border-gray-300 rounded-lg shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-gray-50"
            >
              <img
                src={staticProfilePic}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">
                    {review.userId}
                  </span>
                  <span className="text-yellow-500">
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
