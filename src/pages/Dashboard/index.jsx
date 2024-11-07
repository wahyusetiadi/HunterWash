import React from "react";

// asset
import IncomeLogo from "../../assets/income.svg";
import ExportLogo from "../../assets/export.svg";
import BikeLogo from "../../assets/bike.svg";
import { Navigation } from "../../components/organisms/Navigation";
import { Card } from "../../components/atoms/Card";
import { CardIcon } from "../../components/molecules/CardIcon";
import { Date } from "../../components/organisms/Date";

export const Dashboard = () => {
  return (
    <div className="w-full h-screen bg-whitew-full bg-slate-50 items-center text-sm justify-center min-h-screen text-black">
      {/* NAVIGATION */}
      <Navigation />

      {/* CONTENT */}
      <div className="flex flex-col w-full">
        <div className="">
          {/* INCOME */}
          {/* CARD */}
          <div className="w-full h-24 px-5">
            <div className="flex mt-4">
              <div className="flex items-center justify-start w-3/4 font-bold">
                Cabang 1 - Karang Anayar
              </div>
              <div className="flex items-center justify-end w-1/4 text-xs">
                <Date />
              </div>
            </div>
            <Card />
            <div className="flex flex-col p-2 mt-4 items-center justify-center rounded-md bg-green-100">
            <h1 className="text-2xl font-bold text-green-600">Rp 150.000</h1>
              <p className="text-sm">Pendapatan Hari ini</p>
            </div>
            <div className="flex flex-col p-2 mt-4 items-center justify-center rounded-md bg-red-100">
              <h1 className="text-2xl font-bold text-red-600">Rp 40.000</h1>
              <p className="text-sm">Pengeluaran Hari ini</p>
            </div>
            <h1 className="font-bold my-4">Daftar Menu</h1>
            <div className="text-white">
              <CardIcon
                colorbg={"bg-blue-500"}
                coloricon={"bg-white"}
                logo={BikeLogo}
                title={"Input Transaksi"}
                link={"/transaksi"}
              />
              <CardIcon
                colorbg={"bg-blue-500"}
                coloricon={"bg-white"}
                logo={IncomeLogo}
                title={"Catatan Pengeluaran"}
                link={"/catatan-pengeluaran"}
              />
              <CardIcon
                colorbg={"bg-blue-500"}
                coloricon={"bg-white"}
                logo={ExportLogo}
                title={"ExportRekap"}
                link={"/export"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
