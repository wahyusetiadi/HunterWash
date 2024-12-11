import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for routing and useLocation for current path
import LogoText from "../../../assets/logo-text.svg";
import Logo from "../../../assets/logo.svg";
import { getUser } from "../../../api/api";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token"); // Hapus token dari localStorage
    navigate("/"); // Arahkan pengguna ke halaman login
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        throw error;
      }
    };
    fetchUser();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isAdminBesar = user?.role === "admin_besar";
  const isAdmincabang = user?.role === "admin_cabang";

  return (
    <div className="flex flex-row w-full h-[80px] bg-white shadow-md px-5">
      <Link to={"/dashboard"}>
        <div className="flex gap-4 h-full items-center justify-start">
          <img src={Logo} alt="Logo" />
          <img src={LogoText} alt="Logo Text" />
        </div>
      </Link>

      {/* Hamburger Icon */}
      <div className="flex items-center justify-end w-full">
        <button
          className="text-2xl"
          onClick={toggleMenu} // Toggle the menu when clicked
        >
          =
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-white shadow-md z-10">
          <ul className="flex flex-col p-4">
            <li>
              <Link
                to="/dashboard"
                className="block py-2 px-4 hover:bg-gray-200"
              >
                Beranda
              </Link>
            </li>
            {!isAdminBesar && isAdmincabang && (
              <>
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
                    to="/pengeluaran"
                    className="block py-2 px-4 hover:bg-gray-200"
                  >
                    Input Pengeluaran
                  </Link>
                </li>
              </>
            )}

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
            {!isAdmincabang && isAdminBesar && (
              <>
                <li>
                  <Link
                    to="/data-karyawan"
                    className="block py-2 px-4 hover:bg-gray-200"
                  >
                    Data Karyawan
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                to="/pemasukan"
                className="block py-2 px-4 hover:bg-gray-200"
              >
                Data Pemasukan & Transaksi
              </Link>
            </li>
            {/* <li>
              <Link to="/auth"
              className="block py-2 px-4 hover:bg-gray-200"
              >
                Keluar
              </Link>
            </li> */}
            <li>
              <button
                className="block w-full text-left py-2 px-4 hover:bg-gray-200"
                onClick={logout}
              >
                Keluar
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
