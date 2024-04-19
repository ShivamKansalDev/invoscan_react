"use client"
import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import FeatherIcon from "feather-icons-react";
import {debounce} from "lodash";
import { toast } from 'react-toastify';


import { master_csv, upload_csv } from "../../../../api/auth";

const MasterCsv = ()=>{
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [fileName, setFileName] = useState('');
    const [files, setFiles] = useState([]);
    const [thumbnail, setThumbnail] = useState('');


    let columns = [
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
            name: 'Price',
            selector: row => row.price,
        },
        {
            name: 'Concession Price',
            selector: row => (row.concessionPrice ? row.concessionPrice : "NA"),
        },
        {
            name: 'Pack Size',
            selector: row => row.pack_size,
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

    // const fetchData = async page => {
    //     setPage(page)
    //     setLoading(true)
    //     console.log('api hit')
    //     //const response = await Request.get('csv?search=Cinnarizine');
    //     try {
    //         const response = await master_csv("Cinnarizine");
    //         console.log('cinnarizine', response.data);
    //         setLoading(false)
    //         if (response && response.data && response.data.count > 0) {
    //             setData(response.data)
    //             setTotalRows(response.data.count)
    //         } else {
    //             setData([])
    //             setTotalRows(0)
    //         }
    //         console.log('end')
    //     } catch(error){
    //         console.log('master csv error', error);
    //     }
    //     setLoading(false)

    //     console.log('function ends')
    // }
    // const fetchData = async () => {
    //     //setLoading(true)
    //     try{
    //         const response = await master_csv(search);
    //         const data = response.data;
    //         console.log(data,'data');
    //         if (data) {
    //            setData(data);
    //            setTotalRows(data.length);
    //            setLoading(false);
    //            setSearch("");
    //         }else {
    //             setData([])
    //             setTotalRows(0)
    //         }
           
    //     }catch(error){
    //         console.log(error);
    //     }
     
    // }




    const fetchData = async () => {
        console.log("#$#$# SEARCH: ", search);
        setLoading(true);
        try {
            const response = await master_csv(search);
            console.log(response,"ddded")
           const data = await response.data
           setData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
          setData([]);
        } finally {
          setLoading(false);
        }
      };

    let myTimer = useRef(null);

    useEffect(() => {
        if(search){
            if(myTimer){
                clearTimeout(myTimer)
            }
            myTimer = setTimeout(() => {
                fetchData();
            }, 1000);
        }
  }, [search]);


    const saveUploadedItem = async () => {
        let formData = new FormData();
        for (let index = 0; index < files.length; index++) {
            formData.append('file', files[index])
        }
        try{
            const response = await upload_csv(formData);
            toast("CSV File uploaded successfully");
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

 
 
    return(
        <>
         <div className="card mb-4">
            MasterCsv
            
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
                <button type="button" onClick={() => { saveUploadedItem(); }} className="btn btn-green">Confirm</button>
            </div>

            <form>
                <input  placeholder="search"  value={search}
                    onChange={(e) => {
                        setSearch(e.target.value.trimStart()    
                    )}}
                />
            </form>
            <div className="card-body">
                <DataTable
                    title="Cinnarizine"
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
        </>
    )
}
export default MasterCsv;