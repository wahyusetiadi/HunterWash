import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FormLogin } from './pages/auth/FormLogin'
import { Dashboard } from './pages/dashboard/User'
import { Transaksi } from './pages/Transaksi'
import { Rekap } from './pages/Rekap'
import { Income } from './pages/Income'
import { Pengeluaran } from './pages/Pengeluaran'
import { NotePengeluaran } from './pages/NotePengeluaran'
import { DataKaryawan } from './pages/DataKaryawan'
import ProtectedLayout from './layout/ProtectedLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/auth' element={<FormLogin />} />
        <Route element={<ProtectedLayout />}>
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
