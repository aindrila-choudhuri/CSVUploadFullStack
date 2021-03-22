import React, {useEffect, useState} from 'react';
import {HEADINGS} from "./constants";
import DataTable from "./DataTable";
import "./table.css";
import Pagination from "./Pagination";
import FileUpload from "./FileUpload";
import axios from 'axios';

const config = require("./config");

function ListAccountStatements() {
    const [accountStatements, setAccountStatements] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null)
    const [row, setRowData] = useState([]);
    const initialPaginationData = {
        pageSize: 20,
        totalItems: 0,
        totalPages: 0, 
        currentPage: 1
    }
    const [paginationData, setPaginationData] = useState(initialPaginationData)
    const [sortedObj, setSortedObj] = useState({columnName: "", isSorted: false, isSortedAsc: false});

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
        
    }

    const handlePagination = (pageNumber) => {
        let currentPageNumber = paginationData.currentPage
        if (typeof pageNumber === "number") {
            currentPageNumber = pageNumber
        } else {
            if (pageNumber === "prev") {
                currentPageNumber = paginationData.currentPage - 1
            } else {
                currentPageNumber = paginationData.currentPage + 1
            }
        }
        setPaginationData({
            pageSize: paginationData.pageSize,
            totalItems: paginationData.totalItems,
            totalPages: paginationData.totalPages, 
            currentPage: currentPageNumber
        });
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
    }, [paginationData.currentPage, sortedObj])

    const fetchAccountStatements = async() => {
        try{
            console.log("==currentPage inside fetchAccountStatements===", paginationData.currentPage);
            let url = `${config.getAccountStatementsURL}?currentPage=${paginationData.currentPage}&pageSize=${paginationData.pageSize}`;
            if (sortedObj.columnName && sortedObj.isSorted) {
                let sortBy = -1;
                if (sortedObj.isSortedAsc){
                    sortBy = 1;
                }
                const sortField = mapAPIFieldToDBField(sortedObj.columnName);
                url +=`&sortField=${sortField}&sortOrder=${sortBy}`
            }
            console.log("====url===", url);
            const response = await fetch(url);
            const data = await response.json();
            console.log("===data====", data);
            data.accountStatements.forEach( accountStatement => accountStatement.dateTime = new Date(accountStatement.dateTime).toString());
            setAccountStatements(data.accountStatements);
            const result = data.accountStatements.map(({ folioNumber, unitPrice, unitsBought, totalPrice, dateTime, userID }) => [folioNumber, unitPrice, unitsBought, totalPrice, dateTime, userID]);
            console.log("===result====", result);
            setRowData(result);
            setPaginationData({
                pageSize: 20,
                totalItems: data.totalItems,
                totalPages: data.totalPages, 
                currentPage: data.currentPage
            })
        }catch(err) {
            console.log("Error fetching data : ", err);
        }
    }

    const mapAPIFieldToDBField = (apiFieldName) => {
        const mapObj = {
            folionumber : "folioNumber",
            unitprice: "unitPrice",
            unitsbought: "unitsBought",
            totalprice: "totalPrice",
            datetime: "dateTime",
            userid: "userID"
        }

        return mapObj[apiFieldName];
    }

    const handleFileSelected = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const handleFileUpload = () => {
        const fd = new FormData();
        fd.append("file", selectedFile, selectedFile.name);
        axios.post(`${config.getAccountStatementsURL}/upload`, fd).then(res => console.log(res));
    }

    return(
        <div className="container">
            <div className="listAccountStatements">
                <FileUpload changeHandler={handleFileSelected} clickHandler={handleFileUpload}/>
                <h1 className="left">Account Statements</h1>
                <div>
                    <DataTable headings={HEADINGS} rows={row} sortedObj={sortedObj} changeHandler={handleSort}/>
                    <Pagination totalPages={paginationData.totalPages} changeHandler={handlePagination}/>
                </div>
                
            </div>
        </div>
        
    )
}

export default ListAccountStatements;