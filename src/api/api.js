import axios from "axios";

// const BASE_URL = "https://wash.huntersmithnusantara.id/api/v1"; // Menyimpan URL dasar untuk API
const BASE_URL = import.meta.env.VITE_BASE_URL;

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
export const getTotalTransaksiHarian = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/transaksi/transaksi-hari-ini`,
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

export const getTotalTransaksiByTanggal = async (startDate, endDate, tanggal) => {
  try {
    let url = `${BASE_URL}/transaksi/transaksi-by-date`;
    const headers = getAuthHeaders();
    let params = {};

    // If both startDate and endDate are provided, use them for a date range
    if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    } 
    // If only tanggal is provided, use it for a single date
    else if (tanggal) {
      params.tanggal = tanggal;
    } else {
      // If neither startDate nor endDate is provided, set default to one month ago
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1); // Go back 1 month
      const lastMonthStartDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 1); // First date of last month
      const lastMonthEndDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 0); // Last date of last month

      // Format dates as 'YYYY-MM-DD'
      const formattedStartDate = lastMonthStartDate.toISOString().split('T')[0];
      const formattedEndDate = lastMonthEndDate.toISOString().split('T')[0];

      params.start_date = formattedStartDate;
      params.end_date = formattedEndDate;
    }

    // Send GET request with appropriate query parameters
    const response = await axios.get(url, {
      headers: headers,
      params: params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching transaksi by date or date range:", error);
    throw error;
  }
};


export const addTransaction = async (transactionData) => {
  try {
    const formData = new FormData(); // Membuat FormData untuk menyertakan file dan data lainnya

    // Menambahkan semua data transaksi lainnya ke formData
    formData.append("nomorPolisi", transactionData.nomorPolisi);
    formData.append("jenis", transactionData.jenis);
    formData.append("tipe", transactionData.tipe);
    formData.append("biaya", transactionData.biaya);
    formData.append("petugas", transactionData.petugas);
    formData.append("cabang", transactionData.cabang);

    // Menambahkan gambar jika ada
    if (transactionData.image) {
      // Jika gambar ada, konversikan data URI menjadi Blob
      const imageFile = dataURItoBlob(transactionData.image);
      formData.append("gambar", imageFile, "capturedImage.jpg");
    }

    // Mengirim data ke server
    const response = await axios.post(
      `${BASE_URL}/transaksi`, // URL API
      formData, // Kirim formData yang berisi data transaksi dan gambar
      {
        headers: {
          ...getAuthHeaders(), // Auth header (jika diperlukan)
          "Content-Type": "multipart/form-data", // Set header untuk multipart/form-data
        },
      }
    );

    return response; // Mengembalikan response dari server jika berhasil
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error; // Jika gagal, lempar error
  }
};

// Fungsi untuk mengonversi Data URI (gambar) ke Blob
const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([intArray], { type: mimeString });
};

// GET
export const getTransactions = async (petugas, tanggalAwal, tanggalAkhir) => {
  try {
    const response = await axios.get(`${BASE_URL}/transaksi`, {
      headers: getAuthHeaders(),
      params: { petugas, tanggalAwal, tanggalAkhir }, // Menambahkan filter ke query params
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

export const deleteTransaction = async (id) => {
  if (!id) {
    console.error("ID tidak valid:", id);
    return;
  }
  try {
    const response = await axios.delete(`${BASE_URL}/transaksi/${id}`, {
      headers: getAuthHeaders(),
    });
    console.log("Response after delete:", response);
    return response;
  } catch (error) {
    console.error("Error delete transactions:", error);
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
  if (!id) {
    console.error("ID tidak ditemukan", id);
    return;
  }

  try {
    const response = await axios.delete(`${BASE_URL}/biaya/${id}`, {
      headers: getAuthHeaders(),
    });
    console.log("Response after delete", response);
    return response;
  } catch (error) {
    console.error("Error delete biaya", error);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/transaksi/leaderboard`, {
      headers: getAuthHeaders(), // Pastikan Anda mengirimkan header autentikasi yang benar
    });
    return response.data; // Langsung ambil data dari response
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error; // Lempar error jika gagal
  }
};
