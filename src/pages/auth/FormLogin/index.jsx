// src/components/FormLogin/FormLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/atoms/Button';
import { loginUser } from '../../../api/api'; // Import API call dari api.js

export const FormLogin = () => {
  // State untuk menampung nilai input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State untuk error atau loading
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inisialisasi navigate dari react-router-dom
  const navigate = useNavigate();

  // Fungsi untuk menangani form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);  // Set loading true saat mengirim request
    setError(null);    // Reset error sebelum mencoba lagi

    try {
      // Menggunakan API untuk login
      const response = await loginUser(username, password);

      // Jika login sukses, simpan token dan redirect
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      }
    } catch (err) {
      // Tangani error jika login gagal
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan, silakan coba lagi!');
      }
    } finally {
      setLoading(false); // Setelah selesai, set loading ke false
    }
  };

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

          {/* Error message */}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {/* BUTTON */}
          <Button title={loading ? 'Loading...' : 'Masuk'} type="submit" disabled={loading}/>
        </form>
      </div>
    </div>
  );
};
