import axios from "axios";

// const BASE_URL = "https://wash.huntersmithnusantara.id/api/v1"; // Menyimpan URL dasar untuk API
const BASE_URL = import.meta.env.VITE_BASE_URL

// ===== Local Storage =====
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return {};
};

// ===== LOGIN POST =====
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      name: username,
      password: password,
    });
    localStorage.setItem("jwtToken", response.data.token);
    return response.data; // return data jika berhasil
  } catch (error) {
    console.error("Login error: ", error);
    throw error; // throw error jika gagal
  }
};

// ===== GET Pendapatan =====
export const getPendapatanByDate = async (tanggal) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/transaksi/pendapatan-hari-ini?tanggal=${tanggal}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data; // Mengembalikan data pendapatan dari server
  } catch (error) {
    console.error("Error fetching pendapatan by date:", error);
    throw error; // Lempar error jika gagal
  }
};

// ===== GET Cabang =====
export const getCabangOptions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cabang options:", error);
    throw error;
  }
};

// ===== TRANSAKSI =====
// GET
export const getTotalTransaksibyDate = async (tanggal) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/transaksi/transaksi-hari-ini?tanggal=${tanggal}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching transaksi by date:", error);
    throw error;
  }
};

// POST
export const addTransaction = async (transactionData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/transaksi`,
      transactionData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response; // Mengembalikan response dari server jika berhasil
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error; // Jika gagal, lempar error
  }
};

// GET
export const getTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/transaksi`, {
      headers: getAuthHeaders(),
    });
    return response.data; // Mengembalikan data transaksi dari server
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error; // Lempar error jika gagal
  }
};

// ===== PENGELUARAN =====
// GET
export const getPengeluaranbyDate = async (tanggal) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/pengeluaran/pengeluaran-hari-ini?tanggal=${tanggal}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pengeluaran by date:", error);
    throw error;
  }
};

// GET
export const getPengeluaran = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/pengeluaran`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pengeluaran:", error);
    throw error;
  }
};

// POST
export const addExpanse = async (expanseData) => {
  try {
    const response = await axios.post(`${BASE_URL}/pengeluaran`, expanseData, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error adding expanse:", error);
    throw error;
  }
};

// ===== USER =====
// GET
export const getUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/data`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// POST
export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, userData, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// ===== DELETE =====
export const deleteUser = async (id) => {
  if (!id) {
    console.error("ID tidak valid:", id);
    return; // Menghentikan fungsi jika id tidak valid
  }

  try {
    const response = await axios.delete(`${BASE_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    });
    console.log("Response after delete:", response);
    return response;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// ===== EXPORT data to EXCEL =====
// EXPORT Transaksi
export const exportTransaksi = async (cabang, fromDate, toDate) => {
  try {
    let url = `${BASE_URL}/report/transaksi/export?cabang=${cabang}`;

    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      url += `&toDate=${toDate}`;
    }

    const response = await axios.get(url, {
      headers: getAuthHeaders(),
      responseType: "blob",
    });

    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = cabang
      ? `exported_data_transaksi_${cabang}.xlsx`
      : "export_data_transaksi_all.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting transaksi data:", error);
    throw error;
  }
};

// EXPORT Pengeluaran
export const exportPengeluaran = async (cabang, fromDate, toDate) => {
  try {
    let url = `${BASE_URL}/report/pengeluaran/export?cabang=${cabang}`;

    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      url += `&toDate=${toDate}`;
    }

    const response = await axios.get(url, {
      headers: getAuthHeaders(),
      responseType: "blob",
    });

    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = cabang
      ? `exported_data_pengeluaran_${cabang}.xlsx`
      : "export_data_pengeluaran_all.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting pengeluaran data:", error);
    throw error;
  }
};


// ===== BIAYA =====

export const getBiaya = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/biaya`, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addBiaya = async (biayaData) => {
  try {
    const response = await axios.post(`${BASE_URL}/biaya`, biayaData, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error added biaya:", error);
    throw error;
  }
};

export const deleteBiaya = async (id) => {
  if(!id) {
    console.error("ID tidak ditemukan", id);
    return;
  }

  try{
    const response = await axios.delete(`${BASE_URL}/biaya/${id}`, {
      headers: getAuthHeaders(),
    });
    console.log("Response after delete", response);
    return response;
  } catch (error) {
    console.error('Error delete biaya', error);
    throw error;    
  }
};