import React, { useState } from "react";
import { CardIcon } from "../../components/molecules/CardIcon";
import { Navigation } from "../../components/organisms/Navigation";
import BikeLogo from "../../assets/bike.svg";
import { addTransaction } from "../../api/api"; 

export const Transaksi = () => {
  const [nomorPolisi, setNomorPolisi] = useState("");
  const [jenisKendaraan, setJenisKendaraan] = useState("");
  const [biaya, setBiaya] = useState("");
  const [petugas, setPetugas] = useState("");
  const [biayaOption, setBiayaOption] = useState("");
  const [petugasOption, setPetugasOption] = useState("");

  const handleBiayaOption = (e) => {
    setBiayaOption(e.target.value);
    if (e.target.value !== "lainnya") {
      setBiaya(""); 
    }
  };

  const handlePetugasOption = (e) => {
    setPetugasOption(e.target.value);
    if (e.target.value !== "lainnya") {
      setPetugas("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Nomor Polisi:", nomorPolisi);
    console.log("Jenis Kendaraan:", jenisKendaraan);
    console.log("Biaya Option:", biayaOption);
    console.log("Biaya Input:", biaya);
    console.log("Petugas Option:", petugasOption);
    console.log("Petugas Input:", petugas);

    if (!nomorPolisi || !jenisKendaraan || (!biaya && biayaOption === "") || (!petugas && petugasOption === "")) {
      alert("Semua field harus diisi!");
      return;
    }
    
    if (biayaOption === "lainnya" && isNaN(biaya)) {
      alert("Biaya harus berupa angka!");
      return;
    }

    const finalBiaya = biayaOption === "lainnya" ? biaya : biayaOption;
    const finalPetugas = petugasOption === "lainnya" ? petugas : petugasOption;

    try {
      const response = await addTransaction({
        nomorPolisi,
        jenisKendaraan,
        biaya: finalBiaya, 
        petugas: finalPetugas, 
      });

      console.log("Transaksi berhasil ditambahkan", response.data);
      alert("Data Transaksi telah berhasil dikirim!");

      // Reset form setelah submit
      setNomorPolisi("");
      setJenisKendaraan("");
      setBiaya("");
      setPetugas("");
      setBiayaOption("");
      setPetugasOption("");
    } catch (error) {
      console.error("Error saat menambahkan transaksi:", error);
      alert(error.response?.data?.message || "Gagal mengirim data transaksi!");
    }
  };

  // Validasi form untuk menonaktifkan tombol jika ada field yang kosong
  const isFormValid =
    nomorPolisi &&
    jenisKendaraan &&
    (biayaOption !== "Pilih Biaya" && (biayaOption !== "lainnya" || (biayaOption === "lainnya" && biaya))) &&
    (petugasOption !== "Pilih Petugas" && (petugasOption !== "lainnya" || (petugasOption === "lainnya" && petugas)));

  console.log("Form Valid:", isFormValid);

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

          {/* Jenis/Tipe Kendaraan */}
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="jenisKendaraan" className="font-semibold mb-2">
              Jenis/ Tipe Kendaraan
            </label>
            <input
              required
              type="text"
              placeholder="Masukkan Jenis Kendaraan"
              value={jenisKendaraan}
              onChange={(e) => setJenisKendaraan(e.target.value)}
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
                <option value="15000">15000</option>
                <option value="20000">20000</option>
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

          {/* Petugas */}
          <div className="mb-4 flex flex-col items-start">
            <label htmlFor="petugas" className="font-semibold mb-2">
              Petugas
            </label>
            {petugasOption !== "lainnya" ? (
              <select
                required
                value={petugasOption}
                onChange={handlePetugasOption}
                className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pilih Petugas">Pilih Petugas</option>
                <option value="Mamat">Mamat</option>
                <option value="Bejo">Bejo</option>
                <option value="lainnya">Lainnya</option>
              </select>
            ) : (
              <input
                required
                type="text"
                placeholder="Masukkan Nama Petugas"
                value={petugas}
                onChange={(e) => setPetugas(e.target.value)}
                className="w-full mt-4 px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Tombol Tambah Transaksi */}
          <button
            type="submit"
            className={`w-full py-3 mt-4 text-white rounded-lg ${isFormValid ? "bg-blue-500" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!isFormValid}
          >
            Tambah Transaksi
          </button>
        </form>
      </div>
    </div>
  );
};
