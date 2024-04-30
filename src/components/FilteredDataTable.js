import React from "react";
import DataTable from "react-data-table-component";

import { Search } from "@/app/admin/adminComponents/Search";

function FilteredDataTable({
    inputProps = {},
    tableColumns = []
}){
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const [filteredData, setFilteredData] = React.useState([]);

    React.useEffect(() => {
        if(filterText){
            const result = searchDetails();
            setFilteredData(result)
        }
    }, [filterText]);

    function searchDetails(){
        const data = inputProps?.data;
        return (Array.isArray(data)) && data.filter((item) => {
            let name = "";
            const itemNames = Object.keys(item).filter((subItem) => {
                return tableColumns.some((nestedItem) => {
                    if(nestedItem?.includes(".")){
                        const splitNestedItem = nestedItem.split(".");
                        return subItem.toLowerCase() === splitNestedItem[0].toLowerCase();
                    }
                    return subItem.toLowerCase() === nestedItem.toLowerCase()
                })
            });
            const filterIndex = itemNames.findIndex((subItem) => {
                // console.log("$$$ ITEM NAMES: ", subItem)    
                if((typeof item[subItem] === "object") && !!item[subItem] && item[subItem] !== "null"){
                    return tableColumns.some((nestedItem) => {
                        if(nestedItem?.includes(".")){
                            const splitNestedItem = nestedItem.split(".");
                            if(splitNestedItem[0] === subItem){}
                            let current = Object.assign({}, item);
                            for (let i = 0; i < splitNestedItem?.length - 1; i++) {
                                current = current[splitNestedItem[i]];
                            }
                            const subItemValue = current[splitNestedItem[splitNestedItem?.length - 1]];
                            const searchSubItem = subItemValue.substring(0, filterText.length)
                            console.log("*** SOME: ", searchSubItem.toLowerCase(), " === ", filterText.toLowerCase(), " ---> ", (searchSubItem.toLowerCase() === filterText.toLowerCase()))    
                            return searchSubItem.toLowerCase() === filterText.toLowerCase()
                        }
                        return false;
                    })
                }else{
                    const subItemValue = `${item[subItem]}`.toLowerCase();
                    const searchSubItem = subItemValue.substring(0, filterText.length)
                    return (searchSubItem === filterText.toLowerCase());
                }
            })
            if(filterIndex > -1){
                const keyName = itemNames[filterIndex];
                if((item[keyName] !== null) && (item[keyName] !== "null")){
                    name = `${item[keyName]}`;
                }
                console.log("^^^ FILTER INDEX: ", filterIndex, item[keyName])
            }
            if(!name){
                return false;
            }
            const searchTitle = name?.substring(0, filterText.length);
            if(searchTitle.toLowerCase() === filterText.toLowerCase()){
                return true;
            }
            return false;
        })
    }

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
          if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
          }
        };
        return (
            <Search 
                search={filterText}
                setSearch={setFilterText}
                onClear={handleClear} 
            />
        );
    }, [filterText, resetPaginationToggle]);

    let dataTableProps = {
        ...inputProps,
        data: (filterText)? filteredData : inputProps?.data,
        paginationTotalRows: (filterText)? filteredData.length : (inputProps?.data?.length || "0")
    }
      
    return (
        <DataTable
            {...dataTableProps}
            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
            subHeader 
            subHeaderComponent={subHeaderComponentMemo} 
            subHeaderAlign={"left"}
            persistTableHead
        />
    )
}

export {FilteredDataTable};