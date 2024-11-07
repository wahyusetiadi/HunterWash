import React, { useState } from 'react'
import ExportLogo from '../../assets/export.svg'
import { Navigation } from '../../components/organisms/Navigation'
import { Button } from '../../components/atoms/Button'

export const Income = () => {
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
                    <div className="mb-4 flex flex-col items-start ">
                        <label htmlFor="username" className='font-semibold mb-2'>Cabang</label>
                        <select className='border p-2 rounded bg-white w-full'>
                            <option value="">Cabang 1</option>
                            <option value="">Cabang 2</option>
                        </select>
                    </div>
                    <div>
                    </div>
                    <div className="flex gap-4">
                        <div className="mb-4 flex flex-col items-start ">
                            <label htmlFor="username" className='font-semibold mb-2'>Dari Tanggal</label>
                            <input
                                required
                                type="text"
                                placeholder='Pilih Tanggal'
                                className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                        <div className="mb-4 flex flex-col items-start ">
                            <label htmlFor="username" className='font-semibold mb-2'>Sampai Tanggal</label>
                            <input
                                required
                                type="text"
                                placeholder='Pilih Tanggal'
                                className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                    </div>
                    <div className="pt-4">
                        <Button title={'Lihat'} />
                    </div>
                </form>
                <div className="overflow-x-auto mt-4">
                    <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-lg'>
                        <thead className='bg-blue-400 text-gray-900 rounded'>
                            <tr>
                                <th className='py-2 px-6 text-left'>No</th>
                                <th className='py-2 px-6 text-left'>Nomor Polisi</th>
                                <th className='py-2 px-6 text-left'>Kendaraan</th>
                                <th className='py-2 px-6 text-left'>Foto</th>
                                <th className='py-2 px-6 text-left'>Harga</th>
                                <th className='py-2 px-6 text-left'>Jam</th>
                                <th className='py-2 px-6 text-left'>Tanggal</th>
                                <th className='py-2 px-6 text-left'>Petugas</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 text-xs'>
                            <tr className='border-b'>
                                <td className='py-2 px-6'>1</td>
                                <td className='py-2 px-6'>DA1234AB</td>
                                <td className='py-2 px-6'>Lexi</td>
                                <td className='py-2 px-6'><a href="#" className='text-blue-500'>Gambar</a></td>
                                <td className='py-2 px-6'>15000</td>
                                <td className='py-2 px-6'>12.44</td>
                                <td className='py-2 px-6'>12 Nov 2024</td>
                                <td className='py-2 px-6'>Oling Anugrah</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* PAGINATION */}
                <div class="flex justify-between items-center mt-6 text-xs">
                    <div class="flex items-center">
                        <span class="text-gray-600">Menampilkan 1–3 dari 6 hasil</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="p-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50" disabled>
                            &laquo; Sebelumnya
                        </button>
                        <button class="p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">1</button>
                        <button class="p-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">2</button>
                        <button class="p-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">3</button>
                        <button class="p-1 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                            Berikutnya &raquo;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
