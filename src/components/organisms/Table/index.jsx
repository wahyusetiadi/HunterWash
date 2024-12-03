import React, { useState } from "react";
// import Modal from "../ModalForm";

function toTitleCaseWithSpace(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export const Table = ({
  data,
  filterData = true,
  itemsPerPage = 5,
  showDeleteButton = false,
  onDelete,
  showAddButton = false,
  onClickAdd,
  onAdd,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltered, setShowFiltered] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter data berdasarkan tanggal jika showFiltered true
  const filterDataFn = showFiltered
    ? data.filter((item) => {
        const itemDate = new Date(item.tanggal);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        return (!start || itemDate >= start) && (!end || itemDate <= end);
      })
    : data;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterDataFn.slice(indexOfFirstItem, indexOfLastItem);
  const totalPage = Math.ceil(filterDataFn.length / itemsPerPage);

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to convert text to Title Case
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Dapatkan nama kolom berdasarkan data pertama, kecuali 'id'
  const columns = Object.keys(data[0] || {}).filter((key) => key !== "id");

  const handleDelete = (id) => {
    console.log("ID: yang akan dihapus:", id);
    
    if (onDelete) {
      onDelete(id); // Memanggil callback onDelete yang diterima sebagai props
    }
  };

  return (
    <div>
      {/* Conditionally render the filter inputs */}
      {filterData && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-start">
              <label className="font-semibold mb-2">Dari tanggal</label>
              <input
                type="date"
                className="w-full p-1 border bg-white rounded-lg focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start">
              <label className="font-semibold mb-2">Sampai tanggal</label>
              <input
                type="date"
                className="w-full p-1 border bg-white rounded-lg focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => setShowFiltered(true)} // Trigger filter on button click
          >
            Lihat
          </button>
        </div>
      )}
      {/* Render tombol tambah data jika showAddButton true */}
      {showAddButton && (
        <div className="flex justify-end my-4">
          <button
            onClick={onClickAdd}
            className="px-4 py-2 text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Tambah Data
          </button>
        </div>
      )}
      <div className="overflow-x-auto mt-4 rounded-lg">
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <thead className="bg-blue-400 text-gray-800 rounded">
            <tr>
              <th className="py-4 px-6 text-left">No</th>{" "}
              {/* Kolom untuk nomor urut */}
              {columns.map((col) => (
                <th key={col} className="py-2 px-6 text-left">
                  {toTitleCase(toTitleCaseWithSpace(col)) === "Nomorpolisi"
                    ? "Nomor Polisi"
                    : toTitleCase(toTitleCaseWithSpace(col))}{" "}
                  {/* Nama kolom yang sudah dalam Title Case */}
                </th>
              ))}
              {showDeleteButton && (
                <th className="py-2 px-6 text-left">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-700 text-xs">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className="border-b">
                  {/* Menampilkan No berdasarkan halaman dan urutan */}
                  <td className="py-2 px-6 text-left">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="py-2 px-6 text-left">
                      {col === "tanggal" ? formatTanggal(item[col]) : item[col]}
                    </td>
                  ))}
                  {showDeleteButton && (
                    <td className="py-2 px-6 text-left">
                      <button
                        onClick={() =>{ console.log("item yang dihapus", item);
                          console.log("ID item", item.id);
                          
                         onDelete(item)}}
                        className="px-4 py-2  text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (showDeleteButton ? 1 : 0)}>
                  Tidak ada data untuk tanggal yang dipilih.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPage }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {/* <Modal 
      isOpen={isModalOpen}
      onClose={closeModal}
      onSubmit={handleSubmit}
      /> */}
    </div>
  );
};
