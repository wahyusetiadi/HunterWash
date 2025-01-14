import React, { useState, useEffect } from "react";
import { Navigation } from "../../components/organisms/Navigation";
import { Table } from "../../components/organisms/Table";
import {
  deleteTransaction,
  getTotalTransaksiByTanggal,
  getTransactions,
  getUser,
} from "../../api/api"; // Ensure this imports the getTransactions function

export const Income = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [selectedCabang, setSelectedCabang] = useState("semua"); // Default to 'semua'
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalMobil, setTotalMobil] = useState(0);
  const [totalMotor, setTotalMotor] = useState(0);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalPoin, setTotalPoin] = useState("")
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalDelete, setModalDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Handle Branch Change
  const handleCabangChange = (event) => {
    setSelectedCabang(event.target.value);
  };

  // Handle Date Change
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const openModalDelete = (itemOrId) => {
    if (typeof itemOrId === "object" && itemOrId !== null) {
      setItemToDelete(itemOrId);
      setModalDelete(true);
    } else if (typeof itemOrId === "number" || typeof itemOrId === "string") {
      const item = transactions.find((t) => t.id === itemOrId);
      if (item) {
        setItemToDelete(item);
        setModalDelete(true);
      } else {
        console.error("ID transaksi tidak ditemukan:", itemOrId);
        setError("Data tidak ditemukan");
      }
    } else {
      console.error("Invalid input for deletion:", itemOrId);
      setError("Input tidak valid");
    }
  };

  const closeModalDelete = () => {
    setModalDelete(false);
    setItemToDelete(null);
    setError(null);
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);

        // Set selected cabang only once, when user data is fetched
        if (userData?.role === "admin_cabang" && selectedCabang === "semua") {
          setSelectedCabang(userData?.cabang); // If admin_cabang, set their branch
        }
      } catch (error) {
        setError("Failed to fetch user data");
      }
    };

    fetchUser();
  }, []);

  // Fetch transactions data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions(); // Fetch all transactions
        setTransactions(data);

        let filteredData = [];

        // Set default startDate and endDate for current month if not already set
        if (!startDate && !endDate) {
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth(); // 0-based index
  
          // Set start of current month (1st January at 00:00)
          const startOfMonth = new Date(currentYear, currentMonth, 1);
  
          // Fixing the issue with time zone by creating new date instance with UTC
          const startOfMonthCorrected = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0));
  
          // Adjust to GMT+7
          startOfMonthCorrected.setHours(startOfMonthCorrected.getHours() + 7);
  
          // Set end of current month (last day of the month at 23:59:59)
          const endOfMonth = new Date(currentYear, currentMonth + 1, 0); // Get last day of the month
          endOfMonth.setHours(23, 59, 59, 999); // Set to 23:59:59 of last day in local time
  
          // Add 7 hours to adjust to GMT+7
          endOfMonth.setHours(endOfMonth.getHours() + 7);
  
          // Update the startDate and endDate state
          setStartDate(startOfMonthCorrected.toISOString().split("T")[0]);
          setEndDate(endOfMonth.toISOString().split("T")[0]);
        }

        // Filter by role and cabang selection
        if (user?.role === "admin_besar") {
          filteredData = data; // Admin besar can view all transactions
          if (selectedCabang !== "semua") {
            filteredData = filteredData.filter(
                (transaction) => transaction.cabang === selectedCabang
            );
          }
        } else if (user?.role === "admin_cabang") {
          filteredData = data.filter(
              (transaction) => transaction.petugas === user?.name
          );
          if (selectedCabang !== "semua") {
            filteredData = filteredData.filter(
                (transaction) => transaction.cabang === selectedCabang
            );
          }
        }

        // Apply date filtering based on selected startDate and endDate
        if (startDate) {
          filteredData = filteredData.filter(
              (transaction) =>
                  new Date(transaction.tanggal) >= new Date(startDate)
          );
        }

        if (endDate) {
          filteredData = filteredData.filter(
              (transaction) => new Date(transaction.tanggal) <= new Date(endDate)
          );
        }

        // Set the filtered transactions and calculate totals
        setFilteredTransactions(filteredData);

        // Calculate points based on vehicle type (Motor = 1, Mobil = 2)
        const totalPoin = filteredData.reduce((total, transaction) => {
          if (transaction.jenis === "Motor") {
            return total + 1; // 1 point for Motor
          } else if (transaction.jenis === "Mobil") {
            return total + 2; // 2 points for Mobil
          }
          return total;
        }, 0);

        console.log(`Total Poin: ${totalPoin}`);

        // Calculate total Pendapatan
        const totalPendapatan = filteredData.reduce((total, transaction) => {
          let saldoBersih = 0;

          // Kondisi berdasarkan role user dan petugas
          if (user?.role === "admin_besar") {
            saldoBersih = transaction.biaya || 0;
          } else if (user?.role === "admin_cabang") {
            saldoBersih =
                transaction.biaya !== null
                    ? Math.round(transaction.biaya / 3 / 1000) * 1000
                    : 0;
          } else {
            saldoBersih =
                transaction.biaya !== null
                    ? Math.round(transaction.biaya / 3 / 1000) * 1000
                    : 0;
          }

          return total + saldoBersih;
        }, 0);

        const formattedTotalPendapatan = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(totalPendapatan);

        // Count types of vehicles
        const totalMotor = filteredData.filter(
            (transaction) => transaction.jenis === "Motor"
        ).length;
        const totalMobil = filteredData.filter(
            (transaction) => transaction.jenis === "Mobil"
        ).length;
        const totalTransaksi = totalMotor + totalMobil;

        setTotalMotor(totalMotor);
        setTotalMobil(totalMobil);
        setTotalTransaksi(totalTransaksi);
        setTotalPendapatan(formattedTotalPendapatan);
        setTotalPoin(totalPoin); // Set total points

        // Filter branches for dropdown options
        const branches = data.map((transaction) => transaction.cabang);
        const uniqueBranches = [...new Set(branches)];
        const sortedBranch = uniqueBranches.sort((a, b) => a.localeCompare(b));
        setCabangOptions(sortedBranch);
      } catch (error) {
        setError("Failed to load transaction data");
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedCabang, user?.name, startDate, endDate]);


  const handleDeleteTransaction = async (id) => {
    if (!id) {
      setError("ID tidak valid untuk penghapusan");
      return;
    }

    setLoading(true);
    try {
      await deleteTransaction(id);
      closeModalDelete();
      setError(null);
    } catch (error) {
      setError("Gagal menghapus transaksi");
      console.error("Error delete transactions", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50">
      <Navigation />
      <div className="my-4 px-5">
        <div className="flex flex-col p-2 mt-4 text-center rounded-md bg-blue-100">
          <h1 className="text-base font-bold text-black">
            Data Transaksi & Pendapatan Pencucian Kendaraan
          </h1>
        </div>
      </div>
      <div className="px-5 text-sm">
        <form>
          {/* Branch Selection */}
          <div className="mb-4 flex flex-col items-start z-0">
            <label htmlFor="cabang" className="font-semibold mb-2">
              Cabang
            </label>
            <select
              className="border p-2 rounded bg-white w-full"
              value={selectedCabang}
              onChange={handleCabangChange}
            >
              <option value="semua">Semua Cabang</option>
              {cabangOptions.length > 0 ? (
                cabangOptions.map((cabang, index) => (
                  <option key={index} value={cabang}>
                    {cabang}
                  </option>
                ))
              ) : (
                <option value="">Loading branches...</option>
              )}
            </select>
          </div>

          {/* Date Selection */}
          <div className="w-full flex gap-4">
            <div className="mb-4 flex flex-col items-start z-0">
              <label htmlFor="startDate" className="font-semibold mb-2">
                Tanggal Mulai
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={handleStartDateChange}
                className="border p-2 rounded bg-white w-full"
              />
            </div>
            <div className="mb-4 flex flex-col items-start z-0">
              <label htmlFor="endDate" className="font-semibold mb-2">
                Tanggal Akhir
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={handleEndDateChange}
                className="border p-2 rounded bg-white w-full"
              />
            </div>
          </div>

          {/* <div className="text-xs font-semibold mt-4">
            <h1>Total Transaksi Mobil: {totalMobil}</h1>
            <h1>Total Transaksi Motor: {totalMotor}</h1>
            <h1>Total Transaksi Keseluruhan: {totalTransaksi}</h1>
          </div> */}
        </form>

        {/* Show loading if data is still being loaded */}
        {loading && (
          <div className="text-center py-4">Loading transaction data...</div>
        )}

        {/* Show error if there is one */}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {/* Show table only if data is available */}
        {!loading && !error && (
          <Table
            data={filteredTransactions}
            user={user}
            showDeleteButton={true}
            onDelete={openModalDelete}
            showImage={true}
            showJumlahTransaksi={true}
            totalMobil={totalMobil}
            totalMotor={totalMotor}
            totalTransaksi={totalTransaksi}
            totalPendapatan={totalPendapatan}
            totalPoin={totalPoin}
          />
        )}
      </div>

      {/* Modal Delete */}
      {modalDelete && itemToDelete && (
        <div className="fixed inset-0 px-5 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg px-4">
            <h2 className="text-lg font-semibold">Konfirmasi penghapusan</h2>
            <p className="mt-2">
              Apakah anda yakin ingin menghapus data {itemToDelete.nomorPolisi}?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => handleDeleteTransaction(itemToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Ya
              </button>
              <button
                onClick={closeModalDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
