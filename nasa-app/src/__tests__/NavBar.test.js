import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../NavBar";

describe("NavBar Component", () => {
  const mockHandleLogout = jest.fn();

  const renderNavBar = (isLoggedIn) => {
    render(
      <MemoryRouter>
        <NavBar isLoggedIn={isLoggedIn} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders the NavBar with all menu items", () => {
    renderNavBar(false);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("APOD")).toBeInTheDocument();
    expect(screen.getByText("Mars Rover")).toBeInTheDocument();
    expect(screen.getByText("Epic")).toBeInTheDocument();
    expect(screen.getByText("Images")).toBeInTheDocument();
  });

  it("displays login and sign up options when not logged in", () => {
    renderNavBar(false);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("displays sign out option when logged in", () => {
    renderNavBar(true);

    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("calls handleLogout when sign out is clicked", () => {
    renderNavBar(true);

    fireEvent.click(screen.getByText("Sign Out"));

    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });

  it("sets active menu item on click and updates localStorage", () => {
    renderNavBar(false);

    const apodLink = screen.getByText("APOD");
    fireEvent.click(apodLink);

    expect(apodLink).toHaveClass(
      "font-semibold bg-gradient-to-r from-green-400 to-cyan-200 text-transparent bg-clip-text"
    );
    expect(localStorage.getItem("Homevalue")).toBe("APOD");
  });

  it("sets the initial active menu item based on localStorage", () => {
    localStorage.setItem("Homevalue", "Mars Rover");
    renderNavBar(false);

    const marsRoverLink = screen.getByText("Mars Rover");
    expect(marsRoverLink).toHaveClass(
      "font-semibold bg-gradient-to-r from-green-400 to-cyan-200 text-transparent bg-clip-text"
    );
  });

  it("toggles the menu on small screens", () => {
    renderNavBar(false);

    const menuToggle = screen.getByLabelText("Open menu");
    fireEvent.click(menuToggle);

    expect(menuToggle).toHaveAttribute("aria-label", "Close menu");
  });
});
