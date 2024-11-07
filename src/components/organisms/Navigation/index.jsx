import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link for routing and useLocation for current path
import LogoText from "../../../assets/logo-text.svg";
import Logo from "../../../assets/logo.svg";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility
  const location = useLocation(); // Get the current path

  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Hide the hamburger icon if the current path is "/dashboard"
  const shouldHideHamburger = location.pathname === "/dashboard";

  return (
    <div className="flex flex-row w-full h-[80px] bg-white shadow-md px-5">
      <Link to={'/dashboard'}>
        <div className="flex gap-4 h-full items-center justify-start">
          <img src={Logo} alt="Logo" />
          <img src={LogoText} alt="Logo Text" />
        </div>
      </Link>

      {/* Hamburger Icon */}
      <div className="flex items-center justify-end w-full">
        {!shouldHideHamburger && (
          <button
            className="text-2xl"
            onClick={toggleMenu} // Toggle the menu when clicked
          >
            =
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-white shadow-md">
          <ul className="flex flex-col p-4">
            <li>
              <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-200">
                Beranda
              </Link>
            </li>
            <li>
              <Link
                to="/transaksi"
                className="block py-2 px-4 hover:bg-gray-200"
              >
                Input Transaksi
              </Link>
            </li>
            <li>
              <Link
                to="/catatan-pengeluaran"
                className="block py-2 px-4 hover:bg-gray-200"
              >
                Catatan Pengeluaran
              </Link>
            </li>
            <li>
              <Link to="/export" className="block py-2 px-4 hover:bg-gray-200">
                Export Rekap
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
