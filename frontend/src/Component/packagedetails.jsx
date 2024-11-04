// PackageDetails.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar";

function PackageDetails() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          "https://tripplanner-1.onrender.com/packages"
        );
        setPackages(response.data);
      } catch (error) {
        setError("Failed to fetch package data");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) return <p>Loading package details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-5">
        <h1 className="text-3xl font-bold text-center mb-5">Package Details</h1>
        {packages.length === 0 ? (
          <p className="text-center text-gray-600">No package records found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg._id} className="p-6 bg-white shadow rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {pkg.title}
                </h2>
                <p className="text-gray-600">
                  <strong>Price:</strong> ₹{pkg.price}
                </p>
                <p className="text-gray-600">
                  <strong>Duration:</strong> {pkg.duration}
                </p>
                <p className="text-gray-600">
                  <strong>Features:</strong> {pkg.features.join(", ")}
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong> {pkg.place} (Lat:{" "}
                  {pkg.location.latitude}, Lon: {pkg.location.longitude})
                </p>
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-full h-40 object-cover mt-2 rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PackageDetails;
