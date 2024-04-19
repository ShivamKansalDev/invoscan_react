'use client';
import { deleteInvoice, getAllInvoices } from "@/api/invoices";
import { useState,useEffect } from "react";
import DataTable from "react-data-table-component";
import ConfirmDeleteModal from "../../adminComponents/ConfirmDeleteModal";
import { toast } from "react-toastify";
import { BookingModal } from "../../adminComponents/BookingModal";


const Invoices = ()=>{
    const [data,setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

    let columns = [
        {
            name: 'Invoice Id',
            selector: row => row.InvoiceId ? row.InvoiceId : 'NA',
        },
        {
            name: 'Customer Id',
            selector: row => row.CustomerId ? row.CustomerId : 'NA',
        },
        {
            name: 'Invoice Date',
            selector: row => row.InvoiceDate ? row.InvoiceDate : 'NA',
        },
        {
            name: 'Vendor Name',
            selector: row => row.VendorName ? row.VendorName : 'NA',
        },
        {
            name: 'Customer Name',
            selector: row => row.CustomerName ? row.CustomerName : 'NA',
        },
        {
            name: 'Sub total',
            selector: row => row.SubTotal ? row.SubTotal : 'NA',
        },
        {
            name: 'View',
            cell: row => (
                <button>
                    <button className="bg-[#ededed] text-[#09ba96] px-4 py-2 rounded-lg" onClick={(e) => setSelectedInvoice(row)}>View</button>
                </button>
            )
        },
        {
            name: 'Delete',
            cell: row => (
                <button>
                    <button className="bg-[#ffecec] text-[#f76666] px-4 py-2 rounded-lg" onClick={(e) => setSelectedInvoice(row?.id)}>Delete</button>
                </button>
            )
        }
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

    useEffect(() => {
        if(selectedInvoice && (typeof selectedInvoice === "number")){
            setShowDeleteModal(!showDeleteModal);
        }else if(selectedInvoice && (typeof selectedInvoice !== "number")){
            setShowBookingModal(!showBookingModal)
        }
    }, [selectedInvoice]);

    async function deleteInvoiceAPI(){
        try{
            const response = await deleteInvoice(selectedInvoice);
            toast.success("Invoice deleted successfully");
            const updateData = data.filter((item) => item?.id !== selectedInvoice);
            setData(updateData);
            setShowDeleteModal(!showDeleteModal);
            setSelectedInvoice(null);
        }catch(error){
            console.log("@#@#@ ERROR: ", error);
            toast.error("Error deleting invoice");
        }
    }

    const fetchData = async () => {
        setLoading(true)
        try{
            const response = await getAllInvoices();
            const data = response.data?.data?.data;
            console.log("@#@# GHGHGH: " ,response.data?.data?.data);
            if (Array.isArray(data) && (data.length > 0)) {
               setData(data);
               setTotalRows(data.count);
            }else {
                setData([])
                setTotalRows(0)
            }
            setLoading(false);
        }catch(error){
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchData();
    },[])
    return(
        <>
            <div className="card mb-4">
                <DataTable
                    title="Invoices"
                    data={data}
                    columns={columns}
                    progressPending={loading}
                    fixedHeader
                    pagination
                    paginationTotalRows={totalRows}
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                />
                <ConfirmDeleteModal
                    subTitle={"Are you sure you want to delete this invoice ?"}
                    open={showDeleteModal}
                    onCloseModal={() => { 
                        setShowDeleteModal(!showDeleteModal);
                        setSelectedInvoice(null);
                    }}
                    deleteProduct={deleteInvoiceAPI}
                />
                {(showBookingModal) && (
                    <BookingModal 
                        open={showBookingModal}
                        invoiceItems={selectedInvoice}
                        loading={loading}
                        onCloseModal={() => {
                            setShowBookingModal(!showBookingModal)
                            setSelectedInvoice(null);
                        }}
                    />
                )}
            </div>
        </>
    )
}
export default Invoices;