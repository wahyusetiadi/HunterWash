import React, { useState } from 'react';
import { CardIcon } from '../../components/molecules/CardIcon';
import { Navigation } from '../../components/organisms/Navigation';
import BikeLogo from '../../assets/bike.svg';
// Hapus import Camera karena upload foto tidak digunakan sementara
// import Camera from '../../components/molecules/FileUpload';
import { addTransaction } from '../../api/api'; // Impor fungsi API untuk menambahkan transaksi

export const Transaksi = () => {
    // State untuk menangani data form
    const [nomorPolisi, setNomorPolisi] = useState('');
    const [jenisKendaraan, setJenisKendaraan] = useState('');
    const [harga, setHarga] = useState('');
    const [petugas, setPetugas] = useState('');

    // Fungsi untuk menangani pengiriman data form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi form untuk memastikan semua field terisi
        if (!nomorPolisi || !jenisKendaraan || !harga || !petugas) {
            alert('Semua field harus diisi!');
            return;
        }

        // Kirim data ke backend menggunakan API (axios)
        try {
            const response = await addTransaction({
                nomorPolisi,
                jenisKendaraan,
                harga,
                petugas
            });

            console.log('Transaksi berhasil ditambahkan', response.data);
            alert('Data Transaksi telah berhasil dikirim!');

            // Reset form setelah submit
            setNomorPolisi('');
            setJenisKendaraan('');
            setHarga('');
            setPetugas('');
        } catch (error) {
            console.error('Error saat menambahkan transaksi:', error);
            alert('Gagal mengirim data transaksi!');
        }
    };

    return (
        <div className="w-full bg-slate-50">
            <Navigation />
            <div className="my-4 px-5">
                <CardIcon
                    colorbg={'bg-white'}
                    coloricon={'bg-slate-50'}
                    logo={BikeLogo}
                    title={'Input Transaksi'}
                    subtitle={'Pencatatan Setiap Transaksi Pencucian Motor'}
                />
            </div>
            <div className="px-5 text-sm">
                <form onSubmit={handleSubmit}>
                    {/* Nomor Polisi */}
                    <div className="mb-4 flex flex-col items-start">
                        <label htmlFor="nomorPolisi" className="font-semibold mb-2">Nomor Polisi</label>
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
                        <label htmlFor="jenisKendaraan" className="font-semibold mb-2">Jenis/ Tipe Kendaraan</label>
                        <input
                            required
                            type="text"
                            placeholder="Masukkan Jenis Kendaraan"
                            value={jenisKendaraan}
                            onChange={(e) => setJenisKendaraan(e.target.value)}
                            className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Harga */}
                    <div className="mb-4 flex flex-col items-start">
                        <label htmlFor="harga" className="font-semibold mb-2">Harga</label>
                        <input
                            required
                            type="text"
                            placeholder="Pilih Harga"
                            value={harga}
                            onChange={(e) => setHarga(e.target.value)}
                            className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Petugas */}
                    <div className="mb-4 flex flex-col items-start">
                        <label htmlFor="petugas" className="font-semibold mb-2">Petugas</label>
                        <input
                            required
                            type="text"
                            placeholder="Pilih Petugas"
                            value={petugas}
                            onChange={(e) => setPetugas(e.target.value)}
                            className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Tombol Tambah Transaksi */}
                    <button
                        type="submit"
                        className={`w-full py-3 mt-4 ${!nomorPolisi || !jenisKendaraan || !harga || !petugas ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'} text-white rounded-lg hover:bg-blue-600`}
                        disabled={!nomorPolisi || !jenisKendaraan || !harga || !petugas}
                    >
                        Tambah Transaksi
                    </button>
                </form>
            </div>
        </div>
    );
};
