import React, { useState } from 'react'
import ExportLogo from '../../assets/export.svg'
import { Navigation } from '../../components/organisms/Navigation'
import { Button } from '../../components/atoms/Button'

export const Rekap = () => {
    return (
        <div className='w-full bg-slate-50'>
            <Navigation />
            <div className="my-4 px-5">
                <div className="bg-white h-32 px-4 rounded-md flex flex-row gap-4 items-center justify-start text-black mb-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center flex">
                        <img src={ExportLogo} alt="" />
                    </div>
                    <div className="">
                        <p className='font-semibold text-xl mb-2'>Export Rekap</p>
                        <p className='font-light'>Download rekap data menjadi file excel</p>
                    </div>
                </div>
            </div>
            <div className="px-5 text-sm">
                <form>
                    <div className="mb-4 flex flex-col items-start ">
                        <label htmlFor="username" className='font-semibold mb-2'>Data yang ingin diexport</label>
                        <input
                            required
                            type="text"
                            placeholder='Pilih Data'
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className="mb-4 flex flex-col items-start ">
                        <label htmlFor="username" className='font-semibold mb-2'>Cabang</label>
                        <input
                            required
                            type="text"
                            placeholder='Pilih Cabang'
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
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
                        <Button title={'Export'} />
                    </div>
                </form>
            </div>
        </div>
    )
}
