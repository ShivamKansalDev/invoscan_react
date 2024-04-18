'use client';
import { CompaniesDelete, CompaniesList, UserAuth, usersList } from "@/api/auth";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-responsive-modal";

const Users = ()=>{
    const [data,setData] = useState([]);
    const [dataCom,setDataCom] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [open, setOpen] = useState(false);
    const [navigation,setNavigation] = useState();
    const [companyList, setCompanyList] = useState([]);

    let columns = [
        {
            name: 'Email',
            selector: row => row.email ? row.email : 'NA',
        },
        {
            name: 'First Name',
            selector: row => row.firstName ? row.firstName : 'NA',
        },
        {
            name: 'Last Name',
            selector: row => row.lastName ? row.lastName : 'NA',
        },
        {
            name: 'Role',
            selector: row => row.role ? row.role : 'NA',
        },
        {
            name: 'Address',
            selector: row => row.address ? row.address : 'NA',
        },
        {
            name: 'Companies',
            cell: row =>{
                   return <button className="bg-[#ededed] text-[#09ba96] px-4 py-2 rounded-lg" onClick={()=>{
                    setOpen(true)
                    setNavigation(row.id)
                }}>Companies</button>
            }
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

    const fetchData = async () => {
        setLoading(true)
        try{
            const response = await usersList();
            const data = response.data.data;
            if (data && data) {
               setData(data);
               setTotalRows(data.length);
               setLoading(false);
            }else {
                setData([])
                setTotalRows(0)
            }
           
        }catch(error){
            console.log(error);
        }
    }
    const fetchDataCom = async (userId) => {
        console.log(userId);
        try{userId
            const response = await CompaniesList(userId);
            setCompanyList(response.data?.data)
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchData();
    },[])

    useEffect(() => {
        if(navigation){
            const userId = navigation
            fetchDataCom(userId);
        }
    }, [navigation]);

    const onCloseModal = () => setOpen(false);

    const deleteCurrentUsers = async (userId) => {
        const response = await CompaniesDelete(userId);
        if (response) {
            fetchData();
        }
    }
    //  compaones 
    let companiesColumn = [
        {
            name: 'Email',
            selector: row => row.email ? row.email : 'NA',
        },
        {
            name: 'Name',
            selector: row => row.name ? row.name : 'NA',
        },
        {
            name: 'Description',
            selector: row => row.description ? row.description : 'NA',
        },
        {
            name: 'Invoice Counter',
            selector: row => (typeof row.invoiceCounter === "number" || row.invoiceCounter === "0") ? row.invoiceCounter : 'NA',
        },
        {
            name: 'Monthly Limit',
            selector: row => ( typeof row.invoiceMonthlyLimit === "number" || row.invoiceMonthlyLimit === "0") ? row.invoiceMonthlyLimit : 'NA',
        },
        {
            name: 'Add Count',
           cell:row =>(
            <button className="bg-[#ededed] text-[#09ba96] px-4 py-2 rounded-lg">Add Count</button>
           )
        },
        {
            name: 'Delete',
            cell: row => (
                <button>
                <button className="bg-[#ffecec] text-[#f76666] px-4 py-2 rounded-lg" onClick={(e) => { deleteCurrentUsers(row.id)}}>Delete</button>
            </button>
            )
        },
    ];
console.log(companyList,'companyList');

    return(
        <>
         <div className="card mb-4">
            <DataTable
                title="Users"
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

        <Modal open={open} classNames={{
                modal: 'users-modal',
            }} onClose={onCloseModal} center>
                <div className="container-fluid">
                    <div className="row">
                        <DataTable
                            title="Companies"
                            data={companyList}
                            columns={companiesColumn}
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
            </Modal>
         </div>
        </>
    )
}
export default Users;