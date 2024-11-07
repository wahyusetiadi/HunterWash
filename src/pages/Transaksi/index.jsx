import React, { useState } from 'react'
import { CardIcon } from '../../components/molecules/CardIcon'
import { Navigation } from '../../components/organisms/Navigation'
import FileUpload from '../../components/molecules/FileUpload';
import BikeLogo from '../../assets/bike.svg'

export const Transaksi = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOption, setIsOption] = useState(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleSelectStaff = (option) => {
        setIsOption(option);
        setIsOpen(false);
    }
    const handleSelectPrice = (option) => {
        setIsOption(option);
        setIsOpen(false);
    }
    const Petugas = ['Mamat', 'Bayu', 'Fikri'];
    const Harga = ['15000', '30000'];
    return (
        <div className='w-full bg-slate-50'>
            <Navigation />
            <div className="my-4 px-5">
                <CardIcon colorbg={'bg-white'} coloricon={'bg-slate-50'} logo={BikeLogo} title={'Input Transaksi'} subtitle={'Pencatatan Setiap Transaksi Pencucian Motor'}/>
            </div>
            <div className="px-5 text-sm">
                <form>
                    <div className="mb-4 flex flex-col items-start ">
                        <label htmlFor="username" className='font-semibold mb-2'>Nomor Polisi</label>
                        <input
                            required
                            type="text"
                            placeholder='DAXXXX00'
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className="mb-4 flex flex-col items-start ">
                        <label htmlFor="username" className='font-semibold mb-2'>Jenis/ Tipe Kendaraan</label>
                        <input
                            required
                            type="text"
                            placeholder='Masukkan Jenis Kendaraan'
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className="mb-4 flex flex-col items-start ">
                        <label htmlFor="username" className='font-semibold mb-2'>Harga</label>
                        <input
                            required
                            type="text"
                            placeholder='Pilih Harga'
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div>

                    </div>
                    <FileUpload />
                    <div className="mb-4 flex flex-col items-start ">
                        <label htmlFor="username" className='font-semibold mb-2'>Petugas</label>
                        <input
                            required
                            type="text"
                            placeholder='Pilih Petugas'
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}
