// src/api.js
import axios from 'axios';

const Login_url = 'http://localhost:5000/api/users'; // Ganti dengan URL backend Anda
const Transaksi_url = 'http://localhost:5000/api/transaksi';  // URL API untuk transaksi
const Pengeluaran_url = 'http://localhost:5000/api/expanse';
// Fungsi login
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${Login_url}/login`, {
      name: username,
      password: password,
    });
    return response.data; // return data jika berhasil
  } catch (error) {
    throw error; // throw error jika gagal
  }
};

// Fungsi untuk register (Jika diperlukan)
export const registerUser = async (name, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name, email, password, role
    });
    return response.data; // return data jika berhasil
  } catch (error) {
    throw error; // throw error jika gagal
  }
};

// Fungsi untuk menambahkan transaksi baru
export const addTransaction = async (transactionData) => {
  try {
    const response = await axios.post(Transaksi_url, transactionData, {
      headers: {
        'Content-Type': 'application/json',  // Kirim data sebagai JSON
      },
    });
    return response;  // Mengembalikan response dari server jika berhasil
  } catch (error) {
    throw error;  // Jika gagal, lempar error
  }
};

export const getTransactions = async () => {
    try {
      const response = await axios.get(Transaksi_url);
      return response.data;  // Mengembalikan data transaksi dari server
    } catch (error) {
      throw error;  // Jika gagal, lempar error
    }
  };

  //pengeluaran
  export const getPengeluaran = async () => {
    try {
      const response = await axios.get(Pengeluaran_url);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const addExpanse = async(expanseData) => {
    try {
      const response = await axios.post(Pengeluaran_url, expanseData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

