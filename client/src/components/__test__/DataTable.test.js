import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from "./../DataTable";
import {render, cleanup} from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
import renderer from 'react-test-renderer';
import {HEADINGS} from "./../constants";

const sortedObj = {
    columnName: "",
    isSorted: false,
    isSortedAsc: false
}

const rows = [
    ["87275152", 360.6, 334, 6905, "Thu Jan 20 2344 10:12:29 GMT+0530 (India Standard Time)", "abc@example.com"],
    ["87275152", 370, 337, 6903, "Thu Jan 21 2344 10:12:29 GMT+0530 (India Standard Time)", "def@example.com"],
    ["87275152", 380.6, 335, 6902, "Thu Jan 22 2344 10:12:29 GMT+0530 (India Standard Time)", "ghi@example.com"],
    ["87275152", 390.6, 334, 6901, "Thu Jan 23 2344 10:12:29 GMT+0530 (India Standard Time)", "xyz@example.com"],
    ["87275152", 367, 332, 6904, "Thu Jan 24 2344 10:12:29 GMT+0530 (India Standard Time)", "pqr@example.com"]
]

const tableDataProps = {
    headings: HEADINGS,
    sortedObj,
    rows,
    changeHandler: jest.fn(),
}

afterEach(cleanup);

it("renders DataTable component without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<DataTable {...tableDataProps}></DataTable>, div);
});

it("renders DataTable component correctly", () => {
    const {getByTestId} = render(<DataTable  {...tableDataProps}></DataTable>);
    const dataTable = getByTestId('dataTableID');
    
    expect(dataTable).toContainElement(dataTable);
    expect(dataTable).toHaveClass("container");
});

it("matches snapshot", () => {
    const domTree = renderer.create(<DataTable {...tableDataProps}></DataTable>).toJSON();
    expect(domTree).toMatchSnapshot();
});