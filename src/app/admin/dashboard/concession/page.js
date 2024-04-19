'use client'
import { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import DataTable from "react-data-table-component";

import { concessionList, upload_csv } from "@/api/auth";
import useDebounce from "@/hooks/useDebounce";
import { Search } from "../../adminComponents/Search";

const Concession = ()=>{
    const [fileName, setFileName] = useState('');
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    let columns = [
        {
            name: 'Pack Size',
            // selector: row => (row.supplier && row.supplier.name ? row.supplier.name : 'NA'),
            selector: row => row.packSize,
        },
        {
            name: 'Drug',
            selector: row => row.drug,
        },
        {
            name: 'Concession Price',
            selector: row => (row.priceConcession ? row.priceConcession : "NA"),
        },
        // {
        //     name: 'Actions',
        //     cell: row => (
        //         <div className="grid-flex">
        //             <button
        //                 onClick={(e) => {}}
        //             >
        //                 <FeatherIcon icon="edit-3" className='menu-icon' />
        //             </button>
        //             <button
        //                 onClick={(e) => {}}
        //             >
        //                 <i className='bx bx-trash menu-icon menu-icon-red'></i>
        //             </button>
        //         </div>
        //     )
        // }
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
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await concessionList();
                const data = response.data;
                setData(data);
                setTotalRows(data.length)
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]);
                setTotalRows(0);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const saveUploadedItem = async () => {
        let formData = new FormData();
        for (let index = 0; index < files.length; index++) {
            formData.append('file', files[index])
        }
        try{
            const response = await upload_csv(formData, "concession");
            toast("CSV File uploaded successfully");
        }catch(error){
            console.log("!!! CSV Upload error: ", error);
        }
    }

    const [files, setFiles] = useState([]);

    const [thumbnail, setThumbnail] = useState('');

    const handleInputChange = (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            setThumbnail(URL.createObjectURL(file));
            setFileName(file ? file.name: "");
            setFiles(e.target.files);
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
                Concession
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

                {/* <Search 
                    search={search}
                    setSearch={setSearch}
                /> */}

                <div className="card-body">
                    <DataTable
                        title="Concession List"
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
export default Concession;