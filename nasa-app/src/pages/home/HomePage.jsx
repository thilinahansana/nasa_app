import React from "react";
import Homeimg from "../../assets/Style7.svg";
import { Button, Image } from "@nextui-org/react";
import { FaArrowDown } from "react-icons/fa6";
import "./HomePage.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="home-page h-screen flex flex-col lg:flex-row justify-center items-center">
      <div className="w-full flex justify-center lg:justify-center items-center">
        <div className="text-center lg:text-right">
          <div className="justify-center lg:justify-center items-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold md:text-6xl text-center">
              Embark on an
              <span className="bg-gradient-to-r from-green-400 to-cyan-500 text-transparent bg-clip-text">
                {" "}
                Infinite{" "}
              </span>
              Journey
            </h1>
          </div>
          <div className="flex md:flex-row flex-col justify-center">
            <div className="justify-center items-center">
              <div className="mt-8 lg:mt-40 lg:mr-2 lg:justify-start md:mt-32">
                <p className="text-white text-2xl lg:text-3xl font-semibold">
                  Discover the Wonders of the <br />{" "}
                  <span className="bg-gradient-to-r from-green-500 to-cyan-300 text-transparent bg-clip-text text-xl lg:text-5xl lg:justify-start">
                    Universe
                  </span>
                </p>
              </div>
              <Button
                color="primary"
                href=""
                variant="bordered"
                endContent={<FaArrowDown />}
                className="mt-4 lg:mr-2 px-6 lg:px-10 py-3 lg:py-4 border-2 border-green-400 text-white wave-animation"
              >
                <Link to="/apod">Get Started</Link>
              </Button>
            </div>
            <div className="lg:w-1/2 flex justify-center items-center">
              <Image
                isBlurred
                width={700}
                src={Homeimg}
                alt="NextUI Album Cover"
                className="rounded-3xl cover-img w-64 lg:w-full md:w-96 mr-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
