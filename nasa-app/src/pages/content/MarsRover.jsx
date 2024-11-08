import React, { useState, useEffect } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { css } from "@emotion/react";
import { Image } from "@nextui-org/react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const API_KEY = "dyicH92gpL25xYNO44a7BwIm7Zphv4ZGgpT70HhZ";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const MarsRoverPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${API_KEY}`
        );
        const latestPhotos = response.data.latest_photos.map((photo) => ({
          src: photo.img_src,
          width: 400,
          height: 400,
        }));
        console.log("Latest Photos:", latestPhotos);
        setPhotos(latestPhotos);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Mars Rover photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  const openModal = (index) => {
    console.log("Opening modal with index:", index);
    setCurrentImageIndex(index);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <div className="relative min-h-screen p-8">
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
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-6xl md:text-5xl font-bold mb-4 text-white text-center">
          Latest Photos from{" "}
          <span className="bg-gradient-to-r from-green-400 to-cyan-500 text-transparent bg-clip-text">
            Curiosity
          </span>{" "}
          Rover
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <HashLoader
              color={"#ffffff"}
              loading={loading}
              css={override}
              size={50}
              aria-label="Loading Spinner"
            />
          </div>
        ) : (
          <div className="mb-8 rounded-2xl">
            <PhotoAlbum
              layout="columns"
              photos={photos}
              renderPhoto={({ photo, index }) => (
                <Image
                  isZoomed
                  isBlurred
                  src={photo.src}
                  alt=""
                  width={300}
                  height={300}
                  className="m-2 cursor-pointer"
                  onClick={() => openModal(index)} // Pass the correct index to openModal
                />
              )}
            />
          </div>
        )}

        <Lightbox
          open={open}
          close={closeModal}
          slides={photos.map((photo) => ({ src: photo.src }))}
          index={currentImageIndex} // Set the current index
        />
      </div>
    </div>
  );
};

export default MarsRoverPage;
