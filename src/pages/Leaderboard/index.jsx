import * as React from "react";
import { useEffect, useState } from "react";
import { Navigation } from "../../components/organisms/Navigation/index.jsx";
import { getLeaderboard } from "../../api/api"; // Import getLeaderboard dari api.js

// Leaderboard komponen
export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]); // Menyimpan leaderboard
  const [loading, setLoading] = useState(true); // Menyimpan status loading
  const [isReset, setIsReset] = useState(false); // Menyimpan status apakah sudah reset
  const [lastResetDate, setLastResetDate] = useState(null); // Menyimpan tanggal reset terakhir
  const [nextResetDate, setNextResetDate] = useState(null); // Menyimpan tanggal reset berikutnya

  // Fungsi untuk memeriksa apakah sudah 6 bulan sejak reset terakhir
  const checkForReset = () => {
    const initialResetDate = new Date("2025-01-01"); // Tanggal reset pertama (1 Januari 2025)
    const lastResetDate = localStorage.getItem("lastResetDate"); // Ambil tanggal reset terakhir
    const currentDate = new Date();
    
    // Jika tidak ada tanggal reset terakhir, set tanggal reset pertama kali pada 1 Januari 2025
    if (!lastResetDate) {
      localStorage.setItem("lastResetDate", initialResetDate.toISOString());
      return false; // Reset pertama kali
    }

    const lastReset = new Date(lastResetDate);
    const diffInMonths = (currentDate.getFullYear() - lastReset.getFullYear()) * 12 + (currentDate.getMonth() - lastReset.getMonth());
    
    // Jika sudah lebih dari 6 bulan sejak reset terakhir
    if (diffInMonths >= 6) {
      localStorage.setItem("lastResetDate", currentDate.toISOString()); // Update tanggal reset terakhir
      return true; // Sudah 6 bulan, reset leaderboard
    }

    return false; // Belum 6 bulan, tidak perlu reset
  };

  // Mengambil leaderboard menggunakan API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cek apakah sudah 6 bulan sejak reset terakhir
        const reset = checkForReset();
        setIsReset(reset); // Set status reset

        // Ambil tanggal reset terakhir dari localStorage dan set ke state
        const storedLastResetDate = localStorage.getItem("lastResetDate");
        setLastResetDate(new Date(storedLastResetDate)); // Simpan tanggal reset terakhir

        // Hitung tanggal reset berikutnya (6 bulan setelah tanggal reset terakhir)
        const lastReset = new Date(storedLastResetDate);
        const nextReset = new Date(lastReset.setMonth(lastReset.getMonth() + 6));
        setNextResetDate(nextReset); // Simpan tanggal reset berikutnya

        // Ambil leaderboard dari API
        const data = await getLeaderboard();
        setLeaderboard(data); // Set leaderboard ke state
        setLoading(false); // Selesai loading
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
        setLoading(false); // Menyelesaikan loading meskipun terjadi error
      }
    };

    fetchData();
  }, [isReset]); // Tambahkan dependensi isReset agar data diproses ulang setelah reset

  // Jika data masih dimuat
  if (loading) {
    return <div>Loading...</div>;
  }

  // Format tanggal reset terakhir dan berikutnya
  const formattedResetDate = lastResetDate ? lastResetDate.toLocaleDateString() : "Tidak ada data reset";
  const formattedNextResetDate = nextResetDate ? nextResetDate.toLocaleDateString() : "Tidak tersedia";

  return (
    <div>
      <Navigation />
      <div className="my-4 px-5">
        <div className="flex flex-col p-2 mt-4 text-center rounded-md bg-blue-100">
          <h1 className="text-base font-bold text-black">Leaderboard</h1>
        </div>
        <div className="mt-4">
          {/* <p className="text-sm text-gray-600">Tanggal reset terakhir: {formattedResetDate}</p> */}  
          <p className="text-sm text-gray-600">Tanggal reset berikutnya: {formattedNextResetDate}</p> {/* Tanggal reset berikutnya */}
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Peringkat</th>
                <th className="px-4 py-2 border">Petugas</th>
                <th className="px-4 py-2 border">Total Poin</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => {
                let rowClass = ""; // Inisialisasi kelas untuk baris

                // Menentukan kelas berdasarkan peringkat
                if (index === 0) {
                  rowClass = "bg-green-400"; // Gold
                } else if (index === 1) {
                  rowClass = "bg-green-300"; // Silver
                } else if (index === 2) {
                  rowClass = "bg-green-200"; // Bronze
                }

                return (
                  <tr key={index} className={rowClass}>
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{item.petugasId}</td>{" "}
                    {/* Display Petugas ID, bisa diganti dengan nama */}
                    <td className="px-4 py-2 border">{item.totalPoin}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
