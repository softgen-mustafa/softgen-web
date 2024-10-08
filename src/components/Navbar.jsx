"use client";

import { appleImg } from "../utils";
import { navLists } from "../constants";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Import useState for managing button visibility

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu visibility

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
    setIsMenuOpen((prev) => !prev); // Toggle menu visibility
  };

  return (
    <header className="w-full py-4 sm:py-5 sm:px-10 px-3 flex justify-between items-center bg-white shadow-lg">
      <nav className="flex w-full items-center justify-between screen-max-width">
        {/* Logo Image */}
        <div className="flex-shrink-0">
          <Image src={appleImg} alt="Apple" width={70} height={40} className="object-contain" />
        </div>

        {/* Centered Navigation Links (hidden on small screens) */}
        <div className="hidden sm:flex flex-1 justify-center gap-6">
          {navLists.map((nav) => (
            <div
              key={nav}
              className="cursor-pointer text-black hover:text-gray-500 transition-colors duration-200 text-sm"
            >
              {nav}
            </div>
          ))}
          <div className="hidden sm:flex items-center gap-4 sm:ml-auto">
            <button
              onClick={handleLogin}
              className="btn text-sm sm:text-base sm:px-6 sm:py-3 px-3 py-2 hover:shadow-md rounded-md transition-shadow"
            >
              Login
            </button>
            <button
              onClick={handleRegistration}
              className="btn text-sm sm:text-base sm:px-6 sm:py-3 px-3 py-2 hover:shadow-md rounded-md transition-shadow"
            >
              Register
            </button>
          </div>
        </div>

        {/* Menu Button with SVG (shown on small screens) */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className=" text-black p-2  "
          >
            {/* Hamburger SVG Icon */}
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

        {/* Buttons for login and registration (conditionally rendered based on isMenuOpen) */}
        {isMenuOpen && (
          <div className="absolute top-16 right-3 bg-white w-full shadow-2xl rounded-2xl z-10 sm:hidden flex flex-row items-center gap-4 p-7">
            <button
              onClick={handleLogin}
              className="bg-gradient-to-r from-sky-400 to-cyan-400 text-white mt-2 font-semibold w-full text-sm sm:text-base sm:px-7 sm:py-3 px-4 py-3 hover:shadow-lg hover:from-sky-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 rounded-3xl transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={handleRegistration}
              className="bg-gradient-to-r from-sky-400 to-cyan-400 text-white  font-semibold w-full text-sm sm:text-base sm:px-7 sm:py-3 px-4 py-3 mt-3 hover:shadow-lg hover:from-sky-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 rounded-3xl transition-all duration-300"
            >
              Register
            </button>
          </div>

        )}
      </nav>
    </header>
  );
};

export default Navbar;
