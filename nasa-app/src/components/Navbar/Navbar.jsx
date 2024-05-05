import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { FaEarthAsia } from "react-icons/fa6";
import { SiNasa } from "react-icons/si";
import { useNavigate } from "react-router-dom";

export default function NavBar({ isLoggedIn, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();
  const menuItems = ["Home", "APOD", "Mars Rover", "Epic", "Images"];

  const handleMenuItemClick = (item) => {
    setActiveItem(item);
    setIsMenuOpen(false);
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <Link href="/home" className="text-white">
          <NavbarBrand>
            <FaEarthAsia className="text-green-300 text-3xl" />
            <SiNasa className="ml-2 text-6xl" />
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link
              color="foreground"
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => handleMenuItemClick(item)}
              className={`${
                activeItem === item
                  ? "font-semibold bg-gradient-to-r from-green-400 to-cyan-200 text-transparent bg-clip-text"
                  : ""
              }`}
            >
              {item}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {!isLoggedIn && (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
        {isLoggedIn && (
          <NavbarItem>
            <Button
              as={Link}
              className="bg-gradient-to-r from-green-400 to-cyan-200 text-transparent bg-clip-text font-semibold border-2 border-slate-400"
              href="/"
              variant="flat"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu className="bg-black">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full font-semibold text-xl text-white"
              href="/apod"
              onClick={() => handleMenuItemClick(item)}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
