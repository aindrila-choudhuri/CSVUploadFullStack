import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';

export default function Cell({
  content,
  header,
  sortedObj
}) {
  const cellMarkup = header ? (
    <th className="Cell Cell-header">
      {content}
      <span>
        {content.toLowerCase() === sortedObj.columnName ? (sortedObj.isSorted? (sortedObj.isSortedAsc ? <i className="fa fa-sort-up"></i>: <i className="fa fa-sort-down"></i>) : '') : ''}
      </span>
    </th>
  ) : (
    <td className="Cell">
      {content}
    </td>
  );

  return (cellMarkup);
}