import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const placeImages = {
  ooty: "https://tempotravellerrentindelhi.wordpress.com/wp-content/uploads/2020/08/1585825644_ooty.jpg",
  coimbatore:
    "https://www.purvaland.com/wp-content/uploads/2024/07/Coimbatore1920X704px-1-scaled.webp",
  dindigul: "https://wikitravel.org/upload/shared//5/5b/Dindigul_Banner.jpg",
  kodaikanal:
    "https://www.clubmahindra.com/blog/media/section_images/banner1920-5c13a545b62beb9.webp",
  madurai:
    "https://upload.wikimedia.org/wikipedia/commons/0/04/Dawn_Madurai.jpg",
  tirunelveli:
    "https://jumborealty.co.in/wp-content/uploads/2023/12/thirunelveli-town.jpg",
};

const Package = () => {
  const { id } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          `https://tripplanner-2ccq.onrender.com/api/packages?place=${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching packages: {error}</div>;
  if (!packages || packages.length === 0)
    return <div>No packages found for {id}.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Packages in {id}</h1>

      {placeImages[id.toLowerCase()] && (
        <img
          src={placeImages[id.toLowerCase()]}
          alt={`${id} view`}
          className="w-full h-48 object-cover rounded-lg my-4"
        />
      )}

      <div className="flex flex-wrap -mx-2">
        {packages.map((packageData, index) => {
          const { title, price, duration, imageUrl, features } = packageData;
          return (
            <div
              key={index}
              className="w-full sm:w-1/2 lg:w-1/3 p-2"
            >
              <div className="border rounded-lg p-4 bg-white shadow-md">
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg">₹{price} per person ({duration})</h3>
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-48 object-cover rounded-lg my-2"
                />
                <div className="my-2">
                  <h4 className="font-semibold">Features:</h4>
                  <ul className="list-disc list-inside">
                    {features && features.length > 0 ? (
                      features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))
                    ) : (
                      <li>No features available.</li>
                    )}
                  </ul>
                </div>
                <Link
                  to="/form"
                  state={{
                    title,
                    price,
                    duration,
                    features,
                    imageUrl,
                  }}
                  className="bg-blue-600 text-white py-2 px-4 rounded mt-4 inline-block"
                >
                  Book this package
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-bold mb-2">Explore {id}</h2>
        <iframe
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${id}&t=&z=12&ie=UTF8&iwloc=B&output=embed`}
          style={{ border: "none" }}
          title="Google Map"
        ></iframe>
      </div>
    </div>
  );
};

export default Package;
