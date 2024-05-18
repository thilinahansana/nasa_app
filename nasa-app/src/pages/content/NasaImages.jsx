import React, { useState, useEffect } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { css } from "@emotion/react";
import { PhotoAlbum } from "react-photo-album";
import { Image } from "@nextui-org/react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const API_KEY = "YOUR_NASA_API_KEY";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const NASAImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `https://images-api.nasa.gov/search?q=galaxy&media_type=image`
        );
        setImages(response.data.collection.items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NASA images:", error);
      }
    };

    fetchImages();
  }, []);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <div className="relative bg-black min-h-screen p-4">
      {/* Background image */}
      <div className="absolute w-full">
        <img
          src="https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_1280.jpg"
          alt="Background Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay to darken the background */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-70"></div> */}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-4">
        <h1 className="text-4xl lg:text-6xl md:text-5xl font-bold mb-4 text-center text-white">
          <span className="bg-gradient-to-r from-green-400 to-cyan-500 text-transparent bg-clip-text">
            NASA
          </span>{" "}
          Image and Video Library
        </h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <HashLoader
              color={color}
              loading={loading}
              css={override}
              size={50}
              aria-label="Loading Spinner"
            />
          </div>
        ) : (
          <>
            <PhotoAlbum
              layout="columns"
              photos={images.map((image, index) => ({
                src: image.links[0].href,
                width: 300, // Adjust width as needed
                height: 300, // Adjust height as needed
                key: index,
              }))}
              renderPhoto={({ photo, index }) => (
                <div
                  className="rounded-lg overflow-hidden shadow-lg w-auto h-auto"
                  key={index}
                >
                  <Image
                    isBlurred
                    isZoomed
                    src={photo.src}
                    width={300}
                    height={300}
                    alt=""
                    className="w-full h-auto m-2 cursor-pointer"
                    onClick={() => openModal(index)}
                  />
                </div>
              )}
            />
            <Lightbox
              open={open}
              close={closeModal}
              slides={images.map((image) => ({ src: image.links[0].href }))}
              index={currentImageIndex}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NASAImages;
