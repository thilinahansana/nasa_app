import React, { useState } from "react";
import googleicon from "../../assets/google.svg";
import facebookicon from "../../assets/facebook.svg";
import appleicon from "../../assets/apple.svg";
import pageimage from "../../assets/LoginCover.svg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";
import { SiNasa } from "react-icons/si";
import { IoEarthSharp } from "react-icons/io5";
import "./userLogin.css";

function UserLogin({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "/api/v1/users/login",
        { email, password }
      );
      console.log("Login successful:", response);
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/home");
      setEmail("");
      setPassword("");
      setError(null);
    } catch (error) {
      console.error("Login failed:", error.response.data);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-black  h-screen overflow-hidden ">
      {/* Left Section */}
      <div className="flex-1 relative">
        <div className="absolute top-0 left-10 flex justify-center items-center z-50">
          <IoEarthSharp className="text-6xl opacity-70" />
          <SiNasa className="w-40 h-30 z-0 opacity-70 text-9xl" />
        </div>
        <img src={pageimage} alt="" className="rotate-image justify-center" />
      </div>

      <div className="flex-1 flex justify-center items-center  text-white">
        <div className="w-96 p-6 z-10 border-2 border-slate-400 rounded-2xl m-4">
          <h2 className="text-4xl font-bold mb-4 opacity-70">Sign in</h2>
          {/* Form */}
          <div className="w-full mb-6">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="w-full mb-6">
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Button
            color="default"
            variant="bordered"
            className="w-full mb-8"
            onClick={handleLogin}
          >
            Login
          </Button>
          <div className="flex flex-col justify-center items-center mb-4">
            <Link to="/forgot-password">Forget Password?</Link>
            <div className="text-white">Or sign in with:</div>
          </div>
          <div className="flex justify-center">
            <img src={googleicon} alt="Google" className="w-6 h-6 mr-2" />
            <img src={facebookicon} alt="Facebook" className="w-6 h-6 mr-2" />
            <img src={appleicon} alt="Apple" className="w-6 h-6" />
          </div>
          <div className="mt-4 flex justify-center">
            <p className="text-white">
              No account?{" "}
              <Link to="/register" className="text-white">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
