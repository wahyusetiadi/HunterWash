import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/atoms/Button'

export const FormLogin = () => {
    // State untuk menampung nilai input
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    // Inisialisasi navigate dari react-router-dom
    const navigate = useNavigate()

    // Fungsi untuk menangani form submit
    const handleSubmit = (event) => {
        event.preventDefault()

        // Dummy validation untuk username dan password
        if (username === 'admin' && password === 'admin123') {
            // Jika login sukses, redirect ke /dashboard
            navigate('/dashboard')
        } else {
            // Jika gagal, Anda bisa menampilkan pesan error (opsional)
            alert('Username atau password salah!')
        }
    }

    return (
        <div className='w-full bg-white items-center text-sm justify-center min-h-screen text-black px-5'>
            {/* TITLE */}
            <div className="px-5 pt-24 text-center">
                <h1 className='text-xl font-medium'>Masuk ke Akun Anda</h1>
                <p className='font-normal text-gray-600'>Masukkan username dan password login!</p>
            </div>

            {/* FORM LOGIN */}
            <div className="pt-12">
                <form onSubmit={handleSubmit}> 
                    <div className="mb-4 flex flex-col items-start">
                        <label htmlFor="username" className='font-semibold mb-2'>Username</label>
                        <input
                            required
                            type="text"
                            placeholder='Masukkan Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className="mb-8 flex flex-col items-start">
                        <label htmlFor="password" className='font-semibold mb-2'>Password</label>
                        <input
                            required
                            type="password"
                            placeholder='Masukkan Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    {/* BUTTON */}
                    <Button title={'Masuk'} type="submit"/>
                </form>
            </div>
        </div>
    )
}
