import React, { useEffect, useState } from "react";
import { getPendapatanByDate, getPengeluaranbyDate, getTotalTransaksiHarian, getUser } from "../../../api/api";
import IncomeLogo from "../../../assets/income.svg";
import ExportLogo from "../../../assets/export.svg";
import BikeLogo from "../../../assets/bike.svg";
import { Navigation } from "../../../components/organisms/Navigation";
import { CardIcon } from "../../../components/molecules/CardIcon";
import { Date as CurrentDate } from "../../../components/organisms/Date";

export const Dashboard = () => {
  const [pendapatan, setPendapatan] = useState(null);
  const [pengeluaran, setPengeluaran] = useState(null);
  const [totalTransaksi, setTotalTransaksi] = useState(null);
  const [user, setUser] = useState("null");
  const [error, setError] = useState(null); 

  // Fungsi untuk mendapatkan tanggal dalam format YYYY-MM-DD
  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const isAdminBesar = user?.role === "admin_besar";
  const isAdmincabang = user?.role === "admin_cabang";

  useEffect(() => {
    const fetchPendapatan = async () => {
      try {
        const tanggal = getFormattedDate(); 
        console.log("Tanggal yang dikirim ke API:", tanggal);

        const data = await getPendapatanByDate(tanggal);

        console.log("Data yang diterima dari API:", data);

        if (data && data.totalPendapatan !== undefined) {
          setPendapatan(data.totalPendapatan || 0); // Set pendapatan atau 0 jika tidak ada
        } else {
          setPendapatan(0); // Jika totalPendapatan tidak ditemukan
        }
      } catch (error) {
        console.error("Error fetching pendapatan:", error);
        setError("Gagal mengambil data pendapatan. Coba lagi nanti.");
        setPendapatan(0); // Set pendapatan ke 0 jika ada error
      }
    };

    const fetchPengeluaran = async () => {
      try {
        const tanggal = getFormattedDate(); 
        console.log("Tanggal yang dikirim ke API:", tanggal); 

        const data = await getPengeluaranbyDate(tanggal);

        console.log("Data yang diterima dari API:", data); 

        if (data && data.totalPengeluaran !== undefined) {
          setPengeluaran(data.totalPengeluaran || 0);
        } else {
          setPengeluaran(0); // Jika totalPendapatan tidak ditemukan
        }
      } catch (error) {
        console.error("Error fetching pendapatan:", error);
        setError("Gagal mengambil data pendapatan. Coba lagi nanti.");
        setPengeluaran(0); // Set pendapatan ke 0 jika ada error
      }
    };

    const fetchTransaksi = async () => {
      try {
        const tanggal = getFormattedDate(); 
        console.log("Tanggal yang dikirim ke API:", tanggal);

        const data = await getTotalTransaksiHarian(tanggal);

        console.log("Data yang diterima dari API:", data); 

        if (data && data.totalTransaksiHarian !== undefined) {
          setTotalTransaksi(data.totalTransaksiHarian || 0); 
        } else {
          setTotalTransaksi(0); 
        }
      } catch (error) {
        console.error("Error fetching pendapatan:", error);
        setError("Gagal mengambil data pendapatan. Coba lagi nanti.");
        setTotalTransaksi(0); 
      }
    };

    const fetchCabang = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        setError("Failed to fetch user data");
      }
    };

    fetchCabang();

    fetchTransaksi();

    fetchPengeluaran();
    
    fetchPendapatan();
  }, []);

  // Hitung saldo bersih berdasarkan pendapatan dan pembagian 3
  const saldoBersih = pendapatan !== null ? pendapatan / 3 : 0;

  return (
    <div className="w-full h-screen bg-whitew-full bg-slate-50 items-center text-sm justify-center min-h-screen text-black">
      {/* NAVIGATION */}
      <Navigation />

      {/* CONTENT */}
      <div className="flex flex-col w-full">
        <div className="w-full h-24 px-5">
          <div className="flex mt-4">
            <div className="flex items-center justify-start w-3/4 font-bold">
              {user?.name} - {user?.cabang}
            </div>
            <div className="flex items-center justify-end w-1/4 text-xs">
              <CurrentDate />
            </div>
          </div>

          <div className="flex flex-col p-2 mt-4 items-center justify-center rounded-md bg-blue-100">
            <h1 className="text-2xl font-bold text-blue-600">
              {totalTransaksi !== null
                ? `${totalTransaksi.toLocaleString()}`
                : error || "Loading..."}
            </h1>
            <p className="text-sm">Transaksi Hari ini</p>
          </div>
          
          {/* Pendapatan Card */}
          <div className="flex flex-col p-2 mt-4 items-center justify-center rounded-md bg-green-100">
            <h1 className="text-2xl font-bold text-green-600">
              {pendapatan !== null
                ? `Rp ${pendapatan.toLocaleString()}`
                : error || "Loading..."}
            </h1>
            <p className="text-sm">Pendapatan Hari ini</p>
          </div>

          <div className="flex flex-col p-2 mt-4 items-center justify-center rounded-md bg-red-100">
            <h1 className="text-2xl font-bold text-red-600">
              {pengeluaran !== null
                ? `Rp ${pengeluaran.toLocaleString()}`
                : error || "Loading..."}
            </h1>
            <p className="text-sm">Pengeluaran Hari ini</p>
          </div>

          {/* Tampilkan saldo bersih hanya untuk admin_cabang */}
          {isAdmincabang && (
            <div className="my-4 pt-4 font-bold w-full flex flex-col gap-2 items-center justify-center">
              <p>Saldo Bersih</p>
              <h1 className="text-2xl font-bold text-green-600 mt-2">
                {saldoBersih !== null
                  ? `Rp ${saldoBersih.toLocaleString()}`
                  : error || "Loading..."}
              </h1>
            </div>
          )}
          
          <h1 className="font-bold my-4">Daftar Menu</h1>
          <div className="text-white">
            {!isAdminBesar && isAdmincabang && (
              <CardIcon
                colorbg={"bg-blue-500"}
                coloricon={"bg-white"}
                logo={BikeLogo}
                title={"Input Transaksi"}
                link={"/transaksi"}
              />
            )}
            {isAdminBesar && (
              <CardIcon
                colorbg={"bg-blue-500"}
                coloricon={"bg-white"}
                logo={BikeLogo}
                title={"Catatan Pemasukan"}
                link={"/pemasukan"}
              />
            )}
            <CardIcon
              colorbg={"bg-blue-500"}
              coloricon={"bg-white"}
              logo={IncomeLogo}
              title={"Catatan Pengeluaran"}
              link={"/catatan-pengeluaran"}
            />
            <CardIcon
              colorbg={"bg-blue-500"}
              coloricon={"bg-white"}
              logo={ExportLogo}
              title={"ExportRekap"}
              link={"/export"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
