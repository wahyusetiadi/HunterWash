import { useState, useEffect } from "react";
import { Navigation } from "../../components/organisms/Navigation";
import { getTransactions } from "../../api/api";

export const FeeKaryawan = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [totalSaldoBersih, setTotalSaldoBersih] = useState(0);
  const [cabang, setCabang] = useState(""); // State untuk cabang
  const [petugas, setPetugas] = useState(""); // State untuk petugas
  const [cabangList, setCabangList] = useState([]); // List cabang
  const [petugasList, setPetugasList] = useState([]); // List petugas yang akan difilter
  const [tanggalAwal, setTanggalAwal] = useState(""); // Start date filter
  const [tanggalAkhir, setTanggalAkhir] = useState(""); // End date filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalDepositPetugas, setTotalDepositPetugas] = useState({}); // Total deposit per petugas
  const [saldoBersihPetugas, setSaldoBersihPetugas] = useState({}); // Saldo bersih per petugas

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // Page number
  const [entriesPerPage] = useState(10); // Entries per page

  // Fetch transaksi dan set cabang list berdasarkan transaksi
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        if (!tanggalAwal || !tanggalAkhir) {
          setTotalSaldoBersih("Rp 0");
          setTotalDepositPetugas({});
          setSaldoBersihPetugas({});
          setTransaksi([]);
          setLoading(false);
          return;
        }

        // Ambil data transaksi berdasarkan petugas, tanggal, dan cabang
        const data = await getTransactions(
          petugas,
          tanggalAwal,
          tanggalAkhir,
          cabang
        );

        // Ambil daftar cabang dari data transaksi
        const cabangSet = new Set(data.map((transaksi) => transaksi.cabang));
        const sortedCabangList = [...cabangSet].sort();
        setCabangList(sortedCabangList); // Set cabang list

        // Jika cabang dipilih, filter petugas berdasarkan cabang tersebut
        if (cabang) {
          const petugasSet = new Set(
            data
              .filter((transaksi) => transaksi.cabang === cabang)
              .map((transaksi) => transaksi.petugas)
          );
          setPetugasList([...petugasSet]); // Set petugas list berdasarkan cabang yang dipilih
        } else {
          setPetugasList([]); // Jika tidak ada cabang yang dipilih, kosongkan daftar petugas
        }

        // Filter transaksi berdasarkan cabang yang dipilih (jika ada)
        const filteredTransaksi = cabang
          ? data.filter((transaksi) => transaksi.cabang === cabang)
          : data;
        setTransaksi(filteredTransaksi);

        const depositPerPetugas = {}; // To track deposit per petugas
        const saldoBersihPerPetugas = {}; // To track saldo bersih per petugas

        const total = filteredTransaksi.reduce((acc, transaksi) => {
          // Hitung saldo bersih
          const saldoBersih =
            transaksi.biaya !== null
              ? Math.round(transaksi.biaya / 3 / 1000) * 1000
              : 0;

          // Akumulasi saldo bersih per petugas
          if (saldoBersihPerPetugas[transaksi.petugas]) {
            saldoBersihPerPetugas[transaksi.petugas] += saldoBersih;
          } else {
            saldoBersihPerPetugas[transaksi.petugas] = saldoBersih;
          }

          // Hitung deposit berdasarkan jenis kendaraan
          const deposit =
            transaksi.jenis === "Motor"
              ? 1000
              : transaksi.jenis === "Mobil"
              ? 5000
              : 0;

          // Akumulasi deposit per petugas
          if (depositPerPetugas[transaksi.petugas]) {
            depositPerPetugas[transaksi.petugas] += deposit;
          } else {
            depositPerPetugas[transaksi.petugas] = deposit;
          }

          return acc + saldoBersih; // Akumulasi saldo bersih total
        }, 0);

        setTotalDepositPetugas(depositPerPetugas); // Set total deposit per petugas
        setSaldoBersihPetugas(saldoBersihPerPetugas); // Set saldo bersih per petugas

        // Format total saldo bersih tanpa desimal
        const formattedTotalPendapatan = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0, // Tanpa desimal
          maximumFractionDigits: 0, // Tanpa desimal
        }).format(total);

        setTotalSaldoBersih(formattedTotalPendapatan);
      } catch (err) {
        setError("Gagal mengambil data transaksi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [petugas, tanggalAwal, tanggalAkhir, cabang]);

  const handleCabangChange = (e) => {
    setCabang(e.target.value);
    setPetugas(""); // Reset petugas ketika cabang berubah
  };

  const handlePetugasChange = (e) => {
    setPetugas(e.target.value);
  };

  const handleTanggalAwalChange = (e) => {
    setTanggalAwal(e.target.value);
  };

  const handleTanggalAkhirChange = (e) => {
    setTanggalAkhir(e.target.value);
  };

  const paginateData = () => {
    // Calculate the index of the first and last entry of the current page
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return transaksi.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    if (
      newPage > 0 &&
      newPage <= Math.ceil(transaksi.length / entriesPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const paginatedTransaksi = paginateData();

  return (
    <div>
      <Navigation />
      <div className="my-4 px-5">
        <div className="flex flex-col p-2 mt-4 text-center rounded-md bg-blue-100">
          <h1 className="text-base font-bold text-black">Fee Karyawan</h1>
        </div>

        {/* Filter Form */}
        <div className="my-4 text-sm">
          <label htmlFor="cabang" className="mr-2">
            Cabang:{" "}
          </label>
          <select
            id="cabang"
            value={cabang}
            onChange={handleCabangChange}
            className="p-2 border rounded-md"
          >
            <option value="">Pilih Cabang</option>
            {cabangList.map((cabangItem, index) => (
              <option key={index} value={cabangItem}>
                {cabangItem}
              </option>
            ))}
          </select>
        </div>
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
        <div className="my-4 flex items-center justify-start gap-4 text-sm">
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
          <h2 className="text-base">
            Total Saldo Bersih Petugas:
            <h1 className="font-bold text-xl">{totalSaldoBersih}</h1>
          </h2>
        </div>

        {/* Daftar Transaksi */}
        <div className="overflow-x-auto text-nowrap">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-blue-400 text-sm">
              <tr>
                <th className="py-2 px-6 text-left">No</th>{" "}
                {/* Kolom untuk nomor urut */}
                <th className="py-2 px-6 text-left">Nomor Polisi</th>
                <th className="py-2 px-6 text-left border-l">Jenis</th>
                <th className="py-2 px-6 text-left border-l">Tipe</th>
                <th className="py-2 px-6 text-left border-l">Biaya</th>
                <th className="py-2 px-6 text-left border-l">Saldo Bersih</th>
                <th className="py-2 px-6 text-left border-l">Deposit</th>
                <th className="py-2 px-6 text-left border-l">Petugas</th>
                <th className="py-2 px-6 text-left border-l">Tanggal</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 text-xs">
              {paginatedTransaksi.map((transaksi, index) => {
                const saldoBersih =
                  transaksi.biaya !== null
                    ? Math.round(transaksi.biaya / 3 / 1000) * 1000
                    : 0;
                const deposit =
                  transaksi.jenis === "Motor"
                    ? 1000
                    : transaksi.jenis === "Mobil"
                    ? 5000
                    : 0;

                // Menentukan nomor urut berdasarkan halaman yang aktif
                const noUrut = (currentPage - 1) * entriesPerPage + (index + 1);

                return (
                  <tr key={transaksi.id} className="border-b">
                    <td className="py-2 px-6 text-left">
                      {noUrut} {/* Menampilkan nomor urut */}
                    </td>
                    <td className="py-2 px-6 text-left">
                      {transaksi.nomorPolisi}
                    </td>
                    <td className="py-2 px-6 text-left border-l">
                      {transaksi.jenis}
                    </td>
                    <td className="py-2 px-6 text-left border-l">
                      {transaksi.tipe || null}
                    </td>
                    <td className="py-2 px-6 text-left border-l">
                      {transaksi.biaya}
                    </td>
                    <td className="py-2 px-6 text-left border-l">
                      {saldoBersih}
                    </td>
                    <td className="py-2 px-6 text-left border-l">{deposit}</td>
                    <td className="py-2 px-6 text-left border-l">
                      {transaksi.petugas}
                    </td>
                    <td className="py-2 px-6 text-left border-l">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(transaksi.tanggal))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-l-md bg-blue-50 text-blue-500"
          >
            &lt;
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {Math.ceil(transaksi.length / entriesPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(transaksi.length / entriesPerPage)
            }
            className="px-4 py-2 border rounded-r-md bg-blue-50 text-blue-500"
          >
            &gt;
          </button>
        </div>

        {/* Saldo Bersih per Petugas */}
        <div className="w-full">
          <div className="py-4 mt-4 bg-green-100 font-bold rounded-lg text-center">
            <h2 className="text-base">Total Saldo Bersih per Petugas:</h2>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 mt-2 text-center">
            {!tanggalAwal || !tanggalAkhir ? (
              <div className="w-full text-center text-sm text-nowrap col-span-2">
                Set tanggal untuk melihat saldo bersih per petugas
              </div>
            ) : (
              Object.keys(saldoBersihPetugas).map((petugasName) =>
                cabang === "" ||
                transaksi.some(
                  (t) => t.cabang === cabang && t.petugas === petugasName
                ) ? (
                  <div
                    key={petugasName}
                    className="px-2 py-1 border-2 border-green-500 rounded-lg"
                  >
                    <p className="font-bold">{petugasName}</p>
                    <p className="text-green-500 text-warp">
                      {saldoBersihPetugas[petugasName]}
                    </p>
                  </div>
                ) : null
              )
            )}
          </div>
        </div>
        {/* Total Deposit per Petugas */}
        <div className="w-full">
          <div className="py-4 mt-4 bg-blue-100 font-bold rounded-lg text-center">
            <h2 className="text-base">Total Deposit per Petugas:</h2>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 mt-2 text-center">
            {!tanggalAwal || !tanggalAkhir ? (
              <div className="w-full text-center text-sm text-nowrap col-span-2">
                Set tanggal untuk melihat deposit petugas
              </div>
            ) : (
              Object.keys(totalDepositPetugas).map((petugasName) =>
                cabang === "" ||
                transaksi.some(
                  (t) => t.cabang === cabang && t.petugas === petugasName
                ) ? (
                  <div
                    key={petugasName}
                    className="px-2 py-1 border-2 border-green-500 rounded-lg"
                  >
                    <p className="font-bold">{petugasName}</p>
                    <p className="text-green-500 text-warp">
                      {totalDepositPetugas[petugasName]}
                    </p>
                  </div>
                ) : null
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
