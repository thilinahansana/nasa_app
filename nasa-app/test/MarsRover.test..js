import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import MarsRoverPage from "../MarsRoverPage"; // Adjust the path according to your file structure

const mock = new MockAdapter(axios);

const mockPhotos = [
  {
    img_src:
      "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/03102/opgs/edr/fcam/FRB_644162937EDR_F0802550FHAZ00323M_.JPG",
    id: 1,
  },
  {
    img_src:
      "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/03102/opgs/edr/fcam/FLB_644162937EDR_F0802550FHAZ00323M_.JPG",
    id: 2,
  },
];

describe("MarsRoverPage Component", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("displays loading spinner initially", () => {
    render(<MarsRoverPage />);
    expect(screen.getByLabelText("Loading Spinner")).toBeInTheDocument();
  });

  it("fetches and displays Mars Rover photos", async () => {
    mock
      .onGet(
        "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=dyicH92gpL25xYNO44a7BwIm7Zphv4ZGgpT70HhZ"
      )
      .reply(200, { latest_photos: mockPhotos });

    render(<MarsRoverPage />);

    await waitFor(() => {
      expect(
        screen.queryByLabelText("Loading Spinner")
      ).not.toBeInTheDocument();
    });

    expect(screen.getByAltText("")).toBeInTheDocument();
    const images = screen.getAllByAltText("");
    expect(images.length).toBe(mockPhotos.length);
    expect(images[0]).toHaveAttribute("src", mockPhotos[0].img_src);
  });

  it("opens the lightbox when a photo is clicked", async () => {
    mock
      .onGet(
        "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=dyicH92gpL25xYNO44a7BwIm7Zphv4ZGgpT70HhZ"
      )
      .reply(200, { latest_photos: mockPhotos });

    render(<MarsRoverPage />);

    await waitFor(() => {
      expect(
        screen.queryByLabelText("Loading Spinner")
      ).not.toBeInTheDocument();
    });

    const image = screen.getAllByAltText("")[0];
    fireEvent.click(image);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("displays error message on API failure", async () => {
    mock
      .onGet(
        "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=dyicH92gpL25xYNO44a7BwIm7Zphv4ZGgpT70HhZ"
      )
      .reply(500);

    render(<MarsRoverPage />);

    await waitFor(() => {
      expect(
        screen.queryByLabelText("Loading Spinner")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByAltText("")).not.toBeInTheDocument();
  });
});
