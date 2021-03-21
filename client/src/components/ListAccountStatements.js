import React, {useEffect, useState} from 'react';
import {HEADINGS} from "./constants";
import DataTable from "./DataTable";
import "./table.css";
import Pagination from "./Pagination";
const config = require("./config");

function ListAccountStatements() {
    const [accountStatements, setAccountStatements] = useState([]);
    const [row, setRowData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalAccountStatement, setTotalAccountStatements] = useState(0)
    const [sortedObj, setSortedObj] = useState({columnName: "", isSorted: false, isSortedAsc: false});

    // server side sorting needs to be implemented
    function handleSort(colName, colIndex){
        const nextIsSorteObj = {...sortedObj};
        
        if (sortedObj.columnName === "" ||sortedObj.columnName === colName) {
            if(!sortedObj.isSorted) {
                nextIsSorteObj.isSorted = true;
                nextIsSorteObj.isSortedAsc = true;
            } else {
                nextIsSorteObj.isSortedAsc = !nextIsSorteObj.isSortedAsc;
            }
        } else {
            nextIsSorteObj.isSorted = true;
            nextIsSorteObj.isSortedAsc = true;
        }

        setSortedObj({columnName: colName, isSorted: nextIsSorteObj.isSorted, isSortedAsc: nextIsSorteObj.isSortedAsc});
        
        const sortedRowArr = [...row]
        
        if (nextIsSorteObj.isSortedAsc) {
            if (colIndex === 4) {
                sortedRowArr.sort((a, b) => (Date.parse(a[colIndex]) > Date.parse(b[colIndex])) ? 1 : -1);
            } else {
                sortedRowArr.sort((a, b) => (a[colIndex] > b[colIndex]) ? 1 : -1);
            }
            
        } else{
            if (colIndex === 4) {
                sortedRowArr.sort((a, b) => (Date.parse(a[colIndex]) > Date.parse(b[colIndex])) ? -1 : 1);
            }else {
                sortedRowArr.sort((a, b) => (a[colIndex] > b[colIndex]) ? -1 : 1);
            }
            
        }
        
        setRowData(sortedRowArr);
    }

    const handlePagination = (number) => {
        setCurrentPage(number);
    }

    const debounce = (fn, delay) => {
        let setTimeoutID;
        return function(...args) {
            if (setTimeoutID) {
                clearTimeout(setTimeoutID);
            }
            setTimeoutID = setTimeout(() => {
                fn(...args)
            }, delay);
        }
    }

    useEffect(() => {
        fetchAccountStatements();
    }, [currentPage])

    const fetchAccountStatements = async() => {
        try{
            console.log("==currentPage inside fetchAccountStatements===", currentPage);
            const response = await fetch(`${config.getAccountStatementsURL}?currentPage=${currentPage}&pageSize=${pageSize}`);
            const data = await response.json();
            console.log("===data====", data);
            data.accountStatements.forEach( accountStatement => accountStatement.dateTime = new Date(accountStatement.dateTime).toString());
            setAccountStatements(data.accountStatements);
            const result = data.accountStatements.map(({ folioNumber, unitPrice, unitsBought, totalPrice, dateTime, userID }) => [folioNumber, unitPrice, unitsBought, totalPrice, dateTime, userID]);
            console.log("===result====", result);
            setRowData(result);
            setTotalAccountStatements(data.totalItems)
        }catch(err) {
            console.log("Error fetching data : ", err);
        }
    }

    return(
        <div className="listpod">
            <h1 className="left">Account Statements</h1>
            <div>
                <DataTable headings={HEADINGS} rows={row} sortedObj={sortedObj} changeHandler={handleSort}/>
                <Pagination  recordsPerPage={pageSize} totalRecords={totalAccountStatement} changeHandler={handlePagination}/>
            </div>
            
        </div>
    )
}

export default ListAccountStatements;