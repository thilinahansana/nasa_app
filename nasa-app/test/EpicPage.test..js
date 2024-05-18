import React, { useState, useEffect } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { HashLoader } from "react-spinners";
import { Image, Input } from "@nextui-org/react";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const EpicPage = () => {
  const [images, setImages] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      let url = "https://api.nasa.gov/EPIC/api/natural/images?api_key=DEMO_KEY";
      if (selectedDate) {
        url = `https://api.nasa.gov/EPIC/api/natural/date/${selectedDate}?api_key=DEMO_KEY`;
      }

      try {
        const response = await axios.get(url);
        setImages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching EPIC images:", error);
      }
    };

    fetchImages();
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const renderImageGallery = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <HashLoader
            color={color}
            loading={loading}
            css={override}
            size={50}
            aria-label="Loading Spinner"
          />
        </div>
      );
    }

    if (!images || images.length === 0) {
      return (
        <p className="text-center text-white">
          No images available for the selected date.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {images.map((image) => (
          <div
            key={image.identifier}
            className="p-2 bg-black shadow-lg rounded-lg border border-gray-800"
          >
            <Image
              isZoomed
              isBlurred
              src={`https://api.nasa.gov/EPIC/archive/natural/${image.date.slice(
                0,
                4
              )}/${image.date.slice(5, 7)}/${image.date.slice(8, 10)}/png/${
                image.image
              }.png?api_key=DEMO_KEY`}
              alt={`EPIC Image ${image.date}`}
              className="w-full h-auto rounded-lg"
            />
            <p className="text-slate-200 mt-2">
              <span className="font-semibold text-white">Date: </span>{" "}
              {image.date}
            </p>
            <p className="text-slate-200">
              <span className="font-semibold text-white">Caption: </span>{" "}
              {image.caption}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative bg-black min-h-screen p-4">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_1280.jpg"
          alt="Background Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-6xl md:text-5xl font-bold mb-8 text-center text-white">
          <span className="bg-gradient-to-r from-green-400 to-cyan-500 text-transparent bg-clip-text">
            EPIC
          </span>{" "}
          Images Gallery
        </h1>

        <div className="mb-6 flex justify-center items-center md:justify-start lg:justify-start">
          <Input
            type="date"
            id="datePicker"
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-44 text-white"
          />
        </div>

        {renderImageGallery()}
      </div>
    </div>
  );
};

export default EpicPage;
