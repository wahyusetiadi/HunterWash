import React, { useEffect, useState } from "react";
import IncomeLogo from "../../assets/income.svg";
import { Navigation } from "../../components/organisms/Navigation";
import { Button } from "../../components/atoms/Button";
import { CardIcon } from "../../components/molecules/CardIcon";
import { InputField } from "../../components/molecules/InputFiled";
import { addExpanse, getCabangOptions, getUser } from "../../api/api";

export const Pengeluaran = () => {
  const [keperluan, setKeperluan] = useState("");
  const [biaya, setBiaya] = useState("");
  const [petugas, setPetugas] = useState("");
  const [petugasOption, setPetugasOption] = useState([]);
  const [user, setUser] = useState(null);
  // const [selectedPetugas, setSelectedPetugas] = useState([]);
  const [selectedCabang, setSelectedCabang] = useState("");
  const [cabangOption, setCabangOption] = useState("");

  useEffect(() => {
    const fetchUserAndPetugas = async () => {
      try {
        const userData = await getUser();
        setUser(userData);

        // const petugasData = await getCabangOptions();
        // const filterPetugas = petugasData.filter((petugas) => petugas.cabang === userData.cabang);
        // const petugasNames = filterPetugas.map((petugas) => petugas.name);
        // setSelectedPetugas(petugasNames);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    const fetchCabang = async () => {
      try {
        const data = await getCabangOptions();
        const filteredCabang = data.filter(branch => branch.cabang !== "pusat");

        const branches = filteredCabang.map(branch => branch.cabang);
        const uniqueBranches = [...new Set(branches)];
        const sortedBranch = uniqueBranches.sort((a, b) => a.localeCompare(b));
        setCabangOption(sortedBranch);
      } catch (error) {
        console.error("Error fetching Cabang", error);

      }
    }

    fetchCabang();
    fetchUserAndPetugas();
  }, [])

  // const handlePetugasOption = (e) => {
  //   setPetugasOption(e.target.value);
  //   if (e.target.value !== "lainnya") {
  //     setPetugas("");
  //   }
  // };

  const handleCabangOption = (e) => {
    setSelectedCabang(e.target.value);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Keperluan", keperluan);
    console.log("biaya", biaya);
    console.log("petugas", petugas)



    if (!keperluan || !biaya) {
      alert("keperluan dan biaya harus diisi!");
      return;
    }

    if (!petugas && petugasOption === 0 && !user.name) {
      alert("petugas harus dipilih")
    }

    if (cabangOption.length === 0 || !selectedCabang) {
      alert("Cabang Harus dipilih")
    }

    // const finalPetugas = petugasOption === "lainnya" ? petugas : petugasOption;
    const finalPetugas = user?.name;

    try {
      const response = await addExpanse({
        keperluan,
        biaya,
        petugas: finalPetugas,
        cabang: selectedCabang,
      });

      console.log("Traksaksi pengeluaran berhasil ditambahkan", response.data);
      alert("Data Pengeluaran berhasil ditambahkan!");

      setKeperluan("");
      setBiaya("");
      setPetugas("");
      setPetugasOption("");
      setCabangOption("");
    } catch (error) {
      console.error("Error saat menambahkan pengeluaran", error);
      alert("Gagal mengirim data pengeluaran!");
    }
  };

  const isFormValid =
    keperluan &&
    biaya &&
    cabangOption !== "Pilih Cabang" &&
    petugasOption !== "Pilih Petugas" &&
    (petugasOption !== "lainnya" || (petugasOption === "lainnya" && petugas)
  );

  // console.log("Form Valid:", isFormValid);

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
            label={"Biaya"}
            caption={"Contoh: 15000 (Hanya Angka)"}
            placeholder={"Masukkan Biaya"}
            type={"text"}
            value={biaya}
            onChange={(e) => setBiaya(e.target.value)}
          />
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
                  <option key={index} value={cabang}>{cabang}</option>
                ))
              ) : (
                <></>
              )}
              {/* {isCabang.map((item) => (
                <option key={item.cabang} value={item.cabang}>{item.cabang}</option>
              ))} */}
            </select>
          </div>
          <div></div>
          {/* inputfiled dropdown atau accordion */}
          <div className="mb-4 flex flex-col items-start ">
            <label htmlFor="username" className="font-semibold mb-2">
              Petugas yang Memerlukan Dana
            </label>
            <input type="text"
              placeholder={user?.name}
              className="w-full mt-4 px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled />
            {/*
            {petugasOption !== "lainnya" ? (
              <select
                required
                value={petugasOption}
                onChange={handlePetugasOption}
                className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pilih Petugas">Pilih Petugas</option>
                {selectedPetugas.map((petugas, index) => (
                  <option key={index} value={petugas}>{petugas}</option>
                ))}
                {/* <option value={user?.name}>{user?.name}</option> 
                <option value="lainnya">Lainnya</option>
              </select>
            ) : (
              <input
                required
                type="text"
                value={petugas}
                onChange={(e) => setPetugas(e.target.value)}
                placeholder="Pilih Petugas"
                className="w-full px-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            */}
          </div>
          <div className="pt-4">
            <Button title={"Simpan"} />
          </div>
        </form>
      </div>
    </div>
  );
};
