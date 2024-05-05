import React, { useState, useEffect } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { css } from "@emotion/react";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import PhotoAlbum from "react-photo-album";

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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    onOpen();
  };

  const closeModal = () => {
    onClose();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
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
                  className="m-2"
                  onClick={() => openModal(photo.src)} // Make sure index is passed here
                />
              )}
            />
          </div>
        )}

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          fullWidth
          padding="0"
          className="overflow-hidden h-auto w-full"
        >
          <ModalContent>
            <ModalBody className="bg-slate-400">
              <Image
                isBlurred
                isZoomed
                src={currentImageIndex}
                alt=""
                className="w-full h-full object-contain justify-center items-center"
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default MarsRoverPage;
