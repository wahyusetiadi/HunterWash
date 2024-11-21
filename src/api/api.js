import axios from 'axios';

const Login_url = 'http://localhost:5000/api/users'; // Ganti dengan URL backend Anda
const Transaksi_url = 'http://localhost:5000/api/transaksi';  // URL API untuk transaksi
const Pengeluaran_url = 'http://localhost:5000/api/pengeluaran';
const User_url = 'http://localhost:5000/api/users/data';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    return {
      'Authorization' : `Bearer ${token}`,
      'Content-Type' : 'application/json',
    };
  }
  return {};
};

// Login API
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${Login_url}/login`, {
      name: username,
      password: password,
    });
    localStorage.setItem('jwtToken', response.data.token)
    return response.data; // return data jika berhasil
  } catch (error) {
    throw error; // throw error jika gagal
  }
};

// GET pendapatan sesuai tanggal API
export const getPendapatanByDate = async (tanggal) => {
  try {
    const response = await axios.get(`${Transaksi_url}/pendapatan-hari-ini?tanggal=${tanggal}`, {
      headers: getAuthHeaders(),
    });
    return response.data;  // Mengembalikan data pendapatan dari server
  } catch (error) {
    console.error('Error fetching pendapatan by date:', error);
    throw error;  // Lempar error jika gagal
  }
};

//GET total transaksi(unit) sesuai tanggal API
export const getTotalTransaksibyDate = async (tanggal) => {
  try {
    const response = await axios.get(`${Transaksi_url}/transaksi-hari-ini?tanggal=${tanggal}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transaksi by date:', error);
    throw error;
    
  }
};

// POST API menambahkan transaksi
export const addTransaction = async (transactionData) => {
  try {
    const response = await axios.post(Transaksi_url, transactionData, {
      headers: getAuthHeaders(),
    });
    return response;  // Mengembalikan response dari server jika berhasil
  } catch (error) {
    throw error;  // Jika gagal, lempar error
  }
};

// GET semua transaksi API 
export const getTransactions = async () => {
  try {
    const response = await axios.get(Transaksi_url, {
      headers: getAuthHeaders(),
    });
    return response.data;  // Mengembalikan data transaksi dari server
  } catch (error) {
    throw error;  // Lempar error jika gagal
  }
};

// GET API pengeluaran sesuai tanggal
export const getPengeluaranbyDate = async (tanggal) => {
  try {
    const response = await axios.get(`${Pengeluaran_url}/pengeluaran-hari-ini?tanggal=${tanggal}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pengeluaran by date:', error);
    throw error;
    
  }
};

// GET API semua pengeluaran
export const getPengeluaran = async () => {
  try {
    const response = await axios.get(Pengeluaran_url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST API menambah pengeluaran
export const addExpanse = async(expanseData) => {
  try {
    const response = await axios.post(Pengeluaran_url, expanseData, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// GET user ketika login
export const getUser = async() => {
  try {
    const response = await axios.get(User_url, {
      headers : getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET data transaksi ke Excel
export const exportTransaksi = async(cabang, fromDate, toDate) => {
  try {
    // let url = cabang ? `http://localhost:5000/api/report/transaksi/export?cabang=${cabang}` :
    // 'http://localhost:5000/api/report/transaksi/export';
    let url = `http://localhost:5000/api/report/transaksi/export?cabang=${cabang}`;

    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      url += `&toDate=${toDate}`;
    }

    const response = await axios.get(url, {
      headers : getAuthHeaders(),
      responseType : 'blob',
    });

    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = cabang ? `exported_data_transaksi_${cabang}.xlsx` : 'export_data_transaksi_all.xlsx';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.error('Error Export data', error);
    throw error;    
  }
};

// GET data pengeluaran ke Excel
export const exportPengeluaran = async(cabang, fromDate, toDate) => {
  try {
    let url = `http://localhost:5000/api/report/pengeluaran/export?cabang=${cabang}`;

    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      url += `&toDate=${toDate}`;
    }

    const response = await axios.get(url, {
      headers : getAuthHeaders(),
      responseType : 'blob',
    });

    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = cabang ? `exported_data_pengeluaran_${cabang}.xlsx` : 'export_data_pengeluaran_all.xlsx';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.error('Error Export data', error);
    throw error;    
  }
};


export const getCabangOptions = async () => {
  try {
    const response = await axios.get(Login_url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}