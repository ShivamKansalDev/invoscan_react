'use client';
import DataTable from "react-data-table-component";
import React, { useState, useEffect } from "react";
import Request from "@/Request";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import FeatherIcon from 'feather-icons-react';

export default function Bookings() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [results, setResults] = useState(100)
    const [page, setPage] = useState(1)
    const [open, setOpen] = useState(false);
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [supplierList, setSupplierList] = useState([]);
    const [selectedSupplier, setSupplier] = useState({});
    const [secondOpen, setSecondOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [invoiceItems, setInvoiceItems] = useState({
        Items: []
    });
    const [invoiceData, setInvoiceData] = useState({
        PackSize: '',
        Description: '',
        Quantity: '',
        QuantityForReport: '',
        Amount: '',
        Reason: '',
        UnitPrice: ''
    });
    const [invoiceItemIndex, setInvoiceItemIndex] = useState();
    const [actionType, setActionType] = useState('');
    const [nextAction, setNextAction] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteSPOpen, setDeleteSpOpen] = useState(false);
    
    const [deleteId, setDeleteId] = useState(null)
    const [deleteSPId, setspDeleteId] = useState({})
    
    const [actionButtonType, setActionButtonType] = useState('update');

    useEffect(() => {

    }, [])

    let columns = [
        {
            name: 'Vendor Name',
            selector: row => (row.supplier && row.supplier.name ? row.supplier.name : 'NA'),
        },
        {
            name: 'Invoice Date',
            selector: row => row.InvoiceDate,
        },
        {
            name: 'Invoice ID',
            selector: row => row.InvoiceId,
        },
        {
            name: 'Sub Total',
            cell: row => (
                <div className="text-light-green">£{parseFloat(row?.SubTotal?.replace(/[^0-9\.]+/g, ""))?.toFixed(2)}</div>
            )
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="grid-flex">
                    <div>
                        <button
                            onClick={(e) => showRowData(row)}
                        >
                            <i className='bx bx-show menu-icon'></i>
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={(e) => { setDeleteId(row.id); setDeleteOpen(true); }}
                        >
                            <i className='bx bx-trash menu-icon menu-icon-red'></i>
                        </button>
                    </div>
                </div>
            )
        },
    ];
    let invoiceItemsColumns = [
        {
            name: '',
            width: "47%",
            cell: row => (
                <div className="grid-flex">
                    <div style={{ width: '100px', textAlign: 'center' }} className="form-control">{row.PackSize}</div>
                    <b style={{ paddingLeft: '5px' }}>{row.Description}</b>
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
                    <input type="text" className="form-control" value={row.QuantityForReport} readOnly />
                </div>
            )
        },
        {
            name: 'Price/unit',
            cell: row => (
                <div>
                    <input type="text" className="form-control" value={"£" + row.Amount} readOnly />
                </div>
            )
        },
        {
            name: '',
            cell: (row, index) => (
                <div className="grid-flex">
                    <div>
                        {
                            row.lock !== true ?
                                <button
                                    onClick={(e) => { console.log("#@@#@#@ EYE: ", index, row); showInvoiceData(row, index); setActionButtonType('update') }}
                                >
                                    <i className='bx bx-show menu-icon'></i>
                                </button>
                                : null
                        }
                    </div>
                    <div>
                        {
                            row.lock !== true ?
                                <button
                                    onClick={(e) => { console.log("#@@#@#@ E: ", index, row); setspDeleteId({row, index}); setDeleteSpOpen(true); }}
                                >
                                    <i className='bx bx-trash menu-icon menu-icon-red'></i>
                                </button>
                                : null
                        }
                    </div>
                    <div>
                        {
                            row.lock !== true ?
                                <button onClick={(e) => setInvoiceLock(row, index)}>
                                    <FeatherIcon icon="unlock" className='menu-icon' />
                                </button>
                                :
                                <button onClick={(e) => setInvoiceUnlock(row, index)}>
                                    <FeatherIcon icon="lock" className='menu-icon' />
                                </button>
                        }

                    </div>
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
        }
    };

    const showRowData = (row) => {
        // if (row.invoiceUrl && row.invoiceUrl.length > 0 && row.invoiceUrl[0].type == 'pdf') {
        //     const pdfUrl = row.invoiceUrl[0].url;
        //     const link = document.createElement("a");
        //     link.href = pdfUrl;
        //     link.download = "invoice.pdf";
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        // }
        let rowData = Object.assign({}, row);
        const items = rowData?.Items;
        if(Array.isArray(items)){
            const addIndex = items.map((item, index) => ({
                ...item,
                index
            }));
            rowData = Object.assign({}, rowData, {Items: addIndex})
            setInvoiceItems(rowData);
            // console.log("#@@#@# ROW DATA: ", JSON.stringify(rowData, null, 4));
        }
        setOpen(true);
    }

    const showInvoiceData = (row, key) => {
        let rowData = { ...row };
        setInvoiceData(rowData)
        setInvoiceItemIndex(key)
        setSecondOpen(true);
    }

    const saveInvoiceItems = () => {
        invoiceItems.Items[invoiceItemIndex] = invoiceData
        let invoiceItemsClone = { ...invoiceItems }
        setInvoiceItems({
            Items: []
        })
        setTimeout(() => {
            setInvoiceItems(invoiceItemsClone)
        }, 500);
        setSecondOpen(false)
    }

    const saveNewInvoiceItems = () => {
        invoiceData.lock = false;
        const length = invoiceItems.Items.length;
        invoiceItems.Items.push(Object.assign({}, invoiceData, {index: length}))
        let invoiceItemsClone = Object.assign({}, invoiceItems); 
        setInvoiceItems({
            Items: []
        })
        setTimeout(() => {
            setInvoiceItems(invoiceItemsClone)
        }, 500);
        setSecondOpen(false)
    }

    const setInvoiceLock = (row, index) => {
        row.lock = true;
        invoiceItems.Items[index] = row
        let invoiceItemsClone = { ...invoiceItems }
        // setInvoiceItems({})
        setTimeout(() => {
            setInvoiceItems(invoiceItemsClone)
        }, 500);
    }

    const deleteInvoiceData = () => {
        let {row, index} = deleteSPId;
        // console.log("@#@@# INDEX: ", row);
        const updateInvoiceItems = invoiceItems.Items.filter((item, itemIndex) => itemIndex !== row?.index);
        setInvoiceItems({Items: updateInvoiceItems});
        setTimeout(() => {
            setDeleteSpOpen(false)
        }, 10);
    }

    const setInvoiceUnlock = (row, index) => {
        row.lock = false;
        invoiceItems.Items[index] = row
        let invoiceItemsClone = { ...invoiceItems }
        // setInvoiceItems({})
        setTimeout(() => {
            setInvoiceItems(invoiceItemsClone)
        }, 500);
    }

    const markCompleteCurrentInvoice = async () => {
        const response = await Request.patch(`/stock/update-stock/${invoiceItems.id}`, { Items: invoiceItems.Items });
        if (response) {
            setInvoiceItems({
                Items: []
            })
            fetchData(1);
            setOpen(false)
            setSupplierOpen(false)
        }
    }

    const deleteCurrentInvoice = async () => {
        const response = await Request.delete(`/stock/${deleteId}`);
        if (response) {
            fetchData(1);
            onCloseDeleteModal();
        }
    }

    const fetchData = async page => {
        setPage(page)
        setLoading(true)
        let company = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : { id: '' };
        if(!company.id) {
            return;
        }
        const response = await Request.get(`/stock/pending/${company.id}?from=${moment(startDate).format('YYYY-MM-DD')}&to=${moment(endDate).format('YYYY-MM-DD')}${supplierId ? '&supplier=' + supplierId : ''}`);
        setLoading(false)
        if (response.data && response.data.data && response.data.count > 0) {
            setData(response.data.data)
            setTotalRows(response.data.count)
        } else {
            setData([])
            setTotalRows(0)
        }
    }

    const fetchCurrentSupplier = async (userId) => {
        let response = await Request.get(`/supplier`);
        if (response.data) {
            setSupplierList(response.data)
        }
    }

    const saveUploadedItem = async () => {
        let formData = new FormData();
        for (let index = 0; index < files.length; index++) {
            formData.append('files[]', files[index])
        }
        let company = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : { id: '' };
        const response = await Request.postUpload(`/form/analyze/${company.id}?supplierId=${selectedSupplier.id}&type=${actionType == 'bulk' ? 'invoice' : actionType}`, formData);
        if (response && !response.error) {
            showRowData(response.data);
            setSupplierOpen(false);
            fetchData(1);
        }
    }

    const [currentUser, setUser] = useState({});

    const onCloseModal = () => setOpen(false);
    const onCloseSecondModal = () => setSecondOpen(false);
    const onCloseSupplierModal = () => { setConfirmOpen(true) };
    const onCloseConfirmModal = () => setConfirmOpen(false);
    const onCloseDeleteModal = () => setDeleteOpen(false);
    const onClosespDeleteModal = () => setDeleteSpOpen(false);
    
    const [files, setFiles] = useState([]);

    const [startDate, setStartDate] = useState(moment().startOf('year').toDate());
    const [endDate, setEndDate] = useState(moment().endOf('year').toDate());
    const [supplierId, setSupplierId] = useState('');

    useEffect(() => {
        let user = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null;
        setUser(user);
        fetchData(1);
        fetchCurrentSupplier();
    }, []);

    let lockedItems = invoiceItems && invoiceItems.Items.filter((Item) => Item.lock === true)

    return (
        <>
            <div className="card mb-4">
                <div className="card-body mt-3" style={{ background: '#0bc9931a' }}>
                    <h5>Book in a new delivery</h5>
                    <div className="mt-2">
                        <button type="button" onClick={(e) => { setNextAction(false); setSupplierOpen(true); setActionType('invoice') }} className={`btn btn-green me-2`}>Add Invoice</button>
                        <button type="button" onClick={(e) => { setNextAction(false); setSupplierOpen(true); setActionType('bulk') }} className={`btn btn-green me-2`}>Bulk Invoices</button>
                        <button type="button" onClick={(e) => { setNextAction(false); setSupplierOpen(true); setActionType('statement') }} className={`btn btn-green me-2`}>Add Statement</button>
                    </div>
                </div>

                <div className="mt-2">
                    <h5 className="card-header pl-0">Search By Date</h5>
                    <div className="d-flex">
                        <div className="col-md-3">
                            <label className="col-md-12">Start Date</label>
                            <DatePicker selected={startDate} className="form-control" onChange={(date) => setStartDate(date)} />
                        </div>
                        <div className="col-md-3">
                            <label className="col-md-12">End Date</label>
                            <DatePicker selected={endDate} className="form-control" onChange={(date) => setEndDate(date)} />
                        </div>
                        <div className="col-md-3">
                            <label className="col-md-12">Supplier</label>
                            <select className="form-control" onChange={(e) => setSupplierId(e.target.value)} >
                                <option value={''}>All Supplier</option>
                                {
                                    supplierList && supplierList.map((supplier, index) => {
                                        return (
                                            <option key={index} value={supplier.id}>{supplier.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="col-md-12"><br /></label>
                            <button type="button" onClick={() => { fetchData(1) }} className={`btn btn-green me-2 width-86 ml-5`}>Search</button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <DataTable
                        title="Pending Deliveries"
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
            <Modal open={open} classNames={{
                modal: 'booking-modal',
            }} onClose={onCloseModal} center>
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
                                {invoiceItems.invoiceUrl && invoiceItems.invoiceUrl.map((invoiceUrl, key) => (
                                    invoiceUrl.type !== 'pdf' ?
                                        <div key={key}>
                                            <div>
                                                <img src={invoiceUrl.url} alt="slides" />
                                            </div>
                                        </div>
                                        : null
                                ))}
                            </Carousel>
                        </div>
                        <div className="col-md-8">
                            {
                                invoiceItems ?
                                    <div className="card mb-4">
                                        <h5 className="card-header">{invoiceItems.supplier && invoiceItems.supplier.name}</h5>
                                        <small style={{ paddingLeft: '20px' }}>Make sure the information below is correct.</small>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="mb-3 col-md-6">
                                                    <label htmlFor="InvoiceId" className="form-label">Invoice Number</label>
                                                    <input className="form-control" readOnly type="text" id="InvoiceId" name="InvoiceId" value={invoiceItems.InvoiceId} />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label htmlFor="CustomerId" className="form-label">Customer ID</label>
                                                    <input className="form-control" readOnly type="text" name="CustomerId" id="CustomerId" value={invoiceItems.CustomerId} />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label htmlFor="InvoiceDate" className="form-label">Invoice date</label>
                                                    <input className="form-control" readOnly type="text" id="InvoiceDate" name="InvoiceDate" value={invoiceItems.InvoiceDate} />
                                                </div>
                                                <div className="mb-3 col-md-6">
                                                    <label htmlFor="SubTotal" className="form-label">Net Total ex VAT</label>
                                                    <input type="text" readOnly className="form-control" id="SubTotal" name="SubTotal" value={"£" + (invoiceItems.SubTotal?invoiceItems.SubTotal.replace(/[^0-9\.]+/g, ""):'0.00')} />
                                                </div>
                                            </div>
                                            <div className="pull-right" style={{ float: 'right' }}>
                                                <button className="btn btn-green" type="button" onClick={() => { setActionButtonType('new'); showInvoiceData({}, 0); }}>Add New</button>
                                            </div>
                                            <DataTable
                                                title={`Delivery products (${invoiceItems.Items ? invoiceItems.Items.length : 0})`}
                                                columns={invoiceItemsColumns}
                                                data={invoiceItems.Items}
                                                progressPending={loading}
                                                fixedHeader
                                                pagination
                                                paginationTotalRows={invoiceItems.Items ? invoiceItems.Items.length : 0}
                                                customStyles={customStyles}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <button style={{ float: 'right' }} type="submit" disabled={lockedItems.length !== invoiceItems.Items.length} onClick={markCompleteCurrentInvoice} className="btn btn-green me-2">Mark as complete</button>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal open={secondOpen} onClose={onCloseSecondModal} center>
                <div className="card mb-4">
                    <small style={{ paddingLeft: '20px' }}>Pack Size:- {invoiceData.PackSize}</small>
                    <h5 className="card-header">{invoiceData.Description}</h5>
                    <div className="card-body">
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="Description" className="form-label">Description</label>
                                <input className="form-control" type="text" id="Description" name="Description" onChange={(e) => { setInvoiceData({ ...invoiceData, Description: e.target.value }) }} value={invoiceData.Description} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="PackSize" className="form-label">Pack Size</label>
                                <input className="form-control" type="text" id="PackSize" name="PackSize" onChange={(e) => { setInvoiceData({ ...invoiceData, PackSize: e.target.value }) }} value={invoiceData.PackSize} />
                            </div>
                        </div>
                        <div className="row">

                            <div className="mb-3 col-md-6">
                                <label htmlFor="Quantity" className="form-label">Inv. packs</label>
                                <input className="form-control" type="text" id="Quantity" name="Quantity" onChange={(e) => { setInvoiceData({ ...invoiceData, Quantity: e.target.value, Amount: (parseInt(e.target.value) * parseFloat(invoiceData.UnitPrice)) }); }} value={invoiceData.Quantity} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="QuantityForReport" className="form-label">Credit packs</label>
                                <input className="form-control" type="text" name="QuantityForReport" id="QuantityForReport" onChange={(e) => { setInvoiceData({ ...invoiceData, QuantityForReport: e.target.value }) }} value={invoiceData.QuantityForReport} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="UnitPrice" className="form-label">Price/unit</label>
                                <input className="form-control" type="text" id="UnitPrice" name="UnitPrice" onChange={(e) => { setInvoiceData({ ...invoiceData, UnitPrice: e.target.value, Amount:  (parseInt(invoiceData.Quantity) * parseFloat(e.target.value)) }); }} value={invoiceData.UnitPrice} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="Amount" className="form-label">Total Price</label>
                                <input type="text" className="form-control" id="Amount" name="Amount" readOnly value={"£" + invoiceData.Amount} />
                            </div>
                            {
                                invoiceData.QuantityForReport > 0 ?
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="Reason" className="form-label">Reason</label>
                                        <select className="form-control" name="Reason" onChange={(e) => { setInvoiceData({ ...invoiceData, Reason: e.target.value }) }} value={invoiceData.Reason}>
                                            <option value="">Drug Reasons</option>
                                            <option value="Damaged">Damaged</option>
                                            <option value="Expired">Expired</option>
                                            <option value="Wrong Product">Wrong Product</option>
                                            <option value="Wrong Quantity">Wrong Quantity</option>
                                            <option value="Wrong Price">Wrong Price</option>
                                            <option value="Wrong Discount">Wrong Discount</option>
                                            <option value="Wrong Tax">Wrong Tax</option>
                                            <option value="Wrong Unit">Wrong Unit</option>
                                            <option value="Wrong Content">Wrong Content</option>
                                            <option value="Wrong Product Code">Wrong Product Code</option>
                                        </select>
                                    </div>
                                    : null
                            }
                            <div className="mt-2">
                                <button type="button" onClick={onCloseSecondModal} className="btn btn-default me-2">Cancel</button>
                                {
                                    actionButtonType === 'new' ?
                                        <button type="button" onClick={saveNewInvoiceItems} className="btn btn-green me-2">Save</button>
                                        : <button type="button" onClick={saveInvoiceItems} className="btn btn-green me-2">Save</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Modal >
            <Modal open={supplierOpen} onClose={onCloseSupplierModal} classNames={{ modal: 'supplier-modal' }} center>
                {
                    !nextAction ?
                        <div className=" mb-4">
                            <h2 className="card-header">Select supplier</h2>
                            <small>You must select a supplier before you can scan an invoice.</small>
                            <div className="card-body mt-3">
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
                            {
                                actionType == 'invoice' ?
                                    <>
                                        <div className=" mt-3 pt-2" style={{ background: '#0bc9931a', textAlign: 'center' }}><h4 style={{ color: '#0bc993' }}>Supplier: {selectedSupplier.name} </h4></div>
                                        <h2 className="card-header">Additional pages</h2>
                                        <small>Add one file to as pdf for invoice.</small></>
                                    : null
                            }
                            {
                                actionType == 'bulk' ?
                                    <><h2 className="card-header">Add Multiple PDF for same supplier</h2>
                                        <small>If your invoice is split across multiple pages, add them here.<br />
                                            In the future, this screen will let you process multiple invoice from the same supplier, but for now please only add pages from the same invoice before proceeding.</small>
                                        <div className=" mt-3"><h6 className="card-header" style={{ color: '#0bc993' }}>Supplier: {selectedSupplier.name} </h6></div></>
                                    : null
                            }
                            {
                                actionType == 'statement' ?
                                    <><h2 className="card-header">Add Statement</h2>
                                        <small>Upload Statement PDF File.</small>
                                        <div className="mt-3"><h6 className="card-header" style={{ color: '#0bc993' }}>Supplier: {selectedSupplier.name} </h6></div></>
                                    : null
                            }

                            {
                                actionType == 'bulk' ?
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
                                    :
                                    <div className="card-body mt-3 py-5">
                                        <div className="mb-3 col-md-12 file-upload-wrapper">
                                            <div className="wrapper-uploader" onClick={() => { document.querySelector("#files").click() }}>
                                                <input className="form-control" type="file" id="files" name="files[]" onChange={(e) => { setFiles(e.target.files); setFileName(e.target.files[0]?e.target.files[0].name:'') }} hidden />
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
                            }

                            <div className="card-body">
                                <div className="mt-2">
                                    <button type="button" onClick={() => { setNextAction(false) }} className="btn btn-default me-2">Back</button>
                                    <button type="button" onClick={() => { saveUploadedItem(); }} className="btn btn-green me-2 width-86">Confirm</button>
                                </div>
                            </div>
                        </div>
                }
            </Modal>
            <Modal open={confirmOpen} onClose={onCloseConfirmModal} classNames={{ modal: 'company-select-modal' }} center>
                <div className="mb-4">
                    <div className="card-body mt-3">
                        <h2 className="card-header">Wait!</h2>
                        <small>If you leave now, your book in will be uncomplete? Do you want to continue later or discard it entirely ?</small>
                        <div className="d-flex">
                            <button type="button" onClick={(e) => { onCloseConfirmModal() }} className={`btn btn-green-borded col-md-6`}>Cancel</button>&nbsp;
                            <button type="button" onClick={(e) => { setConfirmOpen(false); setSupplierOpen(false); }} className={`btn btn-green col-md-6`}>Continue Later</button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={deleteOpen} onClose={onCloseDeleteModal} classNames={{ modal: 'company-select-modal' }} center>
                <div className="mb-4">
                    <div className="card-body mt-3">
                        <h2 className="card-header">Wait!</h2>
                        <small>Are You Sure, You want to delete ?</small>
                        <div className="d-flex">
                            <button type="button" onClick={(e) => { onCloseDeleteModal(); setDeleteId(null) }} className={`btn btn-green-borded col-md-6`}>Cancel</button>&nbsp;
                            <button type="button" onClick={(e) => { deleteCurrentInvoice(); }} className={`btn btn-green col-md-6`}>Delete</button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={deleteSPOpen} onClose={onClosespDeleteModal} classNames={{ modal: 'company-select-modal' }} center>
                <div className="mb-4">
                    <div className="card-body mt-3">
                        <h2 className="card-header">Wait!</h2>
                        <small>Are You Sure, You want to delete this item ?</small>
                        <div className="d-flex">
                            <button type="button" onClick={(e) => { onClosespDeleteModal(); setspDeleteId({}) }} className={`btn btn-green-borded col-md-6`}>Cancel</button>&nbsp;
                            <button type="button" onClick={(e) => { deleteInvoiceData(); }} className={`btn btn-green col-md-6`}>Delete</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
