import React, { useState, useEffect } from "react";
import { Navigation } from "../../components/organisms/Navigation";
import { getTransactions } from "../../api/api";

export const FeeKaryawan = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [totalSaldoBersih, setTotalSaldoBersih] = useState(0);
  const [petugas, setPetugas] = useState("");
  const [petugasList, setPetugasList] = useState([]); // Menyimpan daftar petugas
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data transaksi dan ekstrak daftar petugas
  useEffect(() => {
    const fetchPetugasAndTransactions = async () => {
      setLoading(true);
      try {
        // Mengambil data transaksi dari API
        const data = await getTransactions(petugas, tanggalAwal, tanggalAkhir);

        // Menyaring petugas yang unik
        const petugasSet = new Set(data.map((transaksi) => transaksi.petugas));
        setPetugasList([...petugasSet]);

        // Menyimpan data transaksi dan menghitung total saldo bersih
        setTransaksi(data);
        const total = data.reduce((acc, transaksi) => {
          // Menghitung saldo bersih dengan pembulatan ke ribuan terdekat
          const saldoBersih =
            transaksi.biaya !== null
              ? Math.round(transaksi.biaya / 3 / 1000) * 1000
              : 0;
          return acc + saldoBersih; // Menambahkan saldo bersih per transaksi
        }, 0);
        const formattedTotalPendapatan = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(total);

        setTotalSaldoBersih(formattedTotalPendapatan);
      } catch (err) {
        setError("Gagal mengambil data transaksi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPetugasAndTransactions();
  }, [petugas, tanggalAwal, tanggalAkhir]);

  const handlePetugasChange = (e) => {
    setPetugas(e.target.value);
  };

  const handleTanggalAwalChange = (e) => {
    setTanggalAwal(e.target.value);
  };

  const handleTanggalAkhirChange = (e) => {
    setTanggalAkhir(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navigation />
      <div className="my-4 px-5">
        <div className="flex flex-col p-2 mt-4 text-center rounded-md bg-blue-100">
          <h1 className="text-base font-bold text-black">Fee Karyawan</h1>
        </div>

        {/* Filter Form */}
        <div className="my-4 text-sm">
          <label htmlFor="petugas" className="mr-2">
            Petugas:{" "}
          </label>
          <select
            id="petugas"
            value={petugas}
            onChange={handlePetugasChange}
            className="p-2 border rounded-md"
          >
            <option value="">Pilih Petugas</option>
            {petugasList.map((petugasItem, index) => (
              <option key={index} value={petugasItem}>
                {petugasItem}
              </option>
            ))}
          </select>
        </div>
        <div className="my-4 flex items-center justify-cente text-sm">
          <div className="mb-4">
            <label htmlFor="tanggalAwal" className="mr-2">
              Tanggal Awal:{" "}
            </label>
            <input
              type="date"
              id="tanggalAwal"
              value={tanggalAwal}
              onChange={handleTanggalAwalChange}
              className="p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tanggalAkhir" className="mr-2">
              Tanggal Akhir:{" "}
            </label>
            <input
              type="date"
              id="tanggalAkhir"
              value={tanggalAkhir}
              onChange={handleTanggalAkhirChange}
              className="p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Total Saldo Bersih */}
        <div className="py-4 mb-4 bg-green-500 text-white rounded-lg text-center w-full items-center justify-center">
          <h2 className="text-base ">Total Saldo Bersih:
            <h1 className="font-bold text-xl">{totalSaldoBersih}</h1>
          </h2>
        </div>

        {/* Daftar Transaksi */}
        <div className="overflow-x-auto text-nowrap">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-blue-300">
              <tr>
                <th className="py-2 px-6 text-left">Nomor Polisi</th>
                <th className="py-2 px-6 text-left border-l">Jenis</th>
                <th className="py-2 px-6 text-left border-l">Tipe</th>
                <th className="py-2 px-6 text-left border-l">Biaya</th>
                <th className="py-2 px-6 text-left border-l">Saldo Bersih</th>
                <th className="py-2 px-6 text-left border-l">Petugas</th>
                <th className="py-2 px-6 text-left border-l">Tanggal</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-xs">
              {transaksi.map((transaksi) => {
                const saldoBersih =
                  transaksi.biaya !== null
                    ? Math.round(transaksi.biaya / 3 / 1000) * 1000
                    : 0;
                return (
                  <tr key={transaksi.id} className="border-b">
                    <td className="py-2 px-6 text-left">
                      {transaksi.nomorPolisi}
                    </td>
                    <td className="py-2 px-6 text-left border-l">{transaksi.jenis}</td>
                    <td className="py-2 px-6 text-left border-l">{transaksi.tipe || null}</td>
                    <td className="py-2 px-6 text-left border-l">{transaksi.biaya}</td>
                    <td className="py-2 px-6 text-left border-l">{saldoBersih}</td>
                    <td className="py-2 px-6 text-left border-l">{transaksi.petugas}</td>
                    <td className="py-2 px-6 text-left border-l">{transaksi.tanggal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
