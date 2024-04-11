'use client';
import DataTable from "react-data-table-component";
import React, { useState, useEffect } from "react";
import Request from "@/Request";

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import FeatherIcon from 'feather-icons-react';

export default function Credits() {
    let columns = [
        {
            name: 'Product',
            selector: row => row.Description,
        },
        {
            name: 'Vendor Name',
            selector: row => row.VendorName,
        },
        {
            name: 'Invoice Date',
            selector: row => row.InvoiceDate,
        },
        {
            name: 'Qty',
            selector: row => row.Quantity,
        },
        {
            name: 'Reason',
            cell: row => (
                <div style={{textTransform: 'capitalize'}}>{row.Reason}</div>
            )
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <button
                        className="btn rounded-pill btn-default"
                        onClick={(e) => showRowData(row)}
                    >
                        {
                            row.isResolved === false ?
                                <i className='bx bx-square menu-icon'></i>
                                :
                                <i className='bx bx-check-square menu-icon'></i>
                        }
                    </button>
                </div>
            )
        },
    ];
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
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [results, setResults] = useState(10)
    const [page, setPage] = useState(1)
    const [currentTab, setCurrentTab] = useState('Pending');
    const [stockItem, setStockItems] = useState({})
    const [open, setOpen] = useState(false);
    const [note, setStockNote] = useState('');
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState('');
    const [records, setAllRecords] = useState([]);

    const fetchData = async (page) => {
        setPage(page)
        setLoading(true)
        let company = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : { id: '' };
        const response = await Request.get(`/stock-report/${company.id}`);
        setLoading(false)
        if (response.data && response.data.length > 0) {
            setAllRecords(response.data);
            creditActiveTab(currentTab, response.data)
        }
    }

    const creditActiveTab = async (activeTab, records) => {
        let filter = true;
        if (activeTab === 'Pending') {
            filter = false;
        }
        setCurrentTab(activeTab)
        let creditItems = records.filter(function (data) {
            return data.isResolved === filter;
        });
        setData(creditItems)
        setTotalRows(creditItems.length)
    }

    const showRowData = (row, key) => {
        setStockItems(row)
        setStockNote(row.comment)
        setOpen(true);
    }

    const saveStockItem = async () => {
        let formData = new FormData();
        for (let index = 0; index < files.length; index++) {
            formData.append('files[]', files[index])
        }
        formData.append('comment', note)
        console.log(currentTab)

        //const response = await Request.patch(`/stock-report/resolve/${stockItem.id}?isResolved=${currentTab == 'Completed' ? 'false' : 'true'}`, formData);
        const response = await Request.patch(`/stock-report/resolve/${stockItem.id}?isResolved=${'true'}`, formData);

        if (response) {
            setStockItems({})
            setStockNote('');
            setFiles([])
            fetchData(1);
            setOpen(false)
        }
    }

    const [currentUser, setUser] = useState({});
    const onCloseModal = () => setOpen(false);

    useEffect(() => {
        let user = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null;
        setUser(user);
        fetchData(1);
    }, []);

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="mt-2">
                    <button type="button" onClick={() => { creditActiveTab('Pending', records); }} className={`btn ${currentTab === 'Pending' ? 'btn-green' : 'btn-green-borded'} me-2`}>Unresolved</button>
                    <button type="button" onClick={() => { creditActiveTab('Completed', records); }} className={`btn ${currentTab === 'Completed' ? 'btn-green' : 'btn-green-borded'} me-2`}>Resolved</button>
                </div>
                <DataTable
                    title={`${currentTab} Credits`}
                    columns={columns}
                    data={data}
                    progressPending={loading}
                    fixedHeader
                    pagination
                    paginationTotalRows={totalRows}
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                />
            </div>
            <Modal open={open} onClose={onCloseModal} center>
                <div className=" mb-4">
                    <h2 className="card-header">Completed Credit </h2>
                    <small>Are you interested in update the credit?</small>
                    <div className="card- mt-4">
                        <table className="table table-bordered table-striped">
                            <tbody>
                                <tr>
                                    <td>{stockItem.VendorName}</td>
                                    <td>{stockItem.InvoiceDate}</td>
                                    <td>{stockItem.Description}</td>
                                    <td>{stockItem.Quantity}</td>
                                    <td>{stockItem.Reason}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                {
                                    stockItem.images && stockItem.images.map((image, index) => {
                                        return (<img key={index} src={image} style={{ width: '120px' }} />)
                                    })
                                }
                            </div>
                            <div className="mb-3 col-md-12 file-upload-wrapper">
                                <div className="wrapper-uploader" onClick={() => { document.querySelector("#files").click() }}>
                                    <input className="form-control" type="file" id="files" name="files[]" onChange={(e) => { setFiles(e.target.files); setFileName(e.target.files[0]?e.target.files[0].name:'') }} multiple hidden />
                                    <FeatherIcon icon="upload-cloud" className='menu-icon' />
                                    <p>Browse File to Upload</p>
                                    {
                                        fileName ?
                                            <a>{fileName}</a>
                                            : null
                                    }
                                </div>
                            </div>
                            <div className="mb-3 col-md-12">
                                <label htmlFor="comment" className="form-label">Notes</label>
                                <input className="form-control" type="text" name="comment" id="comment" onChange={(e) => { setStockNote(e.target.value); }} value={note} />
                            </div>
                            <div className="mt-2">
                                {currentTab === 'Pending'  ?
                                   <>
                                        <button type="button" onClick={onCloseModal} className="btn btn-green-borded me-2">Cancel</button>
                                        <button type="button" onClick={saveStockItem} className="btn btn-green me-2 width-86">Resolve</button> 
                                   </>:
                                ""
                                }
                                 {currentTab === 'Completed' ?
                                   <>
                                    <button type="button" onClick={onCloseModal} className="btn btn-green-borded me-2">Cancel</button>
                                    <button type="button" onClick={saveStockItem} className="btn btn-green me-2 width-86">Update</button> 
                                   </>:
                                   ""
                                }
                               
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}