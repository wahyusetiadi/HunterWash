import { TrashIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";

function toTitleCaseWithSpace(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
}

const BASE_URL = import.meta.env.VITE_BASE_URL;
export const Table = ({
  data,
  filterData = true,
  itemsPerPage = 5,
  showDeleteButton = false,
  onDelete,
  showAddButton = false,
  onClickAdd,
  onAdd,
  disabled = false,
  showUpdateButton = false, // Prop to control showing the Update button
  showImage = true,
  onUpdate, // Prop for update action
  baseUrl = BASE_URL, // Base URL for image paths
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const [currentItems, setCurrentItems] = useState([]);

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Mendapatkan kolom yang ada, kecuali 'id' dan yang undefined
  const columns = Object.keys(data[0] || {}).filter(
    (key) => key !== "id" && key !== "imageUrl" && key !== "gambar"
  ); // Hapus imageUrl dan gambar dari columns

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleFilter = () => {
    const newFilteredData = data.filter((item) => {
      const itemDate = new Date(item.tanggal);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (!start || itemDate >= start) && (!end || itemDate <= end);
    });

    const sortedData = newFilteredData.sort((a, b) => {
      return new Date(b.tanggal) - new Date(a.tanggal);
    })
    setFilteredData(sortedData);
    setCurrentPage(1); // Reset to first page after applying filter
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPage = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    const updatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentItems(updatedData);
  }, [filteredData, currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    console.log("ID: yang akan dihapus:", id);
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleChange = (e, callback) => {
    e.preventDefault();
    callback(e.target.value);
  };

  return (
    <div>
      {filterData && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-start">
              <label className="font-semibold mb-2">Dari tanggal</label>
              <input
                type="date"
                className="w-full p-1 border bg-white rounded-lg focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => handleChange(e, setStartDate)}
              />
            </div>
            <div className="flex flex-col items-start">
              <label className="font-semibold mb-2">Sampai tanggal</label>
              <input
                type="date"
                className="w-full p-1 border bg-white rounded-lg focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => handleChange(e, setEndDate)}
              />
            </div>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleFilter}
          >
            Lihat
          </button>
        </div>
      )}

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
              <th className="py-4 px-6 text-left">No</th>
              {columns.map((col) => (
                <th key={col} className="py-2 px-6 text-left">
                  {toTitleCase(toTitleCaseWithSpace(col)) === "Nomorpolisi"
                    ? "Nomor Polisi"
                    : toTitleCase(toTitleCaseWithSpace(col))}
                </th>
              ))}
              {(showDeleteButton || showUpdateButton) && (
                <th className="py-2 px-6 text-left">Aksi</th>
              )}
              {/* Kolom Gambar */}
              {showImage && <th className="py-2 px-6 text-left">Gambar</th>}
            </tr>
          </thead>

          <tbody className="text-gray-700 text-xs">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-6 text-left">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="py-2 px-6 text-left">
                      {col === "tanggal" ? formatTanggal(item[col]) : item[col]}
                    </td>
                  ))}

                  {(showDeleteButton || showUpdateButton) && (
                    <td className="py-2 px-6 text-left flex">
                      {showUpdateButton && (
                        <button
                          onClick={() => onUpdate(item)}
                          disabled={disabled}
                          className="px-4 py-2 text-xs font-medium bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Update
                        </button>
                      )}
                      {showDeleteButton && (
                        <button
                          onClick={() => handleDelete(item.id)} // Use item.id here
                          disabled={disabled}
                          className="px-4 py-2 text-xs font-thin bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  )}
                  {showImage && (
                    <td className="py-2 px-6 text-left">
                      {item.gambar ? (
                        <a
                          href={`${baseUrl}${item.gambar}`}
                          download={item.gambar.split("/").pop()}
                          className="text-blue-500 hover:underline"
                        >
                          Unduh Gambar
                        </a>
                      ) : (
                        "No Image"
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (showDeleteButton || showUpdateButton ? 1 : 0) +
                    1
                  }
                >
                  Tidak ada data untuk tanggal yang dipilih.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* <div className="flex justify-center mt-4">
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
      </div> */}
      <div className="flex justify-center mt-4 px-4 py-2">
        {/* Tombol First */}
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          &lt;&lt;
        </button>

        {/* Tombol Prev */}
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          &lt;
        </button>

        {/* Tombol halaman */}
        {Array.from({ length: totalPage }, (_, index) => {
          const pageNumber = index + 1;
          if (
            pageNumber >= currentPage - 1 && // Show previous 2 pages
            pageNumber <= currentPage + 1 // Show next 2 pages
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === pageNumber
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            );
          }
          return null;
        })}

        {/* Tombol Next */}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPage}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          &gt;
        </button>

        {/* Tombol Last */}
        <button
          onClick={() => paginate(totalPage)}
          disabled={currentPage === totalPage}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};
