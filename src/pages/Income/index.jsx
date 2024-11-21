import React, { useState, useEffect } from 'react';
import ExportLogo from '../../assets/export.svg';
import { Navigation } from '../../components/organisms/Navigation';
import { Button } from '../../components/atoms/Button';
import { Table } from '../../components/organisms/Table';
import { getTransactions, getUser } from '../../api/api'; // Pastikan mengimpor fungsi getTransactions

export const Income = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]); // State untuk transaksi yang sudah difilter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [selectedCabang, setSelectedCabang] = useState('semua'); // Default pilih 'semua'

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);

        // Filter transaksi berdasarkan selectedCabang
        if (selectedCabang === 'semua') {
          setFilteredTransactions(data); // Jika 'semua' dipilih, tampilkan semua transaksi
        } else {
          const filtered = data.filter(transaction => transaction.cabang === selectedCabang);
          setFilteredTransactions(filtered); // Filter berdasarkan cabang yang dipilih
        }

        const branches = data.map(transaction => transaction.cabang); // Ambil nama cabang
        const uniqueBranches = [...new Set(branches)]; // Menghilangkan duplikasi cabang
        setCabangOptions(uniqueBranches); // Menyimpan cabang unik ke state
      } catch (error) {
        setError('Gagal memuat data transaksi');
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);

        // Menyesuaikan cabang yang dipilih berdasarkan role pengguna
        if (userData?.role === 'admin_cabang') {
          setSelectedCabang(userData?.cabang); // Admin cabang hanya bisa melihat cabang mereka
        }
      } catch (error) {
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
    fetchTransactions();
  }, [selectedCabang]); // Re-run hook ketika selectedCabang berubah

  const handleCabangChange = (event) => {
    setSelectedCabang(event.target.value); // Update cabang yang dipilih
  };

  return (
    <div className="w-full bg-slate-50">
      <Navigation />
      <div className="my-4 px-5">
        <div className="flex flex-col p-2 mt-4 text-center rounded-md bg-blue-100">
          <h1 className="text-base font-bold text-black">Data Transaksi & Pendapatan Pencucian Kendaraan</h1>
        </div>
      </div>
      <div className="px-5 text-sm">
        <form>
          <div className="mb-4 flex flex-col items-start z-0">
            <label htmlFor="username" className="font-semibold mb-2">Cabang</label>
            <select
              className="border p-2 rounded bg-white w-full"
              disabled={user?.role === 'admin_cabang'} // Nonaktifkan select untuk admin cabang
              value={selectedCabang}
              onChange={handleCabangChange}
            >
              {user?.role === 'admin_besar' && <option value="semua">Semua Cabang</option>}
              {cabangOptions.length > 0 ? (
                cabangOptions.map((cabang, index) => (
                  <option key={index} value={cabang}>{cabang}</option>
                ))
              ) : (
                <option value="">Memuat opsi cabang...</option>
              )}
            </select>
          </div>
        </form>

        {/* Tampilkan loading jika data masih dimuat */}
        {loading && <div className="text-center py-4">Memuat data transaksi...</div>}

        {/* Tampilkan error jika ada */}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {/* Tampilkan tabel hanya jika data tersedia */}
        {!loading && !error && <Table data={filteredTransactions} />}
      </div>
    </div>
  );
};
