import React from 'react';

const Pagination = (props) => {
    const {totalPages} = props;
    let renderPages = [];

    for (let i = 1; i <= totalPages; i++) {
        if (i<=3) {
            renderPages.push(i);
        }
    }

    renderPages.push("prev");
    renderPages.push("next");

    return(
            <nav className="navbar navbar-default">
                <ul className="pagination ml-auto">
                    {renderPages.map(number => (
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