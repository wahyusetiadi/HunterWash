import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FormLogin } from './pages/auth/FormLogin'
import { Dashboard } from './pages/Dashboard'
import { Transaksi } from './pages/Transaksi'
import { Rekap } from './pages/Rekap'
import { Income } from './pages/Income'
import { Pengeluaran } from './pages/Pengeluaran'
import { NotePengeluaran } from './pages/NotePengeluaran'
import { DataKaryawan } from './pages/DataKaryawan'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route path='/auth' element={<FormLogin />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/transaksi' element={<Transaksi />} />
          <Route path='/export' element={<Rekap />} />
          <Route path='/pemasukan' element={<Income />} />
          <Route path='/pengeluaran' element={<Pengeluaran />} />
          <Route path='/catatan-pengeluaran' element={<NotePengeluaran />} />
          <Route path='/data-karyawan' element={<DataKaryawan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
