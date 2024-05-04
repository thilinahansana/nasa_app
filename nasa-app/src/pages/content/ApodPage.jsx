import React, { useState, useEffect } from "react";
import axios from "axios";

import { HashLoader } from "react-spinners";
import { css } from "@emotion/react";
import { Image } from "@nextui-org/react";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default function ApodPage() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    const fetchApodData = async () => {
      try {
        const response = await axios.get(
          "https://api.nasa.gov/planetary/apod?api_key=dyicH92gpL25xYNO44a7BwIm7Zphv4ZGgpT70HhZ"
        );
        setApodData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching APOD data:", error);
      }
    };

    fetchApodData();
  }, []);

  return (
    <div className="min-h-screen p-8 dark:bg-black">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-center">
          Astronomy{" "}
          <span className="bg-gradient-to-r from-green-400 to-cyan-500 text-transparent bg-clip-text">
            Picture
          </span>{" "}
          of the Day
        </h1>
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <HashLoader
              color={color}
              loading={loading}
              css={override}
              size={50}
              aria-label="Loading Spinner"
            />
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-col lg:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-20 p-6">
              <Image
                isBlurred
                isZoomed
                width={700}
                src={apodData.url}
                alt={apodData.title}
                className="w-full md:w-auto m-5"
              />
              <div className="w-full md:w-96">
                <p className="font-medium dark:text-white text-2xl mb-2">
                  {apodData.title}
                </p>
                <p className="text-gray-700 dark:text-slate-300 text-justify">
                  {apodData.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
