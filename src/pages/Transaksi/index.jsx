import React, { useEffect, useState } from "react";
import { CardIcon } from "../../components/molecules/CardIcon";
import { Navigation } from "../../components/organisms/Navigation";
import BikeLogo from "../../assets/bike.svg";
import {
  addTransaction,
  getBiaya,
  getCabangOptions,
  getUser,
} from "../../api/api";
import CameraCapture from "../../components/organisms/Cam";

export const Transaksi = () => {
  const [nomorPolisi, setNomorPolisi] = useState("");
  const [tipe, setTipe] = useState("");
  const [biaya, setBiaya] = useState("");
  const [cabang, setCabang] = useState("");
  const [petugas, setPetugas] = useState("");
  const [jenisOption, setJenisOption] = useState("Pilih Jenis Kendaraan"); // Default value set here
  const [biayaOption, setBiayaOption] = useState("");
  const [petugasOption, setPetugasOption] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedCabang, setSelectedCabang] = useState("");
  const [isCost, setIsCost] = useState([]);
  const [isCabang, setIsCabang] = useState([]);
  const [cabangOption, setCabangOption] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    const fetchCabang = async () => {
      try {
        const data = await getCabangOptions();
        const filteredCabang = data.filter(
          (branch) => branch.cabang !== "pusat"
        );
        setIsCabang(filteredCabang);

        const branches = filteredCabang.map((branch) => branch.cabang);
        const uniqueBranches = [...new Set(branches)];
        const sortedBranch = uniqueBranches.sort((a, b) => a.localeCompare(b));
        setCabangOption(sortedBranch);
      } catch (error) {
        console.error("Error fetching cabang", error);
      }
    };

    const fetchingBiaya = async () => {
      try {
        const cost = await getBiaya();
        setIsCost(cost.data.biaya);
      } catch (error) {
        console.error("Error fetching getBiaya", error);
      }
    };

    fetchingBiaya();
    fetchUser();
    fetchCabang();
  }, []);

  const handleBiayaOption = (e) => {
    setBiayaOption(e.target.value);
    if (e.target.value !== "lainnya") {
      setBiaya("");
    }
  };

  const handleCabangOption = (e) => {
    setSelectedCabang(e.target.value);
  };

  const handleJenisOption = (e) => {
    setJenisOption(e.target.value); // Update state with the selected option (Motor or Mobil)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Nomor Polisi:", nomorPolisi);
    console.log("Jenis:", jenisOption);
    console.log("Tipe:", tipe);
    console.log("Biaya Option:", biayaOption);
    console.log("Biaya Input:", biaya);
    console.log("Petugas Option:", petugasOption);
    console.log("Cabang Option:", cabangOption);

    // Validasi Form: Pastikan semua field terisi dengan benar
    if (!nomorPolisi || !tipe) {
      alert("Nomor Polisi dan Jenis Kendaraan harus diisi!");
      return;
    }

    if (jenisOption === "Pilih Jenis Kendaraan" || !jenisOption) {
      alert("Pilih Jenis Kendaraan");
      return;
    }

    if (biayaOption === "Pilih Biaya" || !biayaOption) {
      alert("Biaya harus dipilih!");
      return;
    }

    if (biayaOption === "lainnya" && (!biaya || isNaN(biaya))) {
      alert("Biaya harus berupa angka!");
      return;
    }

    if (!selectedCabang) {
      alert("Cabang harus dipilih!");
      return;
    }

    const finalBiaya = biayaOption === "lainnya" ? biaya : biayaOption;
    const finalPetugas = user?.name || petugasOption[0];

    const transactionData = {
      nomorPolisi,
      jenis: jenisOption,
      tipe,
      biaya: finalBiaya,
      petugas: finalPetugas,
      cabang: selectedCabang,
      image: capturedImage,
    };

    try {
      const response = await addTransaction(transactionData);
      console.log("Transaksi berhasil ditambahkan", response.data);
      alert("Data Transaksi telah berhasil dikirim!");

      // Reset form setelah submit
      setNomorPolisi("");
      setTipe("");
      setBiaya("");
      setCabang("");
      setCabangOption("");
      setPetugas("");
      setJenisOption("Pilih Jenis Kendaraan"); // Reset to default value
      setBiayaOption("");
      setPetugasOption([]);
      setCapturedImage(null);
    } catch (error) {
      console.error("Error saat menambahkan transaksi:", error);
      alert(error.response?.data?.message || "Gagal mengirim data transaksi!");
    }
  };

  const isFormValid =
    nomorPolisi &&
    jenisOption &&
    tipe &&
    biayaOption !== "Pilih Biaya" &&
    (biayaOption !== "lainnya" || (biayaOption === "lainnya" && biaya)) &&
    cabangOption !== "Pilih Cabang" &&
    petugasOption !== "Pilih Petugas"
    // capturedImage;

  const handleSaveImage = (imageUrl) => {
    setCapturedImage(imageUrl);
  };

  return (
    <div className="w-full bg-slate-50">
      <Navigation />
      <div className="my-4 px-5">
        <CardIcon
          colorbg={"bg-white"}
          coloricon={"bg-slate-50"}
          logo={BikeLogo}
          title={"Input Transaksi"}
          subtitle={"Pencatatan Setiap Transaksi Pencucian Motor"}
        />
      </div>
      <div className="px-5 text-sm">
        <form onSubmit={handleSubmit}>
          {/* Nomor Polisi */}
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="nomorPolisi" className="font-semibold mb-2">
              Nomor Polisi
            </label>
            <input
              required
              type="text"
              placeholder="DAXXXX00"
              value={nomorPolisi}
              onChange={(e) => setNomorPolisi(e.target.value)}
              className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Jenis Kendaraan */}
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="" className="font-semibold mb-2">
              Jenis Kendaraan
            </label>
            <select
              required
              value={jenisOption}
              onChange={handleJenisOption} // handleJenisOption function for updating state
              className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Jenis Kendaraan</option>
              <option value="Motor">Motor</option>
              <option value="Mobil">Mobil</option>
            </select>
          </div>

          {/* Tipe Kendaraan */}
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="tipe" className="font-semibold mb-2">
              Tipe Kendaraan
            </label>
            <input
              required
              type="text"
              placeholder="Masukkan Jenis Kendaraan"
              value={tipe}
              onChange={(e) => setTipe(e.target.value)}
              className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Biaya */}
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="biaya" className="font-semibold mb-2">
              Biaya
            </label>
            {biayaOption !== "lainnya" ? (
              <select
                required
                value={biayaOption}
                onChange={handleBiayaOption}
                className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pilih Biaya">Pilih Biaya</option>
                {isCost.map((item) => (
                  <option key={item.biaya} value={item.biaya}>
                    {item.biaya}
                  </option>
                ))}
                <option value="lainnya">Masukkan Biaya</option>
              </select>
            ) : (
              <input
                required
                type="number"
                placeholder="Masukkan Biaya"
                value={biaya}
                onChange={(e) => setBiaya(e.target.value)}
                className="w-full mt-4 px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Cabang */}
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="cabang" className="font-semibold mb-2">
              Cabang
            </label>
            <select
              required
              value={selectedCabang}
              onChange={handleCabangOption}
              className="w-full mt-4 px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Cabang</option>
              {cabangOption.length > 0 ? (
                cabangOption.map((cabang, index) => (
                  <option key={index} value={cabang}>
                    {cabang}
                  </option>
                ))
              ) : (
                <></>
              )}
            </select>
          </div>
          <CameraCapture onSave={handleSaveImage} />
          {/* Petugas */}
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="petugas" className="font-semibold mb-2">
              Petugas
            </label>
            <input
              type="text"
              placeholder={user?.name}
              className="w-full mt-4 px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <button
            disabled={!isFormValid}
            type="submit"
            className={`w-full py-2 px-4 mb-6 text-white rounded-lg focus:outline-none ${
              isFormValid ? "bg-blue-500" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Kirim Transaksi
          </button>
        </form>
      </div>
    </div>
  );
};
