import React, { useState } from "react";
import ExportLogo from "../../assets/export.svg";
import { Navigation } from "../../components/organisms/Navigation";
import { Button } from "../../components/atoms/Button";
import { Table } from "../../components/organisms/Table";
import { pengeluaran } from "../../dataDummy";

export const NotePengeluaran = () => {
  return (
    <div className="w-full bg-slate-50">
      <Navigation />
      <div className="my-4 px-5">
        <div className="flex flex-col p-2 mt-4 text-center rounded-md bg-blue-100">
          <h1 className="text-base font-bold text-black">Data Pengeluaran</h1>
        </div>
      </div>
      <div className="px-5 text-sm">
        <form>
          <div className="mb-4 flex flex-col items-start ">
            <label htmlFor="username" className="font-semibold mb-2">
              Cabang
            </label>
            <select className="border p-2 rounded bg-white w-full mx-0">
              <option value="">Cabang 1</option>
              <option value="">Cabang 2</option>
            </select>
          </div>
          <div></div>
        </form>
        <div className="mt-4">
          <Table data={pengeluaran} />
        </div>
      </div>
    </div>
  );
};
