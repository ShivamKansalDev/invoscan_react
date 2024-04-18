'use client';
import { useState } from "react";
import DataTable from "react-data-table-component";
import FeatherIcon from "feather-icons-react";

const Users = ()=>{
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    let columns = [
        {
            name: 'Vendor Name',
            selector: row => (row.supplier && row.supplier.name ? row.supplier.name : 'NA'),
        },
        {
            name: 'Customer Name',
            selector: row => row.CustomerName,
        },
        {
            name: 'Invoice Date',
            selector: row => row.InvoiceDate,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="grid-flex">
                    <button
                        onClick={(e) => showRowData(row)}
                    >
                        <FeatherIcon icon="eye" className='menu-icon' />
                    </button>
                    <button
                        onClick={(e) => { setDeleteId(row.id); setDeleteOpen(true); }}
                    >
                        <i className='bx bx-trash menu-icon menu-icon-red'></i>
                    </button>
                </div>
            )
        },
    ]
    let customStyles = {
        headRow: {
            style: {
                border: 'none',
            },
        },
        headCells: {
            style: {
                color: '#202124',
                fontSize: '14px',
            },
        },
        rows: {
            highlightOnHoverStyle: {
                backgroundColor: 'rgb(230, 244, 244)',
                borderBottomColor: '#FFFFFF',
                borderRadius: '25px',
                outline: '1px solid #FFFFFF',
            },
        },
        pagination: {
            style: {
                border: 'none',
            },
        },
    };
    return(
        <>
         <div className="card mb-4">
         <DataTable
            title="Users"
            columns={columns}
            progressPending={loading}
            fixedHeader
            pagination
            paginationTotalRows={totalRows}
            customStyles={customStyles}
            highlightOnHover
            pointerOnHover
        />
         </div>
        </>
    )
}
export default Users;