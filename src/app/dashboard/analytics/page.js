'use client';
import DataTable from "react-data-table-component";
import React, { useState, useEffect } from "react";
import Request from "@/Request";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Analytics() {
    let columns = [
        {
            name: 'Product',
            selector: row => row.product,
        },
        {
            name: 'Average Cost',
            cell: row => (
                <div className="text-light-green">£{parseFloat(row.averageCostPrice).toFixed(2)}</div>
            )
        },
        {
            name: 'Average Retail',
            cell: row => (
                <div className="text-light-green">£{parseFloat(row.averageRetailPrice).toFixed(2)}</div>
            )
        },
        {
            name: 'Price Movement',
            selector: row => row.priceMovt,
        },
        {
            name: 'Total Volume',
            selector: row => row.totalVolume,
        },
        {
            name: 'Total Spent',
            cell: row => (
                <div className="text-light-green">£{parseFloat(row.totalSpent).toFixed(2)}</div>
            )
        },
        {
            name: 'Cheapest Supplier',
            cell: row => (
                <div className="text-light-green">{row.cheapestSupplier}</div>
            )
        },
        {
            name: 'Retail Margin',
            cell: row => (
                <div className="text-light-green">£{parseFloat(row.averageRetailPriceMargin).toFixed(2)}</div>
            )
        },
        {
            name: 'DT Price',
            selector: row => row.csvDtPrice,
        },
        {
            name: 'Profit / Loss',
            cell: row => (
                <div></div>
            )
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="grid-flex">
                    <button
                        className="btn rounded-pill btn-default"
                        onClick={(e) => showRowData(row)}
                    >
                        <i className='bx bx-show menu-icon'></i>
                    </button>
                </div>
            )
        },
    ];
    let invoiceItemColumns = [
        {
            name: 'Vendor Name',
            selector: row => row.supplier.name,
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
            name: 'Qty',
            selector: row => row.Quantity,
        },
        {
            name: 'Sub Total',
            cell: row => (
                <div className="text-light-green">£{parseFloat(row.Amount).toFixed(2)}</div>
            )
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="grid-flex">
                    <button
                        onClick={(e) => showInnerRowData(row)}
                    >
                        <i className='bx bx-show menu-icon'></i>
                    </button>
                    <button
                        onClick={(e) => deleteCurrentInvoice(row.id)}
                    >
                        <i className='bx bx-trash menu-icon menu-icon-red'></i>
                    </button>
                </div>
            )
        },
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
    const [results, setResults] = useState(10)
    const [invoiceItems, setInvoiceItems] = useState([])
    const [uploadedInvoiceItems, setUploadedInvoiceItems] = useState({});
    const [chartDataSets, setChartDataSets] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);

    const [chartQuantDataSets, setChartQuantDataSets] = useState([]);
    const [chartQuantLabels, setChartQuantLabels] = useState([]);

    const [chartUnitLabels, setChartUnitLabels] = useState([]);
    const [chartUnitDataSets, setChartUnitDataSets] = useState([]);

    const [page, setPage] = useState(1)

    const [open, setOpen] = useState(false);
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [distributionOpen, setDistributionOpen] = useState(false);

    const [currentTab, setCurrentTab] = useState('Pricing');

    const fetchData = async page => {
        setPage(page)
        setLoading(true)
        let company = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : { id: '' };
        const response = await Request.get(`/stock/stock-by-company/${company.id}`);
        setLoading(false)
        if (response.data && response.data.length > 0) {
            setData(response.data)
            setTotalRows(response.data.length)
            let chartQuantArray = [];
            let chartUnitArray = [];
            let chartQuantUnitLabelArray = [];
            response.data.map((data, index) => {
                if(chartQuantArray[data.cheapestSupplier] == undefined) {
                    chartQuantArray[data.cheapestSupplier] = 0;
                }
                chartQuantArray[data.cheapestSupplier] += parseFloat(data.totalVolume);

                if(chartUnitArray[data.cheapestSupplier] == undefined) {
                    chartUnitArray[data.cheapestSupplier] = 0;
                }
                chartUnitArray[data.cheapestSupplier] += parseFloat(data.totalSpent);
                if(!chartQuantUnitLabelArray.includes(data.cheapestSupplier)) {
                    chartQuantUnitLabelArray.push(data.cheapestSupplier)
                } 
            })
            
            if(chartQuantUnitLabelArray) {
                let datasetsQntArray = [];
                let datasetsUnitArray = [];
                chartQuantUnitLabelArray.map((key) => {
                    datasetsQntArray.push(chartQuantArray[key])
                    datasetsUnitArray.push(chartUnitArray[key].toFixed(2))
                })
                setChartQuantLabels(chartQuantUnitLabelArray)
                setChartUnitLabels(chartQuantUnitLabelArray)
                setChartQuantDataSets([{
                    label: '',
                    data: datasetsQntArray,
                    backgroundColor: '#B0BA35',
                }]);
                setChartUnitDataSets([{
                    label: '',
                    data: datasetsUnitArray,
                    backgroundColor: '#DA3A0F',
                }]);
            }            
            
        }
    }
    const showRowData = async row => {
        let company = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : { id: '' };
        const response = await Request.post(`/stock/filter-stock/${company.id}`, { search: row.pip_code });
        if (response.data && response.data.length > 0) {
            setInvoiceItems({
                row: row,
                items: response.data
            });
            let datasetsArray = [];
            let labelArray = [];
            let InvoiceUnitPrice = [];
            let DrugTarrifPrice = [];
            let RetailPrice = [];
            let TradePrice = [];
            response.data.map((data, index) => {
                InvoiceUnitPrice.push(parseFloat(data.UnitPrice))
                DrugTarrifPrice.push(parseFloat(data.csvRetailPrice))
                RetailPrice.push('')
                TradePrice.push('')

                labelArray.push(data.InvoiceDate)
            })
            datasetsArray.push({
                label: 'Invoice Unit Price',
                data: InvoiceUnitPrice,
                backgroundColor: '#B0BA35',
            })
            datasetsArray.push({
                label: 'Drug Tarrif Price',
                data: DrugTarrifPrice,
                backgroundColor: '#DA3A0F',
            })
            datasetsArray.push({
                label: 'Retail Price',
                data: RetailPrice,
                backgroundColor: '#35999E',
            })
            datasetsArray.push({
                label: 'Trade Price',
                data: TradePrice,
                backgroundColor: '#DA0FD4',
            })
            setChartLabels(labelArray);
            setChartDataSets(datasetsArray);
            setOpen(true);
        }
    }

    const showInnerRowData = async row => {
        let company = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : { id: '' };
        const response = await Request.post(`/stock/get-stocks/${company.id}`, { search: row.pip_code });
        if (response.data && response.data.data && response.data.data[0]) {
            setUploadedInvoiceItems(response.data.data[0]);
            setInvoiceOpen(true);
        }
    }

    const deleteCurrentInvoice = async () => {
        if (window.confirm('Are you sure, You want to delete?')) {

        }
    }

    const [currentUser, setUser] = useState({});

    const onCloseModal = () => setOpen(false);
    const onCloseInvoiceModal = () => setInvoiceOpen(false);
    const onCloseDistributionModal = () => setDistributionOpen(false);

    useEffect(() => {
        let user = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null;
        setUser(user);
        fetchData(1);
    }, []);

    return (
        <div className="card mb-4">
            <div className="row">
                <div className="col-md-9">
                    <h3 className="card-header">Analytics</h3>
                </div>
                <div className="col-md-3">
                    <button type="button" style={{float: 'right'}} onClick={(e) => { setDistributionOpen(true) }} className={`btn btn-green mt-3`}>Supplier Distribution</button>
                </div>
            </div>
            <div className="">
                <DataTable
                    title=""
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
            <Modal open={distributionOpen} classNames={{
                modal: 'booking-modal',
            }} onClose={onCloseDistributionModal} center>
                <div className="card mb-4">
                    <h5 className="card-header">All Products</h5>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <Bar
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Total Quantities',
                                            },
                                        },
                                    }}
                                    data={{
                                        labels: chartQuantLabels,
                                        datasets: chartQuantDataSets,
                                    }}
                                />
                            </div>
                            <div className="col-md-6">
                                <Bar
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Unit Prices',
                                            },
                                        },
                                    }}
                                    data={{
                                        labels: chartUnitLabels,
                                        datasets: chartUnitDataSets,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal open={open} onClose={onCloseModal} center>
                <div className="mb-4">
                    <h5 className="card-header">{invoiceItems.row ? invoiceItems.row.product : ''} <small style={{ paddingLeft: '20px' }}>( Pack size - )</small></h5>
                    <div className="mt-2">
                        <button type="button" onClick={() => { setCurrentTab('Pricing'); }} className={`btn ${currentTab === 'Pricing' ? 'btn-green' : 'btn-green-borded'} me-2`}>Pricing Details</button>
                        <button type="button" onClick={() => { setCurrentTab('Invoice'); }} className={`btn ${currentTab === 'Invoice' ? 'btn-green' : 'btn-btn-green-borded'} me-2`}>Invoice Details</button>
                    </div>
                    {
                        currentTab === 'Pricing' ?
                            <div className="card-body">
                                <Bar
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                            },
                                            title: {
                                                display: true,
                                                text: (invoiceItems.row ? invoiceItems.row.product : ''),
                                            },
                                        },
                                    }}
                                    data={{
                                        labels: chartLabels,
                                        datasets: chartDataSets,
                                    }}
                                />
                            </div>
                            : null
                    }
                    {
                        currentTab === 'Invoice' ?
                            <div className="card-body">
                                <DataTable
                                    title=""
                                    columns={invoiceItemColumns}
                                    data={invoiceItems.items}
                                    progressPending={loading}
                                    fixedHeader
                                    pagination
                                    customStyles={customStyles}
                                    highlightOnHover
                                    pointerOnHover
                                />
                            </div>
                            : null
                    }
                </div>
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
                                        <small style={{ paddingLeft: '20px' }}>Make sure the information below is correct.</small>
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
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}