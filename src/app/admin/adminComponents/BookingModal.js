"use client";
import { Modal } from 'react-responsive-modal';
import { Document, Page, pdfjs } from 'react-pdf';
import DataTable from "react-data-table-component";
import FeatherIcon from 'feather-icons-react';
import { markCompleteInvoice } from '@/api/invoices';
import { toast } from 'react-toastify';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function BookingModal({
    open = false,
    onCloseModal = () => {},
    invoiceItems = {},
    loading = false,
    fetchData = () => {}
}){
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
                (!invoiceItems?.isDelivered) ?
                    <div className="grid-flex">
                        <div>
                            {
                                row.lock !== true ?
                                    <button
                                        onClick={(e) => { }}
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
                                        onClick={(e) => { }}
                                    >
                                        <i className='bx bx-trash menu-icon menu-icon-red'></i>
                                    </button>
                                    : null
                            }
                        </div>
                        <div>
                            {
                                row.lock !== true ?
                                    <button onClick={(e) => {}}>
                                        <FeatherIcon icon="unlock" className='menu-icon' />
                                    </button>
                                    :
                                    <button onClick={(e) => {}}>
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

    const markCompleteCurrentInvoice = async () => {
        console.log("@@@@ API: ", invoiceItems);
        try{
            const response = await markCompleteInvoice(invoiceItems.id, {
                "CustomerId": invoiceItems.CustomerId,
                "InvoiceDate": invoiceItems.InvoiceDate,
                "InvoiceId": invoiceItems.InvoiceId,
                "Items": invoiceItems.Items,
                "SubTotal": invoiceItems.SubTotal,
                "isDelivered": true
            });
            toast.success("Invoice has been marked as completed.");
            console.log(response.data,'response');
            onCloseModal();
            fetchData();
        }catch(error){
            console.log("!!!! CMPLT API ERROR: ", error)
        }
    }

    let lockedItems = (invoiceItems) && invoiceItems.Items.filter((Item) => Item.lock === true)

    return(
        <Modal open={open} classNames={{
            modal: 'booking-modal',
        }} onClose={onCloseModal} center>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4">
                        {
                            invoiceItems.invoiceUrl && invoiceItems.invoiceUrl.map((invoice, key) => {
                                console.log(invoice.url)
                                return(
                                    <Document key={key} file={invoice.url} className="pdf-section">
                                        <Page  pageNumber={1}/>
                                    </Document>
                                )
                            })
                        }
                    </div>
                    <div className="col-md-8">
                        {
                            invoiceItems ?
                                <div className=" mb-4">
                                    <h5 className="card-header">{invoiceItems.supplier && invoiceItems.supplier.name}</h5>
                                    <small>Make sure the information below is correct.</small>
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
                                        {
                                            (invoiceItems?.isDelivered === false)?
                                                <div className="pull-right" style={{ float: 'right' }}>
                                                    <button className="btn btn-green" type="button" onClick={() => { }}>Add New</button>
                                                </div>
                                                : null
                                        }
                                        <DataTable
                                            title={`Delivery products (${invoiceItems?.Items ? invoiceItems?.Items?.length : 0})`}
                                            columns={invoiceItemsColumns}
                                            data={invoiceItems?.Items}
                                            progressPending={loading}
                                            fixedHeader
                                            pagination
                                            paginationTotalRows={invoiceItems?.Items ? invoiceItems?.Items.length : 0}
                                            customStyles={customStyles}
                                            highlightOnHover
                                            pointerOnHover
                                        />
                                    </div>
                                    {
                                        (!invoiceItems?.isDelivered) ?
                                            <div className="mt-2">
                                                <button style={{ float: 'right' }} type="submit" disabled={lockedItems.length !== invoiceItems?.Items?.length} onClick={markCompleteCurrentInvoice} className="btn btn-green me-2">Mark as complete</button>
                                            </div>
                                            : null
                                    }

                                </div>
                                : null
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export {BookingModal};