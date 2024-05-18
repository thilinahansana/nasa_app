import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import ApodPage from "../ApodPage";

const mock = new MockAdapter(axios);
const mockApodData = {
  url: "https://apod.nasa.gov/apod/image/2201/NGC6914_Hubble_960.jpg",
  title: "A Cosmic Rose: NGC 6914",
  explanation: "Explanation of the cosmic rose...",
};

describe("ApodPage Component", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("displays loading spinner initially", () => {
    render(<ApodPage />);
    expect(screen.getByLabelText("Loading Spinner")).toBeInTheDocument();
  });

  it("fetches and displays APOD data", async () => {
    mock
      .onGet(
        "https://api.nasa.gov/planetary/apod?api_key=dyicH92gpL25xYNO44a7BwIm7Zphv4ZGgpT70HhZ"
      )
      .reply(200, mockApodData);

    render(<ApodPage />);

    await waitFor(() => {
      expect(
        screen.queryByLabelText("Loading Spinner")
      ).not.toBeInTheDocument();
    });

    expect(screen.getByAltText(mockApodData.title)).toBeInTheDocument();
    expect(screen.getByText(mockApodData.title)).toBeInTheDocument();
    expect(screen.getByText(mockApodData.explanation)).toBeInTheDocument();
  });

  it("displays error message on API failure", async () => {
    mock
      .onGet(
        "https://api.nasa.gov/planetary/apod?api_key=dyicH92gpL25xYNO44a7BwIm7Zphv4ZGgpT70HhZ"
      )
      .reply(500);

    render(<ApodPage />);

    await waitFor(() => {
      expect(
        screen.queryByLabelText("Loading Spinner")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByAltText(mockApodData.title)).not.toBeInTheDocument();
    expect(screen.queryByText(mockApodData.title)).not.toBeInTheDocument();
    expect(
      screen.queryByText(mockApodData.explanation)
    ).not.toBeInTheDocument();
  });
});
