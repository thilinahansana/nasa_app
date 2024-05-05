import React, { useState, useEffect } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { css } from "@emotion/react";
import { PhotoAlbum } from "react-photo-album";
import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `https://images-api.nasa.gov/search?q=galaxy&media_type=image`
        );
        setImages(response.data.collection.items);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching NASA images:", error);
      }
    };

    fetchImages();
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
    <div className="container mx-auto p-4 h-full">
      <h1 className="text-4xl lg:text-6xl md:text-5xl font-bold mb-4 text-center">
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
            className=""
          />
        </div>
      ) : (
        <PhotoAlbum
          layout="columns"
          photos={images.map((image) => ({
            src: image.links[0].href,
            width: 300, // Adjust width as needed
            height: 300, // Adjust height as needed
          }))}
          renderPhoto={({ photo }) => (
            <div className="rounded-lg overflow-hidden shadow-lg w-auto h-auto">
              <Image
                isBlurred
                isZoomed
                src={photo.src}
                width={300}
                height={300}
                alt=""
                className="w-full h-auto m-2"
                onClick={() => openModal(photo.src)}
              />
            </div>
          )}
        />
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
  );
};

export default NASAImages;
