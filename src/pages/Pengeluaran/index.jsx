import React, { useState } from "react";
import IncomeLogo from "../../assets/income.svg";
import { Navigation } from "../../components/organisms/Navigation";
import { Button } from "../../components/atoms/Button";
import { CardIcon } from "../../components/molecules/CardIcon";
import { InputField } from "../../components/molecules/InputFiled";
import { addExpanse } from "../../api/api";

export const Pengeluaran = () => {
  const [keperluan, setKeperluan] = useState("");
  const [nominal, setNominal] = useState("");
  const [petugas, setPetugas] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!keperluan || !nominal || !petugas) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await addExpanse({
        keperluan,
        nominal,
        petugas,
      });

      console.log("Traksaksi pengeluaran berhasil ditambahkan", response.data);
      alert("Data Pengeluaran berhasil ditambahkan!");

      setKeperluan("");
      setNominal("");
      setPetugas("");
    } catch (error) {
      console.error("Error saat menambahkan pengeluaran", error);
      alert("Gagal mengirim data pengeluaran!");
    }
  };
  return (
    <div className="w-full bg-slate-50">
      <Navigation />
      <div className="my-4 px-5">
        <CardIcon
          colorbg={"bg-white"}
          coloricon={"bg-slate-100"}
          logo={IncomeLogo}
          title={"Catat Pengeluaran"}
          subtitle={"Pencatatan setiap Pengeluaran oleh Petugas"}
        />
      </div>
      <div className="px-5 text-sm">
        <form onSubmit={handleSubmit}>
          <InputField 
          label={"Keperluan"} 
          placeholder={"Masukkan Keperluan"} 
          value={keperluan}
          onChange={(e) => setKeperluan(e.target.value)}
          />
          <InputField
            label={"Nominal"}
            caption={"Contoh: 15000 (Hanya Angka)"}
            placeholder={"Masukkan Nominal"}
            type={"text"}
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
          />

          <div></div>
          {/* inputfiled dropdown atau accordion */}
          <div className="mb-4 flex flex-col items-start ">
            <label htmlFor="username" className="font-semibold mb-2">
              Petugas yang Memerlukan Dana
            </label>
            <input
              required
              type="text"
              value={petugas}
              onChange={(e) => setPetugas(e.target.value)}
              placeholder="Pilih Petugas"
              className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="pt-4">
            <Button title={"Simpan"} />
          </div>
        </form>
      </div>
    </div>
  );
};
