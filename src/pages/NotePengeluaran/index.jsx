import React, { useEffect, useState } from "react";
import { Navigation } from "../../components/organisms/Navigation";
import { Table } from "../../components/organisms/Table";
import { getPengeluaran, getUser } from "../../api/api";

export const NotePengeluaran = () => {
  const [expanse, setExpanse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredExpanse, setFilteredExpanse] = useState([]);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedCabang, setSelectedCabang] = useState("semua");

  useEffect(() => {
    const fetchExpanse = async () => {
      try {
        const data = await getPengeluaran(); // Ambil data pengeluaran
        setExpanse(data);

        // Menyaring data pengeluaran berdasarkan cabang yang dipilih
        if (selectedCabang == "semua") {
          setFilteredExpanse(data); // Menyaring data sesuai cabang yang dipilih
        } else {
          const filtered = data.filter(pengeluaran => pengeluaran.cabang === selectedCabang);
          setFilteredExpanse(filtered); // Tampilkan semua data jika "Semua Cabang" dipilih
        }

        // Mengambil nama cabang yang unik
        const branches = data.map(pengeluaran => pengeluaran.cabang);
        const uniqueBranches = [...new Set(branches)]; // Menghilangkan duplikasi
        setCabangOptions(uniqueBranches); // Menyimpan cabang yang unik
      } catch (error) {
        setError("Gagal memuat data pengeluaran");
        console.error("Error fetching expanse:", error);
      } finally {
        setLoading(false); // Set loading selesai
      }
    };

    const fetchUser = async () => {
      try {
        const userData = await getUser(); // Ambil data user
        setUser(userData);

        // Menyesuaikan cabang yang dipilih berdasarkan role pengguna
        if (userData?.role === "admin_cabang") {
          // Jika user adalah admin cabang, setel cabang yang relevan (misalnya cabang pengguna)
          setSelectedCabang(userData?.cabang);  // Misalnya, `userData.cabang` adalah cabang yang dimiliki oleh admin cabang
        }
      } catch (error) {
        setError("Failed to fetch user data");
      }
    };

    fetchUser();
    fetchExpanse();
  }, [selectedCabang]); // Efek ini dijalankan setiap kali selectedCabang berubah

  const handleCabangChange = (event) => {
    setSelectedCabang(event.target.value); // Menangani perubahan cabang yang dipilih
  };

  return (
    <div className="w-full bg-slate-50">
      <Navigation />
      <div className="my-4 px-5">
        <div className="flex flex-col p-2 mt-4 text-center rounded-md bg-blue-100">
          <h1 className="text-base font-bold text-black">Data Pengeluaran</h1>
        </div>
      </div>
      <div className="px-5 text-sm">
        <form>
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="username" className="font-semibold mb-2">
              Cabang
            </label>
            <select
              className="border p-2 rounded bg-white w-full mx-0"
              disabled={user?.role === "admin_cabang"}
              value={selectedCabang}
              onChange={handleCabangChange}
            >
              {user?.role === 'admin_besar' && <option value="semua">Semua Cabang</option>}
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

        {/* Tampilkan loading jika data masih dimuat */}
        {loading && <div className="text-center py-4">Memuat data pengeluaran...</div>}

        {/* Tampilkan error jika ada */}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {/* Jika data pengeluaran tersedia, tampilkan tabel */}
        {!loading && !error && (
          <div className="mt-4">
            {filteredExpanse.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Tidak ada pengeluaran untuk cabang ini.
              </div>
            ) : (
              <Table data={filteredExpanse} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
