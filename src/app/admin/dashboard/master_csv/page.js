"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import FeatherIcon from "feather-icons-react";
import {debounce} from "lodash";
import { toast } from 'react-toastify';

import { master_csv, master_csvDelete, master_csvEdit, upload_csv } from "../../../../api/user";
import useDebounce from "@/hooks/useDebounce";
import { Search } from "../../adminComponents/Search";
import ConfirmDeleteModal from "../../adminComponents/ConfirmDeleteModal";
import EditModal from "../../adminComponents/EditModal";

const MasterCsv = ()=>{
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [fileName, setFileName] = useState('');
    const [files, setFiles] = useState([]);
    const [thumbnail, setThumbnail] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    let columns = [
        {
            name: 'Pack Size',
            selector: row => row.pack_size,
        },
        {
            name: 'Company',
            // selector: row => (row.supplier && row.supplier.name ? row.supplier.name : 'NA'),
            selector: row => row.company,
        },
        {
            name: 'Product Name',
            selector: row => row.product_name,
        },
        // {
        //     name: 'DT Price',
        //     selector: row => (row.dtprice ? ),
        // },
        {
            name: 'Concession Price',
            selector: row => (row.concessionPrice ? row.concessionPrice : "NA"),
        },
        {
            name: 'Price',
            selector: row => row.price,
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="grid-flex">
                    <button
                        onClick={(e) => {
                            setSelectedProduct(row);
                            setShowEditModal(!showEditModal);
                            console.log("@@@@ ROW: ", row);
                        }}
                    >
                        <FeatherIcon icon="edit-3" className='menu-icon' />
                    </button>
                    <button
                        onClick={(e) => {
                            setSelectedProduct(row);
                            setShowDeleteModal(!showDeleteModal)
                        }}
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

    const debouncedSearch = useDebounce(search, 1000);


    const fetchData = useCallback(async() => {
        console.log("#$#$# SEARCH: ", debouncedSearch);
        if(debouncedSearch){
            setLoading(true);
            try {
                const response = await master_csv(debouncedSearch);
                const data = response.data;
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        }
    }, [debouncedSearch])


    useEffect(() => {
        if(debouncedSearch){
            fetchData();
        }
    }, [debouncedSearch]);

    const saveUploadedItem = async () => {
        let formData = new FormData();
        for (let index = 0; index < files.length; index++) {
            formData.append('file', files[index])
        }
        try{
            const response = await upload_csv(formData);
            toast.success("CSV File uploaded successfully");
            setFileName("");
        }catch(error){
            console.log("!!! CSV Upload error: ", error);
        }
    }

    const handleInputChange = (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            setThumbnail(URL.createObjectURL(file));
            setFileName(file ? file.name: "");
            setFiles(e.target.files);
            console.log("@#@#@ ADDED FILES: ", e.target.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        console.log('handleDragOver');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        console.log('handleDragOver');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setThumbnail(URL.createObjectURL(file));
            setFileName(file.name);
            setFiles([file]);
        }
    };

    async function deleteProduct(id){
        try{
            const response = await master_csvDelete(id);
            const updateData = data.filter((item) => item?.id !== id);
            setData(updateData);
            toast.success('Product Deleted successfully.');
            setShowDeleteModal(!showDeleteModal);
            setSelectedProduct(null);
        }catch(error){
            console.log("!!!!!! ERROR: ", error);
        }
    }

    async function editProduct(id, newData) {
        try {
            const response = await master_csvEdit(id, newData);
            console.log("@#@#@ EDIT SUCCESS: ", response.data);
            setShowEditModal(!showEditModal);
            toast.success("CSV file edited successfully");
            fetchData();
        } catch (error) {
            console.log("master csv edit error", error);
        }
    }

 
 
    return(
        <>
            <div className="card mb-4">
                MasterCSV
                
                <div className="card-body my-0">
                    <div className="mb-3 col-md-12 file-upload-wrapper"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}>
                        <div className="wrapper-uploader" onClick={() => { document.querySelector("#files").click() }}>
                            <input className="form-control" type="file" id="files" name="files[]" onChange={handleInputChange} hidden />
                            <div className="d-flex flex-col justify-center space-y-0">
                                <div className="d-flex justify-center mt-0">
                                    <FeatherIcon icon="upload-cloud" className='menu-icon' />
                                </div>
                                
                                {
                                    fileName ?
                                        <a className="text-center">{fileName}</a>
                                        : 
                                        (
                                            <>
                                                <p className="text-center">Browse File</p>
                                                <p className="text-center leading-3">or</p>
                                                <p className="text-center">Drag and Drop to Upload</p>
                                            </>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body d-flex justify-center mt-[-30px]">
                    <button disabled={files.length==0} type="button" onClick={() => { saveUploadedItem(); }} className="btn btn-green">Confirm</button>
                </div>

                <Search 
                    search={search}
                    setSearch={setSearch}
                />
                <div className="card-body">
                    <DataTable
                        title="Master CSV List"
                        columns={columns}
                        data={debouncedSearch? data : []}
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
            <ConfirmDeleteModal
                open={showDeleteModal}
                onCloseModal={() => { 
                    setShowDeleteModal(!showDeleteModal);
                    setSelectedProduct(null);
                }}
                deleteProduct={() => deleteProduct(selectedProduct?.id)}
            />
            <EditModal
                open = {showEditModal}
                onCloseModal={()=>{
                    setShowEditModal(!showEditModal);
                    setSelectedProduct(null);
                }}
                editProduct={(newData) => editProduct(selectedProduct?.id, newData)}
                data={selectedProduct}
            />
        </>
    )
}
export default MasterCsv;