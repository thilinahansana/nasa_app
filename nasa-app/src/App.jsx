import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import UserLogin from "./pages/auth/userLogin";

import ApodPage from "./pages/content/ApodPage";
import EpicPage from "./pages/content/EpicPage";
import MarsRoverPage from "./pages/content/MarsRover";

import UserRegister from "./pages/auth/userRegister";
import NavBar from "./components/Navbar/Navbar";
import NASAImages from "./pages/content/NasaImages";
import HomePage from "./pages/home/HomePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true"); // Set isLoggedIn to true in localStorage
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false"); // Set isLoggedIn to false in localStorage
  };

  // Effect to check initial login state on component mount
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(storedIsLoggedIn);
  }, []);

  console.log("isLoggedIn:", isLoggedIn);
  return (
    <Router>
      <div>
        {isLoggedIn && (
          <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        )}

        <Routes>
          {/* Public Routes */}
          {!isLoggedIn && (
            <>
              <Route
                path="/"
                element={<UserLogin setIsLoggedIn={setIsLoggedIn} />}
              />
              <Route path="/register" element={<UserRegister />} />
            </>
          )}

          {/* Private Routes - Protected with isLoggedIn */}
          {isLoggedIn && (
            <>
              <Route path="/home" element={<HomePage />} />
              <Route path="/apod" element={<ApodPage />} />
              <Route path="/epic" element={<EpicPage />} />
              <Route path="/mars-rover" element={<MarsRoverPage />} />
              <Route path="/images" element={<NASAImages />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
