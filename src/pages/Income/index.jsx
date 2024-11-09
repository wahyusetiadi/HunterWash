import React, { useState, useEffect } from 'react'
import ExportLogo from '../../assets/export.svg'
import { Navigation } from '../../components/organisms/Navigation'
import { Button } from '../../components/atoms/Button'
import { Table } from '../../components/organisms/Table'
import { getTransactions } from '../../api/api' // Pastikan mengimpor fungsi getTransactions

export const Income = () => {
  const [transactions, setTransactions] = useState([]); // State untuk menyimpan data transaksi
  const [loading, setLoading] = useState(true); // State untuk status loading
  const [error, setError] = useState(null); // State untuk menangani error

  // Mengambil data transaksi dari API saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);  // Menyimpan data transaksi ke dalam state
      } catch (error) {
        setError('Gagal memuat data transaksi');  // Menangani error
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);  // Set loading ke false setelah selesai
      }
    };

    fetchTransactions();  // Panggil fungsi untuk mengambil data transaksi
  }, []); // Efek ini hanya dijalankan sekali saat komponen pertama kali dimuat

  return (
    <div className='w-full bg-slate-50'>
      <Navigation />
      <div className="my-4 px-5">
        <div className="flex flex-col p-2 mt-4 text-center rounded-md bg-blue-100">
          <h1 className='text-base font-bold text-black'>Data Transaksi & Pendapatan Pencucian Kendaraan</h1>
        </div>
      </div>
      <div className="px-5 text-sm">
        <form>
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="username" className='font-semibold mb-2'>Cabang</label>
            <select className='border p-2 rounded bg-white w-full'>
              <option value="">Cabang 1</option>
              <option value="">Cabang 2</option>
            </select>
          </div>
        </form>

        {/* Tampilkan loading jika data masih dimuat */}
        {loading && <div className="text-center py-4">Memuat data transaksi...</div>}

        {/* Tampilkan error jika ada */}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {/* Tampilkan tabel hanya jika data tersedia */}
        {!loading && !error && <Table data={transactions} />}
      </div>
    </div>
  )
}
