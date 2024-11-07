import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("authToken")
  );
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [username, setUsername] = useState(localStorage.getItem("name") || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
      setUsername(localStorage.getItem("username") || "");
      setEmail(localStorage.getItem("email") || "");
      setUsername(localStorage.getItem("name") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      setIsLoggedIn(false);
      setUsername("");
      setEmail("");
      navigate("/");
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://tripplanner-2ccq.onrender.com/api/places?query=${value}`
      );
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  const handlePlaceSelect = (place) => {
    setSearchQuery(place.name);
    setSearchResults([]);
    navigate(`/${place.name}`);
  };

  const handleSearchSubmit = () => {
    if (searchQuery) {
      navigate(`/packages/${searchQuery}`);
      setSearchQuery("");
    }
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  // Voice search handler
  const handleSpeechSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;  
    const allowedLocations = ["Coimbatore", "Ooty", "Kodaikanal", "Dindigul", "Tirunelveli", "Madurai"];
    const recognition = new SpeechRecognition();
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const detectedLocation = allowedLocations.find((location) =>
        transcript.toLowerCase().includes(location.toLowerCase())
      );
  
      if (detectedLocation) {
        setSearchQuery(detectedLocation);
        handlePlaceSelect({ name: detectedLocation }); // Selects the place based on detected location
      } else {
        setSearchQuery(transcript);
        handleSearchChange({ target: { value: transcript } }); // Regular search if location not recognized
      }
    };
  
    recognition.start();
  };
  

  return (
    <div>
      <nav className="flex justify-between py-3 content-center bg-slate-50 drop-shadow w-full">
        <div className="flex items-center">
          <img
            src="https://img.freepik.com/free-vector/detailed-travel-logo_23-2148616611.jpg"
            alt=""
            className="h-14 w-14 rounded-full ml-16"
          />
          <h1 className="ml-4 text-3xl font-bold">Travigo</h1>
        </div>
        <div className="flex items-center">
          <ul className="flex gap-5 font-medium mt-3">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/api/booked">Booked</Link>
            </li>
          </ul>

          {location.pathname !== "/form" && (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for a place"
                className="border border-gray-300 rounded p-2 ml-5"
              />
              <button
                onClick={handleSearchSubmit}
                className="ml-2 bg-teal-600 text-white rounded p-2"
                disabled={!searchQuery}
              >
                Search
              </button>
              <button
            type="button"
            onClick={handleSpeechSearch}
            className="ml-2 p-2"
            title="Voice Search"
          >
            <span className="material-symbols-outlined">mic</span>
          </button>
            </>
          )}
        </div>

        <div>
          <ul className="flex gap-5 mr-14 font-medium">
            {isLoggedIn ? (
              <>
                <h5>{username}</h5>
                <li className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500 mt-2"
                    title="Account options"
                  ></button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="block px-4 py-2 text-gray-600">
                        {email} {/* Display email here */}
                      </div>
                      <Link
                        to="/api/booked"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">
                    <button className="mt-2">Login</button>
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <button className="bg-teal-600 p-2 rounded-2xl">
                      Sign up
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {searchResults.length > 0 && (
        <div className="bg-white shadow-md mt-2 rounded-md">
          <ul>
            {searchResults.map((place) => (
              <li
                key={place?._id}
                className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => handlePlaceSelect(place)}
              >
                {place?.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
