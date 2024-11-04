import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]); // Initial state as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://tripplanner-1.onrender.com/api/reviews`
        );
        console.log(response.data);

        // Ensure response contains an array of reviews
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
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"; // Your static image URL

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Reviews
      </h2>
      {reviews.length === 0 ? (
        <p className="text-center">No reviews yet.</p>
      ) : (
        <div className="flex flex-wrap justify-center space-x-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex items-center p-4 border border-gray-300 rounded-lg mb-4 w-1/4" // Adjust width as needed
            >
              <img
                src={staticProfilePic} // Use the static profile picture
                alt="Profile"
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">{review.userId}</span>
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
