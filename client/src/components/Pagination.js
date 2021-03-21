import React from 'react';

const Pagination = (props) => {
    const {recordsPerPage, totalRecords} = props;
    const pageNumbers = [];
    
    for (let i = 1; i <= Math.ceil(totalRecords/recordsPerPage); i++) {
        pageNumbers.push(i);
    }
    return(
        <nav>
s            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a onClick={e => props.changeHandler(number)} href="!#" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Pagination;