import React, { useState } from 'react'
import IncomeLogo from '../../assets/income.svg'
import { Navigation } from '../../components/organisms/Navigation'
import { Button } from '../../components/atoms/Button'
import { CardIcon } from '../../components/molecules/CardIcon'
import { InputField } from '../../components/molecules/InputFiled'

export const Pengeluaran = () => {
    return (
        <div className='w-full bg-slate-50'>
            <Navigation />
            <div className="my-4 px-5">
                <CardIcon colorbg={'bg-white'} coloricon={'bg-slate-100'} logo={IncomeLogo} title={'Catat Pengeluaran'} subtitle={'Pencatatan setiap Pengeluaran oleh Petugas'} />
            </div>
            <div className="px-5 text-sm">
                <form>
                    <InputField label={'Keperluan'} placeholder={'Masukkan Keperluan'} />
                    <InputField label={'Nominal'} caption={'Contoh: 15000 (Hanya Angka)'} placeholder={'Masukkan Nominal'} type={'text'} />
                    
                    <div>
                    </div>
                    {/* inputfiled dropdown atau accordion */}
                    <div className="mb-4 flex flex-col items-start ">
                        <label htmlFor="username" className='font-semibold mb-2'>Petugas yang Memerlukan Dana</label>
                        <input
                            required
                            type="text"
                            placeholder='Pilih Petugas'
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className="pt-4">
                        <Button title={'Simpan'} />
                    </div>
                </form>
            </div>
        </div>
    )
}
