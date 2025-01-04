import React, { useState, useEffect } from "react";
import { Navigation } from "../../components/organisms/Navigation";
import { Table } from "../../components/organisms/Table";
import { deleteTransaction, getTransactions, getUser } from "../../api/api"; // Ensure this imports the getTransactions function

export const Income = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [selectedCabang, setSelectedCabang] = useState("semua"); // Default to 'semua'
  const [isModal, setIsModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);

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

  const openModal = () => {
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
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
  }, []); // Run only once when the component is mounted

  // Fetch transactions data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions(); // Fetch all transactions
        setTransactions(data);

        let filteredData = [];

        // If logged in as admin_besar
        if (user?.role === "admin_besar") {
          filteredData = data; // Admin besar can view all transactions

          // Filter by branch if selected
          if (selectedCabang !== "semua") {
            filteredData = filteredData.filter(
              (transaction) => transaction.cabang === selectedCabang
            );
          }
        }
        // If logged in as admin_cabang
        else if (user?.role === "admin_cabang") {
          // Admin cabang can only see transactions made by the same petugas
          filteredData = data.filter(
            (transaction) => transaction.petugas === user?.name
          );

          // If a specific branch is selected, filter by that branch as well
          if (selectedCabang !== "semua") {
            filteredData = filteredData.filter(
              (transaction) => transaction.cabang === selectedCabang
            );
          }
        }

        setFilteredTransactions(filteredData);

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
  }, [selectedCabang, user?.name]); // Ensure this includes selectedCabang and user.name

  // Handle branch change
  const handleCabangChange = (event) => {
    const newCabang = event.target.value;
    console.log("Selected Cabang:", newCabang); // Debug log to check if branch is selected properly
    setSelectedCabang(newCabang); // Update selected branch
  };

  const handleDeleteTransaction = async (id) => {
    if (!id) {
      setError("ID tidak valid untuk penghapusan");
      return;
    }

    setLoading(true);
    try {
      await deleteTransaction(id);
      closeModalDelete();
      setIsModal(false);
      setError(null);
    } catch (error) {
      console.error("Error delete transactions", error);
      setError("Gagal menghapus transaksi");
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
            showDeleteButton={true}
            onDelete={openModalDelete}
            showImage={true}
          />
        )}

        {modalDelete && itemToDelete && (
          <div className="fixed inset-0 px-5 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg px-4">
              <h2 className="text-lg font-semibold">Konfirmasi penghapusan</h2>
              <p className="mt-2">
                Apakah anda yakin ingin menghapus data{" "}
                {itemToDelete.nomorPolisi}?
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
    </div>
  );
};
