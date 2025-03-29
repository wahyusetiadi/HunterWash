import React, { useState, useEffect } from "react";

const Modal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    cabang: "",
  });
  const [roleType, setRoleType] = useState("");
  const [branchItems, setBranchItems] = useState([
    "Hunter 1",
    "Hunter 2",
    "Hunter 3",
    "Hunter 4",
    "pusat",
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit(formData);
      setFormData({});
      onClose();
    } else {
      alert("Semua filed harus diisi!");
    }
  };

  useEffect(() => {
    // Update available branches based on role selection
    if (formData.role === "admin_cabang" || formData.role === "karyawan") {
      setBranchItems(["Hunter 1", "Hunter 2", "Hunter 3", "Hunter 4"]);
      // Reset cabang to default if the role is not 'admin_besar'
      if (formData.role === "karyawan" || formData.role === "admin_cabang") {
        setFormData((prevData) => ({ ...prevData, cabang: "Hunter 1" }));
      }
    } else if (formData.role === "admin_besar") {
      setBranchItems(["pusat"]);
      setFormData((prevData) => ({ ...prevData, cabang: "pusat" })); // Ensure "pusat" is selected when admin_besar
    }
  }, [formData.role]);
  

  if (!isOpen) return null;

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.role &&
    formData.cabang;

  return (
    <div
      className="fixed px-4 inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full"
        onClick={(e) => e.stopPropagation()} // Mencegah modal menutup saat diklik
      >
        <h2 className="text-xl font-semibold mb-4">Tambah Data</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan Password"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded max-md:text-xs max-md:px-2"
              required
            >
              <option value="" disabled selected>
                Pilih Role
              </option>
              <option value="admin_cabang">Admin Cabang</option>
              <option value="admin_besar">Admin Besar</option>
              <option value="karyawan">Karyawan</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Cabang
            </label>
            <select
              name="cabang"
              value={formData.cabang}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded max-md:text-xs max-md:px-2"
              required
              disabled={formData.role === "admin_besar"} // Disable cabang selection if role is admin_besar
            >
              <option value="" disabled selected>
                Pilih Penempatan Cabang
              </option>
              {branchItems.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between">
            <button
              // disabled={!isFormValid}
              type="button"
              onClick={handleSubmit}
              className={`text-white py-2 px-4 rounded-md ${isFormValid ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"} `}
            >
              {loading ? "Loading ..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Tutup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
