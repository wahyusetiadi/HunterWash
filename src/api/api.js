// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users'; // Ganti dengan URL backend Anda

// Fungsi login
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
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
