import React, { useEffect, useState } from "react";
import { Navigation } from "../../components/organisms/Navigation";
import { Table } from "../../components/organisms/Table";
import { addUser, deleteUser, getCabangOptions, getUser } from "../../api/api";
import Modal from "../../components/organisms/ModalForm";

export const DataKaryawan = () => {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [selectedCabang, setSelectedCabang] = useState("semua");
  const [isModal, setIsModal] = useState(false);
  const [sendData, setSendData] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);

  const openModalDelete = (item) => {
    setItemToDelete(item);
    setModalDelete(true);
  };

  const closeModalDelete = () => {
    setModalDelete(false);
    setItemToDelete(null);
  };

  const openModal = () => {
    setIsModal(true);
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const handleSubmit = (formData) => {
    setSendData(formData);
    console.log("Data yang di send:", formData);
  };

  const fetchLoginUser = async () => {
    try {
      const user = await getUser();
      setLoggedUser(user);
    } catch (error) {
      console.error("Error fetchin logged-in user:", error);
    }
  };
  // Fungsi untuk mengambil data karyawan dan cabang
  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await getCabangOptions();

      if (Array.isArray(data)) {
        console.log(data);
        setKaryawan(data);

        const branches = data.map((users) => users.cabang);
        const uniqueBranches = [...new Set(branches)];
        setCabangOptions(uniqueBranches);
      } else {
        throw new Error("Data yang diterima bukan array");
      }
    } catch (error) {
      setError(error.message || "Gagal Memuat Data Karyawan");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Panggil fetchUser saat komponen pertama kali dimuat
  useEffect(() => {
    fetchLoginUser();
    fetchUser();
  }, []);

  const handleAddUser = async (userData) => {
    setLoading(true);
    try {
      const response = await addUser(userData);
      // Setelah berhasil menambah user, langsung ambil data karyawan terbaru
      await fetchUser(); // Menarik data terbaru dari server
      setIsModal(false);
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    console.log("ID yang diteruskan:", id);
    if (!id) {
      console.error("ID tidak valid", id);
      return;
    }

    setLoading(true);
    try {
      await deleteUser(id);
      setKaryawan((prevUsers) => prevUsers.filter((user) => user.id !== id));
      closeModalDelete();
    } catch (error) {
      console.error("Error Delete User:", error);
      setError("Gagal Menghapus User");
    } finally {
      setLoading(false);
    }
  };

  const filteredKaryawan =
    selectedCabang === "semua"
      ? karyawan
      .filter((user) => user.id !== loggedUser?.id)
      .map((user) => ({
          name: user.name,
          email: user.email,
          role: user.role,
          cabang: user.cabang,
          createAt: user.dibuatTanggal,
          timeAt: user.dibuatJam,
          id: user.id,
        }))
      : karyawan
          .filter((user) => user.cabang === selectedCabang)
          .filter((user) => user.id !== loggedUser?.id)
          .map((user) => ({
            name: user.name,
            email: user.email,
            role: user.role,
            cabang: user.cabang,
            createAt: user.dibuatTanggal,
            timeAt: user.dibuatJam,
            id: user.id,
          }));

  const handleCabangChange = (e) => {
    setSelectedCabang(e.target.value);
  };

  return (
    <div>
      <Navigation />
      <div className="my-4 px-5">
        <div className="flex flex-col p-2 mt-4 text-center rounded-md bg-blue-100">
          <h1 className="text-base font-bold text-black">Data Karyawan</h1>
        </div>
      </div>

      <div className="px-5 text-sm">
        {/* Form untuk memilih cabang */}
        <form>
          <div className="mb-4 flex flex-col items-start">
            <label className="font-semibold mb-2" htmlFor="cabangSelect">
              Cabang
            </label>
            <select
              id="cabangSelect"
              aria-label="Pilih Cabang"
              className="border p-2 rounded bg-white w-full mx-0"
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
                <option value="">Memuat opsi cabang...</option>
              )}
            </select>
          </div>
        </form>

        {/* Menampilkan status loading */}
        {loading && (
          <div className="text-center py-4">Memuat data karyawan...</div>
        )}

        {/* Menampilkan error jika ada */}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {/* Menampilkan data karyawan jika tidak ada error dan tidak sedang loading */}
        {!loading && !error && (
          <div className="mt-4">
            {filteredKaryawan.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Tidak ada data karyawan untuk cabang ini.
              </div>
            ) : (
              <Table
                data={filteredKaryawan}
                showAddButton={true}
                showDeleteButton={true}
                onClickAdd={openModal}
                onDelete={openModalDelete}
                // showUpdateButton={true}
              />
            )}
          </div>
        )}

        {modalDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg px-4">
              <h2 className="text-lg font-semibold">Konfirmasi Penghapusan</h2>
              <p className="mt-2">
                Apakah Anda yakin ingin menghapus data ini?
              </p>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => handleDeleteUser(itemToDelete.id)}
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

        <Modal
          isOpen={isModal}
          onClose={closeModal}
          onSubmit={handleAddUser}
          loading={loading}
        />
      </div>
    </div>
  );
};
