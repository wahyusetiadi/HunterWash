import React from 'react'
import { Navigation } from '../../components/organisms/Navigation'
import { Table } from '../../components/organisms/Table'
import { dataKaryawan } from '../../dataDummy'

export const DataKaryawan = () => {
  return (
    <div>
        <Navigation />
        <div className="my-4 px-5">
                <div className="flex flex-col p-2 mt-4 text-center rounded-md bg-blue-100">
                    <h1 className='text-base font-bold text-black'>Data Karyawan</h1>
                </div>
            </div>
        <div className="my-4 px-5">
            <Table data={dataKaryawan} filterData={false} itemsPerPage={'2'} showDeleteButton={true} showAddButton={true}/>
        </div>
    </div>
  )
}
