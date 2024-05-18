import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import ApodPage from "../pages/content/ApodPage";

// Mock the API response
const mock = new MockAdapter(axios);
const mockApodData = {
  date: "2023-05-17",
  explanation: "This is a test explanation of the APOD.",
  media_type: "image",
  title: "Test APOD",
  url: "https://apod.nasa.gov/apod/image/1905/M87BlackHole_Hubble_960.jpg",
};

mock
  .onGet(
    "https://api.nasa.gov/planetary/apod?api_key=dyicH92gpL25xYNO44a7BwIm7Zphv4ZGgpT70HhZ"
  )
  .reply(200, mockApodData);

test("renders loading spinner initially", () => {
  render(<ApodPage />);
  expect(screen.getByLabelText(/loading spinner/i)).toBeInTheDocument();
});

test("renders APOD data after fetch", async () => {
  render(<ApodPage />);

  await waitFor(() =>
    expect(screen.getByText(mockApodData.title)).toBeInTheDocument()
  );

  expect(screen.getByText(mockApodData.title)).toBeInTheDocument();
  expect(screen.getByText(mockApodData.explanation)).toBeInTheDocument();
  const image = screen.getByAltText(mockApodData.title);
  expect(image).toHaveAttribute("src", mockApodData.url);
});
