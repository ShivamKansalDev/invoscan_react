'use client';
import DataTable from "react-data-table-component";
import React, { useState, useEffect, useLayoutEffect } from "react";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import FeatherIcon from 'feather-icons-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { SelectCompany } from "@/components/SelectCompany";
import { useSelector } from "react-redux";
import { userActions } from "@/lib/features/slice/userSlice";
import { deleteInvoice, getPendingInvoices, markCompleteInvoice } from "@/api/invoices";
import { toast } from "react-toastify";
import BookingModal from "@/components/BookingModal";
import { FilteredDataTable } from "@/components/FilteredDataTable";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
 
export default function Invoices() {
    const {userDetails, selectedCompany, companyList} = useSelector((state) => state.user);
    const { setSelectedCompany } =  userActions;
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalRows, setTotalRows] = useState(0)
    const [results, setResults] = useState(100)
    const [page, setPage] = useState(1)
    const [open, setOpen] = useState(false);
    const [secondOpen, setSecondOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteSPOpen, setDeleteSpOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null)
    const [deleteSPId, setspDeleteId] = useState({})
    const [supplierList, setSupplierList] = useState([]);
    const [invoiceItems, setInvoiceItems] = useState({
        Items: []
    })
    const [invoiceData, setInvoiceData] = useState({
        PackSize: '',
        Description: '',
        Quantity: '',
        QuantityForReport: '',
        Amount: '',
        Reason: '',
        UnitPrice: ''
    })
    const [invoiceItemIndex, setInvoiceItemIndex] = useState()
    const [currentTab, setCurrentTab] = useState('Pending');
    const [actionButtonType, setActionButtonType] = useState('update');
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [company, setCompany] = useState({});

    const [currentUser, setUser] = useState({});
    const [startDate, setStartDate] = useState(moment().startOf('year').toDate());
    const [endDate, setEndDate] = useState(moment().endOf('year').toDate());
    const [supplierId, setSupplierId] = useState('');

    let invoiceTableColumns = ["supplier.name", "InvoiceDate", "InvoiceId", "SubTotal"];

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
                            <FeatherIcon icon="eye" className='menu-icon' />
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
                    <b style={{ paddingLeft: '20px' }} className="delivery-text">{row.Description}</b>
                </div>
            )
        },
        {
            name: 'Quantity',
            cell: row => (
                <div>
                    <input type="text" className="form-control" value={row.Quantity} readOnly />
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
            name: 'Credit packs',
            cell: row => (
                <div>
                    <input type="text" className="form-control" value={row.QuantityForReport} readOnly />
                </div>
            )
        },
        {
            name: 'Reason',
            width: "15%",
            cell: row => (
                <div>
                    <input type="text" className="form-control" value={row.Reason} readOnly />
                </div>
            )
        },
        {
            name: '',
            cell: (row, index) => (
                currentTab === 'Pending' ?
                    <div className="grid-flex">
                        <div>
                            {
                                row.lock !== true ?
                                    <button
                                        onClick={(e) => { showInvoiceData(row, index); setActionButtonType('update') }}
                                    >
                                        {/* <FeatherIcon icon="eye" className='menu-icon' /> */}
                                        <FeatherIcon icon="eye" className='menu-icon' />
                                    </button>
                                    : null
                            }
                        </div>
                        <div>
                            {
                                row.lock !== true ?
                                    <button
                                        onClick={(e) => { setspDeleteId({row, index}); }}
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
                    : null
            )
        }
    ];
    let customStyles = {
        headRow: {
            style: {
                border: 'none',
            },
        },
        class: 'pl-0',
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

    useEffect(() => {
        if(deleteSPId){
            setDeleteSpOpen(true);
        }
    }, [deleteSPId])

    const showRowData = (row, key) => {
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
        console.log("@@@ INDEX: ", key);
        setInvoiceData(rowData)
        setInvoiceItemIndex(key)
        setSecondOpen(true);
    }

    const saveInvoiceItems = () => {
        let updateItems = invoiceItems.Items.map((item, index) => {
            if(invoiceItemIndex == index){
                return {
                    ...item,
                    ...invoiceData
                }
            }
            return item;
        });
        setInvoiceItems((oldItem) => ({
            ...oldItem,
            Items: updateItems
        }))
        setSecondOpen(false)
    }

    const saveNewInvoiceItems = () => {
        invoiceData.lock = false;
        let oldItems = invoiceItems.Items.map((item) => item);
        console.log("before", oldItems);
        oldItems.unshift(invoiceData);
        console.log("after unshift", oldItems);
        oldItems = oldItems.map((item, index) => {
            return {
                ...item,
                index
            }
        })
        console.log("finally", oldItems); 
        setTimeout(() => {
            setInvoiceItems({
                ...invoiceItems,
                Items: oldItems
            });
        }, 500);
        setSecondOpen(false)
    }

    const deleteInvoiceData = () => {
        let { row } = deleteSPId;
        let updateInvoiceItems = invoiceItems.Items.filter((item) => {
            console.log("@@@ DELETE PRESSED: \n\n", item?.index, "!==", row?.index, item?.index !== row?.index)
            return (item?.index !== row?.index)
        })
        updateInvoiceItems = updateInvoiceItems.map((item, itemIndex) => ({...item, index: itemIndex}))
        setInvoiceItems(Object.assign(invoiceItems, {Items: updateInvoiceItems}));
        setDeleteSpOpen(false);
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
        try{
            const response = await markCompleteInvoice(invoiceItems.id, {
                "CustomerId": invoiceItems.CustomerId,
                "InvoiceDate": invoiceItems.InvoiceDate,
                "InvoiceId": invoiceItems.InvoiceId,
                "Items": invoiceItems.Items,
                "SubTotal": invoiceItems.SubTotal,
                "isDelivered": true
            });
            console.log(response.data,'response');
            setInvoiceItems({
                Items: []
            });
            const updateData = data.filter((item) => item?.id !== invoiceItems?.id);
            setData(updateData);
            setOpen(false);
            toast.success("Invoice has been marked as completed.")
        }catch(error){
            console.log("!!!! CMPLT API ERROR: ", error)
        }
    }

    const deleteCurrentInvoice = async () => {
        try{
            const response = await deleteInvoice(deleteId);
            fetchData(currentTab);
            toast.success("Invoice deleted successfully.")
            onCloseDeleteModal();
        }catch(error){
            console.log("!!! INVOICE(screen) DELETE ERROR: ", error);
        }
    }

    const fetchData = async (currentTab) => {
        let companyDetails = selectedCompany;
        // console.log("@@@@ INVOICES: ", companyDetails);
        if(!companyDetails?.id) {
            setShowCompanyModal(true);
            return;
        }
        setLoading(true);
        try{
            let url = (currentTab === 'Pending') ? `/stock/pending/${companyDetails?.id}` : `/stock/delivered/${companyDetails?.id}`;
            const response = await getPendingInvoices(url);
            const rcvdData = response.data?.data;
            setLoading(false);
            if (Array.isArray(rcvdData?.data)) {
                setData(rcvdData?.data);
                setTotalRows(rcvdData?.count);
            }
        }catch(error){
            setData([])
            setTotalRows(0)
            setLoading(false)
            console.log("!!! GET PENDING INVOICES(screen) ERROR: ", error);
        }
    }

    const onCloseModal = () => setOpen(false);
    const onCloseSecondModal = () => setSecondOpen(false);
    const onCloseDeleteModal = () => setDeleteOpen(false);
    const onClosespDeleteModal = () => setDeleteSpOpen(false);

    useEffect(() => {
        let details = JSON.parse(userDetails);
        if((details !== null) || (details !== undefined)){
            setUser(details?.user);
            fetchData('Pending');
        }
    }, []);

    useEffect(() => {
        if(invoiceItems){
            console.log("@@@ UPDATED ITEM: ", invoiceItems.Items)
        }
    }, [invoiceItems])

    let lockedItems = invoiceItems && invoiceItems.Items.filter((Item) => Item.lock === true)

    const onCloseCompanyModal = () => {
        setShowCompanyModal(false);
        setSelectedCompany(null);
    };

    return (
        <>
            <div className="card mb-4">
                <div className="card-body">
                    <div className="mt-2">
                        <button type="button" onClick={() => { setCurrentTab('Pending'); fetchData('Pending') }} className={`btn ${currentTab == 'Pending' ? 'btn-green' : 'btn-green-borded'} me-2`}>Pending</button>
                        <button type="button" onClick={() => { setCurrentTab('Completed'); fetchData('Completed') }} className={`btn ${currentTab == 'Completed' ? 'btn-green' : 'btn-green-borded'} me-2`}>Delivered</button>
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
                                <button type="button" onClick={() => { fetchData(currentTab) }} className={`btn btn-green me-2 width-86 ml-5`}>Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <h4 className="card-header pl-0">{currentTab} Deliveries</h4>
                    </div>
                    <FilteredDataTable
                        tableColumns={invoiceTableColumns}
                        inputProps={{
                            title: "",
                            columns: columns,
                            data: data,
                            progressPending: loading,
                            fixedHeader: true,
                            pagination: true,
                            paginationTotalRows: totalRows,
                            customStyles: customStyles,
                            highlightOnHover: true,
                            pointerOnHover: true
                        }}
                    />
                </div>
            </div>
            <BookingModal
                open={open}
                onCloseModal={onCloseModal}
                invoiceItems={invoiceItems}
                setInvoiceItems={setInvoiceItems}
                invoiceItemsColumns={invoiceItemsColumns}
                loading={loading}
                customStyles={customStyles}
                
                markCompleteCurrentInvoice={markCompleteCurrentInvoice}
                setActionButtonType={setActionButtonType}
                showInvoiceData={showInvoiceData}
            />
            <Modal open={secondOpen} onClose={onCloseSecondModal} center>
                <div className=" mb-4">
                    <small>Pack Size:- {invoiceData.PackSize}</small>
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
                                <label htmlFor="Quantity" className="form-label">Quantity</label>
                                <input className="form-control" type="text" id="Quantity" name="Quantity" onChange={(e) => { setInvoiceData({ ...invoiceData, Quantity: e.target.value, Amount: (parseInt(e.target.value) * parseFloat(invoiceData.UnitPrice)) }); }} value={invoiceData.Quantity} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="QuantityForReport" className="form-label">Credit packs</label>
                                <input className="form-control" type="text" name="QuantityForReport" id="QuantityForReport" onChange={(e) => { setInvoiceData({ ...invoiceData, QuantityForReport: e.target.value }) }} value={invoiceData.QuantityForReport} />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="UnitPrice" className="form-label">Price/unit</label>
                                <input className="form-control" type="text" id="UnitPrice" name="UnitPrice" onChange={(e) => { setInvoiceData({ ...invoiceData, UnitPrice: e.target.value, Amount: (parseInt(invoiceData.Quantity) * parseFloat(e.target.value)) }); }} value={invoiceData.UnitPrice} />
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
                                        : <button type="button" onClick={saveInvoiceItems} className="btn btn-green me-2">Update</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal open={deleteOpen} onClose={onCloseDeleteModal} classNames={{ modal: 'company-select-modal' }} center>
                <div className=" mb-4">
                    <div className="card-body mt-3">
                        <h2 className="card-header">Wait!</h2>
                        <small>Are You Sure, You want to delete this invoice?</small>
                        <div className="d-flex">
                            <button type="button" onClick={(e) => { onCloseDeleteModal(); setDeleteId(null) }} className={`btn btn-green-borded w-[100%] me-1`}>Cancel</button>&nbsp;
                            <button type="button" onClick={(e) => { deleteCurrentInvoice(); }} className={`btn btn-green w-[100%] ms-1`}>Delete</button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={deleteSPOpen} onClose={onClosespDeleteModal} classNames={{ modal: 'company-select-modal' }} center>
                <div className=" mb-4">
                    <div className="card-body mt-3">
                        <h2 className="card-header">Wait!</h2>
                        <small>Are You Sure, You want to delete this item?</small>
                        <div className="d-flex">
                            <button type="button" onClick={(e) => { onClosespDeleteModal(); setspDeleteId(null) }} className={`btn btn-green-borded col-md-6`}>Cancel</button>&nbsp;
                            <button type="button" onClick={(e) => { deleteInvoiceData(); }} className={`btn btn-green col-md-6`}>Delete</button>
                        </div>
                    </div>
                </div>
            </Modal>
            <SelectCompany 
                open={showCompanyModal}
                onCloseModal={onCloseCompanyModal}
                company={company}
                setCompany={(item) => setCompany(item)}
            />
        </>
    )
}
