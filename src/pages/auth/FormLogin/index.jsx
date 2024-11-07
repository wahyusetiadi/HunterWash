import React from 'react'
import { Button } from '../../../components/atoms/Button'

export const FormLogin = () => {
    return (
        <div className='w-full bg-white items-center text-sm justify-center min-h-screen text-black px-5'>
            {/* TITLE */}
            <div className="px-5 pt-24 text-center">
                <h1 className='text-xl font-medium'>Masuk ke Akun Anda</h1>
                <p className='font-normal text-gray-600'>Masukkan username dan password login!</p>
            </div>

            {/* FORM LOGIN */}
            <div className="pt-12">
                <form> 
                    <div className="mb-4 flex flex-col items-start ">
                        <label htmlFor="username" className='font-semibold mb-2'>Username</label>
                        <input
                            required
                            type="text"
                            placeholder='Masukkan Username'
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className="mb-8 flex flex-col items-start">
                        <label htmlFor="password" className='font-semibold mb-2'>Password</label>
                        <input
                            required
                            placeholder='Masukkan Password'
                            type="password"
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                </form>
            </div>
            {/* BUTTON */}
            <Button title={'Masuk'}/>
        </div>
    )
}
