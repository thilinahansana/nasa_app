import React, { useState } from "react";
import pageimage from "../../assets/SignUpCover.svg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";
import { IoEarthSharp } from "react-icons/io5";
import { SiNasa } from "react-icons/si";
import "./userRegister.css";

const UserRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setConfirmPassword] = useState("");
  const navigation = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSignup = async () => {
    if (password !== passwordConfirm) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "https://nasa-app-server.onrender.com/api/v1/users/signup",
        {
          email,
          password,
          passwordConfirm,
        }
      );
      console.log(response);
      navigation("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Left Section */}
      <div className="flex-1 relative">
        <div className="absolute top-0 left-10 flex justify-center items-center z-50">
          <IoEarthSharp className="text-6xl opacity-70" />
          <SiNasa className="w-40 h-30 z-0 opacity-70 text-9xl" />
        </div>
        <img src={pageimage} alt="" className="rotate-image" />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex justify-center items-center bg-gradient-to-br text-white">
        <div className="w-96 p-6 z-10 border-2 border-slate-400 rounded-2xl m-4">
          <h2 className="text-4xl font-bold mb-4 opacity-70">Sign up</h2>
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
          <div className="w-full mb-6">
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={passwordConfirm}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <Button
            color="default"
            variant="bordered"
            className="w-full mb-8"
            onClick={handleSignup}
          >
            Sign Up
          </Button>
          <div className="flex justify-between items-center mb-4">
            <p className="text-white">
              Already have an account?{" "}
              <Link to="/" className="text-white opacity-70 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
