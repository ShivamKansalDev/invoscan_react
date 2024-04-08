'use client';
import DataTable from "react-data-table-component";
import React, { useState, useEffect } from "react";
import Request from "@/Request";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import FeatherIcon from 'feather-icons-react';

export default function Statements() {
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
            name: 'Customer Address',
            selector: row => row.CustomerAddress,
        },
        {
            name: 'Total Tax',
            cell: row => (
                <div className="text-light-green">£{parseFloat(row.TotalTax).toFixed(2)}</div>
            )
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="grid-flex">
                    <button
                        onClick={(e) => showRowData(row)}
                    >
                        <i className='bx bx-show menu-icon'></i>
                    </button>
                    <button
                        onClick={(e) => { setDeleteId(row.id); setDeleteOpen(true); }}
                    >
                        <i className='bx bx-trash menu-icon menu-icon-red'></i>
                    </button>
                </div>
            )
        },
    ];
    let invoiceItemsColumns = [
        {
            name: 'Invoice Number',
            selector: row => row.invoiceNumber,
        },
        {
            name: 'Invoice Date',
            selector: row => row.invoiceDate,
        },
        {
            name: 'Amount',
            cell: row => (
                <div className="text-light-green">£{parseFloat(row.amount).toFixed(2)}</div>
            )
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="grid-flex">
                    <button
                    >
                        {
                            row.isResolved === true ?
                                <i className='bx bx-check-square menu-icon'></i>
                                :
                                <i onClick={() => { markCompleteCurrentStatement(row) }} className='bx bx-square menu-icon'></i>
                        }
                    </button>
                    <button
                        onClick={(e) => { setInnerDeleteId(row.id); setDeleteInnerOpen(true); }}
                    >
                        <i className='bx bx-trash menu-icon menu-icon-red'></i>
                    </button>
                </div>
            )
        }
    ];
    let uploadedInvoiceItemsColumns = [
        {
            name: '',
            cell: row => (
                <div>
                    <input type="text" className="form-control" value={row.PackSize} readOnly />
                    <b>{row.Description}</b>
                </div>
            )
        },
        {
            name: 'Inv. packs',
            cell: row => (
                <div>
                    <input type="text" className="form-control" value={row.Quantity} readOnly />
                </div>
            )
        },
        {
            name: 'Credit packs',
            cell: row => (
                <div>
                    <input type="text" className="form-control" value={row.csvDtPrice} readOnly />
                </div>
            )
        },
        {
            name: 'Price/unit',
            cell: row => (
                <div>
                    <input type="text" className="form-control" value={row.Amount} readOnly />
                </div>
            )
        },
        {
            name: '',
            cell: (row, index) => (
                <div className="grid">
                    <button
                        className="btn rounded-pill btn-default"
                        onClick={(e) => showInvoiceData(row, index)}
                    >
                        <i className='bx bx-show menu-icon'></i>
                    </button>
                </div>
            )
        }
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
    const [results, setResults] = useState(100)
    const [page, setPage] = useState(1)
    const [open, setOpen] = useState(false);
    const [invoiceOpen, setInvoiceOpen] = useState(false);

    const [invoiceItem, setInvoiceItems] = useState({
        row: {},
        Items: []
    })
    const [uploadedInvoiceItems, setUploadedInvoiceItems] = useState([])
    const [totalItemRows, setTotalItemRows] = useState(0)
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [supplierList, setSupplierList] = useState([]);
    const [selectedSupplier, setSupplier] = useState({});
    const [invoiceItemIndex, setInvoiceItemIndex] = useState();
    const [invoiceData, setInvoiceData] = useState({});
    const [actionType, setActionType] = useState('statement');
    const [nextAction, setNextAction] = useState(false);
    const [secondOpen, setSecondOpen] = useState(false);

    const [fileName, setFileName] = useState('');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteInnerOpen, setDeleteInnerOpen] = useState(false);

    const [deleteId, setDeleteId] = useState(null)
    const [deleteInnerId, setInnerDeleteId] = useState(null)

    const fetchCurrentSupplier = async (userId) => {
        let response = await Request.get(`/supplier`);
        if (response.data) {
            setSupplierList(response.data)
        }
    }

    const showRowData = async (row) => {
        const response = await Request.get(`/statement-credit/statement/${row.id}`);
        if (response.data && response.data.length > 0) {
            setInvoiceItems({
                row,
                Items: response.data
            })
            setTotalItemRows(response.data.length)
            setOpen(true);
        }
    }
    const markCompleteCurrentStatement = async (item) => {
        const response = await Request.patch(`/statement-credit/resolve/${item.id}`, { "isResolved": true });
        if (response) {
            showRowData(invoiceItem.row)
        }
    }

    const deleteCurrentInnerInvoice = async () => {
        const response = await Request.delete(`/statement-credit/delete/${deleteInnerId}`);
        if (response) {
            showRowData(invoiceItem.row)
            onCloseInnerDeleteModal();
        }
    }

    const fetchData = async page => {
        setPage(page)
        setLoading(true)
        let company = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : { id: '' };
        const response = await Request.get(`/statement/${company.id}`);
        setLoading(false)
        if (response.data && response.data.length > 0) {
            setData(response.data)
            setTotalRows(response.data.length)
        }
    }

    const deleteCurrentInvoice = async () => {
        const response = await Request.delete(`/statement/delete/${deleteId}`);
        if (response) {
            fetchData(1);
            onCloseDeleteModal();
        }
    }

    const saveUploadedItem = async () => {
        let formData = new FormData();
        for (let index = 0; index < files.length; index++) {
            formData.append('files[]', files[index])
        }
        let company = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : { id: '' };
        const response = await Request.postUpload(`/form/analyze/${company.id}?supplierId=${selectedSupplier.id}&type=${actionType}`, formData);
        if (response && !response.error) {
            // setUploadedInvoiceItems(response.data)
            // setInvoiceOpen(true);
            fetchData(1);
            setSupplierOpen(false)
        }
    }

    const markCompleteCurrentInvoice = async () => {
        const response = await Request.patch(`/stock/update-stock/${uploadedInvoiceItems.id}`, { Items: uploadedInvoiceItems.Items });
        if (response) {
            setUploadedInvoiceItems({})
            fetchData(1);
            setInvoiceOpen(false)
        }
    }

    const showInvoiceData = (row, key) => {
        let rowData = { ...row };
        setInvoiceData(rowData)
        setInvoiceItemIndex(key)
        setSecondOpen(true);
    }

    const saveInvoiceItems = () => {
        uploadedInvoiceItems.Items[invoiceItemIndex] = invoiceData
        setUploadedInvoiceItems({
            ...uploadedInvoiceItems
        })
        setSecondOpen(false)
    }

    const [currentUser, setUser] = useState({});
    const onCloseSupplierModal = () => setSupplierOpen(false);
    const onCloseSecondModal = () => setSecondOpen(false);
    const [files, setFiles] = useState([]);

    const onCloseModal = () => setOpen(false);
    const onCloseInvoiceModal = () => setInvoiceOpen(false);
    const onCloseDeleteModal = () => setDeleteOpen(false);
    const onCloseInnerDeleteModal = () => setDeleteInnerOpen(false);

    useEffect(() => {
        let user = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null;
        setUser(user);
        fetchData(1);
    }, []);

    return (
        <>
            <div className="card mb-4">
                <div className="card-body mt-3" style={{ background: '#0bc9931a' }}>
                    <h5>Book in a new delivery</h5>
                    <div className="mt-2">
                        <button type="button" onClick={(e) => { fetchCurrentSupplier(); setNextAction(false); setSupplierOpen(true); }} className={`btn btn-green me-2`}>Add Statement</button>
                    </div>
                </div>
                <div className="card-body">
                    <DataTable
                        title="Statements"
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
            </div>
            <Modal open={open} onClose={onCloseModal} center>
                <DataTable
                    title={`${(invoiceItem.row.CustomerName ? invoiceItem.row.CustomerName : 'NA')} (${totalItemRows})`}
                    columns={invoiceItemsColumns}
                    data={invoiceItem.Items}
                    progressPending={loading}
                    fixedHeader
                    pagination
                    paginationTotalRows={totalItemRows}
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                />
            </Modal>
            <Modal open={invoiceOpen} classNames={{
                modal: 'booking-modal',
            }} onClose={onCloseInvoiceModal} center>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4">
                            <Carousel
                                showArrows={true}
                                showIndicators={true}
                                infiniteLoop={true}
                                dynamicHeight={false}
                                showThumbs={false}
                            >
                                {uploadedInvoiceItems.invoiceUrl && uploadedInvoiceItems.invoiceUrl.map((invoiceUrl, key) => (
                                    <div key={key}>
                                        <div>
                                            <img src={invoiceUrl.url} alt="slides" />
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        <div className="col-md-8">
                            {
                                uploadedInvoiceItems ?
                                    <div className="card mb-4">
                                        <h5 className="card-header">{uploadedInvoiceItems.supplier && uploadedInvoiceItems.supplier.name}</h5>
                                        <small>Make sure the information below is correct.</small>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="mb-3 col-md-6">
                                                    <label htmlFor="InvoiceId" className="form-label">Invoice Number</label>
                                                    <input className="form-control" readOnly type="text" id="InvoiceId" name="InvoiceId" value={uploadedInvoiceItems.InvoiceId} />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label htmlFor="CustomerId" className="form-label">Customer ID</label>
                                                    <input className="form-control" readOnly type="text" name="CustomerId" id="CustomerId" value={uploadedInvoiceItems.CustomerId} />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label htmlFor="InvoiceDate" className="form-label">Invoice date</label>
                                                    <input className="form-control" readOnly type="text" id="InvoiceDate" name="InvoiceDate" value={uploadedInvoiceItems.InvoiceDate} />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label htmlFor="SubTotal" className="form-label">Net Total ex VAT</label>
                                                    <input type="text" readOnly className="form-control" id="SubTotal" name="SubTotal" value={uploadedInvoiceItems.SubTotal} />
                                                </div>
                                            </div>
                                            <DataTable
                                                title={`Delivery products (${uploadedInvoiceItems.Items ? uploadedInvoiceItems.Items.length : 0})`}
                                                columns={uploadedInvoiceItemsColumns}
                                                data={uploadedInvoiceItems.Items}
                                                progressPending={loading}
                                                fixedHeader
                                                pagination
                                                paginationServer
                                                paginationTotalRows={uploadedInvoiceItems.Items ? uploadedInvoiceItems.Items.length : 0}
                                                customStyles={customStyles}
                                                highlightOnHover
                                                pointerOnHover
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <button type="submit" onClick={markCompleteCurrentInvoice} className="btn btn-green me-2">Mark as complete</button>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal open={secondOpen} onClose={onCloseSecondModal} center>
                <div className="mb-4">
                    <small>Pack Size:- {invoiceData.PackSize}</small>
                    <h2 className="card-header">{invoiceData.Description}</h2>
                    <div className="card-body">
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="Quantity" className="form-label">Inv. packs</label>
                                <input className="form-control" type="text" id="Quantity" name="Quantity" onChange={(e) => { setInvoiceData({ ...invoiceData, Quantity: e.target.value }) }} value={invoiceData.Quantity} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="csvDtPrice" className="form-label">Credit packs</label>
                                <input className="form-control" type="text" name="csvDtPrice" id="csvDtPrice" onChange={(e) => { setInvoiceData({ ...invoiceData, csvDtPrice: e.target.value }) }} value={invoiceData.csvDtPrice} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="UnitPrice" className="form-label">Price/unit</label>
                                <input className="form-control" type="text" id="UnitPrice" name="UnitPrice" onChange={(e) => { setInvoiceData({ ...invoiceData, UnitPrice: e.target.value }) }} value={invoiceData.UnitPrice} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="Amount" className="form-label">Total Price</label>
                                <input type="text" className="form-control" id="Amount" name="Amount" onChange={(e) => { setInvoiceData({ ...invoiceData, Amount: e.target.value }) }} value={invoiceData.Amount} />
                            </div>
                            <div className="mt-2">
                                <button type="button" onClick={onCloseSecondModal} className="btn btn-green-borded me-2">Cancel</button>
                                <button type="button" onClick={saveInvoiceItems} className="btn btn-green me-2">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal open={supplierOpen} onClose={onCloseSupplierModal} classNames={{ modal: 'supplier-modal' }} center>
                {
                    !nextAction ?
                        <div className=" mb-4">
                            <h2 className="card-header">Select supplier</h2>
                            <small>You must select a supplier before you can scan an invoice.</small>
                            <div className="card-body mt-4">
                                <div className=" card-body-group">
                                    {
                                        supplierList && supplierList.map((supplier, index) => {
                                            return (
                                                <div className="form-check form-radio-check mb-2 py-2" key={index}>
                                                    <input className="form-check-input" onChange={() => {
                                                        setSupplier(supplier)
                                                    }} name='companyId' type="radio" id={`flexSwitchCheckChecked-${index}`} />
                                                    <label className="form-check-label" htmlFor={`flexSwitchCheckChecked-${index}`}>{supplier.name}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="mt-2">
                                    <button type="button" onClick={() => { setNextAction(true) }} className="btn btn-green me-2 width-100">Confirm Supplier</button>
                                </div>
                            </div>
                        </div>
                        :
                        <div className=" mb-4">
                            <h2 className="card-header">Add Statement</h2>
                            <small>Upload Statement PDF File.</small>
                            <div className="mt-3"><h6 className="card-header" style={{ color: '#0bc993' }}>Supplier: {selectedSupplier.name} </h6></div>
                            <div className="card-body mt-3 py-5">
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
                            </div>
                            <div className="card-body">
                                <div className="mt-2">
                                    <button type="button" onClick={() => { setNextAction(false) }} className="btn btn-green-borded me-2">Back</button>
                                    <button type="button" onClick={() => { saveUploadedItem() }} className="btn btn-green me- width-86">Confirm</button>
                                </div>
                            </div>
                        </div>
                }
            </Modal>

            <Modal open={deleteOpen} onClose={onCloseDeleteModal} classNames={{ modal: 'company-select-modal' }} center>
                <div className="card mb-4">
                    <div className="card-body mt-3">
                        <h5>Wait!</h5>
                        <small>Are You Sure, You want to delete ?</small>
                        <div className="row">
                            <button type="button" onClick={(e) => { onCloseDeleteModal(); setDeleteId(null) }} className={`btn btn-green-borded col-md-6`}>Cancel</button>
                            <button type="button" onClick={(e) => { deleteCurrentInvoice(); }} className={`btn btn-green col-md-6`}>Delete</button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={deleteInnerOpen} onClose={onCloseInnerDeleteModal} classNames={{ modal: 'supplier-modal' }} center>
                <div className="card mb-4">
                    <div className="card-body mt-3">
                        <h5>Wait!</h5>
                        <small>Are You Sure, You want to delete ?</small>
                        <div className="row">
                            <button type="button" onClick={(e) => { onCloseInnerDeleteModal(); setInnerDeleteId(null) }} className={`btn btn-green-borded col-md-6`}>Cancel</button>
                            <button type="button" onClick={(e) => { deleteCurrentInnerInvoice(); }} className={`btn btn-green col-md-6`}>Delete</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}