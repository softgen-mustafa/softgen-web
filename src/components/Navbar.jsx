"use client";

import { appleImg, feviconImg } from "../utils";
import { navLists, servicesDropdown } from "../constants";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Divider, Drawer, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown

  const handleLogin = () => {
    const token = Cookies.get("token") ?? null;
    if (token !== null && token.length > 0) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  const handleRegistration = () => {
    const token = Cookies.get("token") ?? null;
    if (token !== null && token.length > 0) {
      router.push("/dashboard");
    } else {
      router.push("/auth/register");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdowns = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdowns = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="w-full py-0 sm:py-2 sm:px-5 px-1 flex flex-row justify-between items-center bg-transparent transition-shadow duration-300 -mt-16 md:-mt-24">
      <div className="relative flex flex-row w-full items-center justify-between">
        {/* Logo Section */}
        <div className="flex-shrink-0 mt-2 md:mt-0">
          <Image
            src={appleImg}
            alt="Apple"
            width={290}
            height={50}
            className="object-contain w-[60vw] md:w-[300px]"
          />
        </div>

        {/* Scrollable Navigation Links */}
        <div
          className={`fixed left-1/2 transform -translate-x-1/2 w-auto overflow-x-auto top-0 z-50 transition-shadow duration-300 bg-white mt-5 px-5 py-4 rounded-full ${
            isScrolled ? "shadow-xl backdrop-blur-lg bg-opacity-80" : ""
          } hidden md:flex`}
        >
          <nav className="flex justify-center space-x-20">
            {navLists.map((nav) => (
              <div key={nav.label} className="relative">
                {nav.label === "Services" ? (
                  <>
                    <div
                      onClick={toggleDropdown}
                      aria-haspopup="true"
                      aria-expanded={Boolean(anchorEl)}
                      className="cursor-pointer text-black hover:text-gray-500 font-medium transition-colors duration-200 text-xl flex items-center"
                    >
                      <span className="hidden md:inline">{nav.label}</span>
                      <span className="inline md:hidden">{nav.icon}</span>
                      <KeyboardArrowDownIcon className="ml-1" />
                    </div>

                    {/* Dropdown menu */}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleCloseDropdown}
                      sx={{
                        marginTop: 2.5,
                        "& .MuiPaper-root": {
                          borderRadius: "1.95rem",
                        },
                      }}
                    >
                      {servicesDropdown.map(({ title, description, icon }) => (
                        <MenuItem
                          key={title}
                          onClick={handleCloseDropdown}
                          className="flex items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200 px-6 py-4 rounded-md text-black font-medium"
                        >
                          <div className="flex items-center justify-center flex-shrink-0 mr-4 text-6xl text-gray-600 shadow-xl px-2 py-2 rounded-2xl border border-transparent hover:text-sky-500 hover:bg-gray-100 hover:shadow-2xl hover:border-sky-500">
                            {icon}
                          </div>
                          <div className="flex flex-col justify-center">
                            <span className="font-semibold text-lg">{title}</span>
                            <span className="text-sm text-gray-500 mt-1">{description}</span>
                          </div>
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <div className="cursor-pointer text-black hover:text-gray-500 font-medium transition-colors duration-200 text-xl flex items-center">
                    <span className="hidden md:inline">{nav.label}</span>
                    <span className="inline md:hidden">{nav.icon}</span>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Buttons for Login and Registration */}
        <div className="hidden sm:flex items-center gap-4 -mt-10">
          <Button
            onClick={handleLogin}
            className="text-black text-xl sm:px-6 sm:py-2 px-2 py-1 transition-shadow flex items-center capitalize"
            endIcon={<ArrowForwardIcon />}
          >
            Login
          </Button>
          <Button
            onClick={handleRegistration}
            className="text-white text-xl sm:px-6 sm:py-2 px-3 py-3 transition-all duration-300 flex items-center capitalize rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 hover:shadow-lg hover:from-sky-500 hover:to-sky-600"
            endIcon={<ArrowForwardIcon />}
          >
            Register
          </Button>
        </div>
      </div>

      {/* Menu Button (for smaller screens) */}
      <div className="sm:hidden flex items-center">
        <button onClick={toggleMenu} className="text-black p-2 -mt-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Drawer for small screens */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={toggleMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: "290px",
            padding: "15px",
            backgroundColor: "white",
          },
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(5px)",
          },
        }}
      >
        <div className="flex flex-col justify-end items-end gap-1 mt-2">
          {/* Close Icon */}
          <div className="flex justify-between items-center w-full gap-7">
          <div className="flex-shrink-0 ">
          <Image
            src={feviconImg}
            alt="Apple"
            width={50}
            height={50}
            className="object-contain w-[20vw] "
          />
        </div>
            <button onClick={toggleMenu} className="text-gray-500 flex justify-between">
              <CloseIcon className="bg-black text-white text-3xl p-1 rounded-full" />
            </button>
          </div>

          {/* Navigation links for mobile view */}
          {navLists.map((nav) => (
            <div key={nav.label} className="flex flex-col items-start cursor-pointer w-full mt-8">
              {nav.label === "Services" ? (
                <div className="relative w-full">
                  <div
                    onClick={toggleDropdowns}
                    className="text-black hover:text-gray-500 font-medium transition-colors gap-6 duration-200 text-xl flex items-center justify-start w-full"
                  >
                    
                    {nav.icon} {/* Show icon only on mobile */}
                    {nav.label}

                    <span className="justify-end ml-20 -mt-1" >{isDropdownOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</span>
                  </div>

                  {isDropdownOpen && (
                    <div className="flex flex-col mt-2 w-full">
                      {servicesDropdown.map(({ title, description, icon }) => (
                        <div
                          key={title}
                          onClick={handleCloseDropdowns}
                          className="flex items-center p-2 cursor-pointer mt-3 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-center flex-shrink-0 mr-4 text-6xl text-gray-600 shadow-xl px-2 py-2 rounded-2xl border border-transparent hover:text-sky-500 hover:bg-gray-100 hover:shadow-2xl hover:border-sky-500">
                            {icon}
                          </div>
                          <div className="flex flex-col justify-center">
                            <span className="font-semibold text-lg">{title}</span>
                            <span className="text-sm text-gray-500 mt-1">{description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-black hover:text-gray-500 font-medium  transition-colors duration-200 text-xl">
                  <span className="mr-6" >{nav.icon}</span> {/* Show icon only on mobile */}
                  {nav.label}
                </div>
              )}
            </div>
          ))}
          <Divider sx={{ width: "100%", margin: "25px 0", marginTop: "50%" }} />

          {/* Login and Registration buttons in mobile view */}
          <div className="flex flex-col justify-center gap-3 w-full">
            <Button
              onClick={handleLogin}
              className="text-black text-base border px-3 py-2 transition-shadow flex items-center capitalize"
              endIcon={<ArrowForwardIcon />}
            >
              Login
            </Button>
            <Button
              onClick={handleRegistration}
              className="text-white text-base px-3 py-3 transition-all duration-300 flex items-center capitalize rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 hover:shadow-lg hover:from-sky-500 hover:to-sky-600"
              endIcon={<ArrowForwardIcon />}
            >
              Register
            </Button>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
