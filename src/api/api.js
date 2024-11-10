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

// Fungsi untuk mendapatkan pendapatan berdasarkan tanggal
export const getPendapatanByDate = async (tanggal) => {
  try {
    const response = await axios.get(`${Transaksi_url}/pendapatan-hari-ini?tanggal=${tanggal}`);
    return response.data;  // Mengembalikan data pendapatan dari server
  } catch (error) {
    console.error('Error fetching pendapatan by date:', error);
    throw error;  // Lempar error jika gagal
  }
};

export const getPengeluaranbyDate = async (tanggal) => {
  try {
    const response = await axios.get(`${Pengeluaran_url}/pengeluaran-hari-ini?tanggal=${tanggal}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pengeluaran by date:', error);
    throw error;
    
  }
};

export const getTotalTransaksibyDate = async (tanggal) => {
  try {
    const response = await axios.get(`${Transaksi_url}/transaksi-hari-ini?tanggal=${tanggal}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaksi by date:', error);
    throw error;
    
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

// Fungsi untuk mendapatkan transaksi
export const getTransactions = async () => {
  try {
    const response = await axios.get(Transaksi_url);
    return response.data;  // Mengembalikan data transaksi dari server
  } catch (error) {
    throw error;  // Lempar error jika gagal
  }
};

// Fungsi untuk mendapatkan pengeluaran
export const getPengeluaran = async () => {
  try {
    const response = await axios.get(Pengeluaran_url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk menambahkan pengeluaran
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
