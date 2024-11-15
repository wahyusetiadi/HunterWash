import React, { useState, useEffect } from 'react';
import { exportTransaksi, exportPengeluaran, getTransactions, getPengeluaran } from '../../api/api'; // Mengambil data transaksi dan pengeluaran dari API
import ExportLogo from '../../assets/export.svg';
import { Navigation } from '../../components/organisms/Navigation';
import { Button } from '../../components/atoms/Button';

export const Rekap = () => {
  // State untuk form input
  const [dataType, setDataType] = useState('');  // Menyimpan tipe data yang dipilih (Transaksi/Pengeluaran)
  const [branch, setBranch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cabangOptions, setCabangOptions] = useState([]);  // State untuk menyimpan opsi cabang
  const [transactions, setTransactions] = useState([]); // Untuk menyimpan data transaksi
  const [expanse, setExpanse] = useState([]);  // Untuk menyimpan data pengeluaran

  // Ambil data transaksi dan pengeluaran saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions(); // Panggil API untuk mengambil data transaksi
        setTransactions(data);  // Set transaksi ke state

        // Ambil cabang unik dari data transaksi
        const branches = data.map(transaction => transaction.cabang);
        const uniqueBranches = [...new Set(branches)];  // Menghilangkan duplikasi cabang
        setCabangOptions(uniqueBranches); // Set cabang options
      } catch (err) {
        setError('Gagal memuat data transaksi atau cabang.');
        console.error('Error fetching transactions:', err);
      }
    };

    const fetchExpanse = async () => {
      try {
        const data = await getPengeluaran(); // Panggil API untuk mengambil data pengeluaran
        setExpanse(data); // Set pengeluaran ke state
      } catch (err) {
        setError('Gagal memuat data pengeluaran.');
        console.error('Error fetching expanse:', err);
      }
    };

    fetchTransactions();
    fetchExpanse();
  }, []); // Efek ini hanya dijalankan sekali saat komponen pertama kali dimuat

  // Handle perubahan pada input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'dataType':
        setDataType(value);  // Update tipe data yang dipilih (Transaksi/Pengeluaran)
        break;
      case 'branch':
        setBranch(value);
        break;
      case 'fromDate':
        setFromDate(value);
        break;
      case 'toDate':
        setToDate(value);
        break;
      default:
        break;
    }
  };

  // Fungsi untuk mengekspor data
  const handleExport = async (e) => {
    e.preventDefault(); // Menghentikan refresh halaman

    if (!dataType || !branch || !fromDate || !toDate) {
      setError('Semua field harus diisi!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (dataType === 'transaksi') {
        // Jika data yang dipilih adalah transaksi
        await exportTransaksi(branch, fromDate, toDate);  // Mengirim cabang, dari tanggal, dan sampai tanggal
      } else if (dataType === 'pengeluaran') {
        // Jika data yang dipilih adalah pengeluaran
        await exportPengeluaran(branch, fromDate, toDate);  // Mengirim cabang, dari tanggal, dan sampai tanggal
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengekspor data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50">
      <Navigation />
      <div className="my-4 px-5">
        <div className="bg-white h-32 px-4 rounded-md flex flex-row gap-4 items-center justify-start text-black mb-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center flex">
            <img src={ExportLogo} alt="Export Icon" />
          </div>
          <div>
            <p className="font-semibold text-xl mb-2">Export Rekap</p>
            <p className="font-light">Download rekap data menjadi file excel</p>
          </div>
        </div>
      </div>
      <div className="px-5 text-sm">
        <form onSubmit={handleExport}>
          {/* Pilihan Data yang ingin diexport */}
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="dataType" className="font-semibold mb-2">
              Data yang ingin diexport
            </label>
            <select
              name="dataType"
              value={dataType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Data</option>
              <option value="transaksi">Transaksi</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </div>

          {/* Cabang (ubah menjadi select) */}
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="branch" className="font-semibold mb-2">
              Cabang
            </label>
            <select
              name="branch"
              value={branch}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Cabang</option>
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

          {/* Tanggal */}
          <div className="flex gap-4">
            <div className="mb-4 flex flex-col items-start">
              <label htmlFor="fromDate" className="font-semibold mb-2">
                Dari Tanggal
              </label>
              <input
                required
                name="fromDate"
                type="date"
                value={fromDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 flex flex-col items-start">
              <label htmlFor="toDate" className="font-semibold mb-2">
                Sampai Tanggal
              </label>
              <input
                required
                name="toDate"
                type="date"
                value={toDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tombol Export */}
          <div className="pt-4">
            <Button title={isLoading ? 'Exporting...' : 'Export'} disabled={isLoading} />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};
