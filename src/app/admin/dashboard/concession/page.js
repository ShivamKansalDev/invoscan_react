const Concession = ()=>{
    const [fileName, setFileName] = useState('');


    const saveUploadedItem = async () => {
        let formData = new FormData();
        for (let index = 0; index < files.length; index++) {
            formData.append('files[]', files[index])
        }
        const response = await upload_csv(formData);
        if (response && !response.error) {
            // showRowData(response.data);
            // setSupplierOpen(false);
            // fetchData(1);
            console.log("csv uploaded")
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
                <div className="card-body mt-3 py-5">
                    <div className="mb-3 col-md-12 file-upload-wrapper"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}>
                        <div className="wrapper-uploader" onClick={() => { document.querySelector("#files").click() }}>
                            <input className="form-control" type="file" id="files" name="files[]" onChange={handleInputChange} hidden />
                            <div className="d-flex flex-col justify-center space-y-0">
                                <div className="d-flex justify-center">
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
            </div>
        </>
    )
}
export default Concession;