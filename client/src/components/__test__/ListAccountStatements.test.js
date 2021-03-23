import React from 'react';
import ListAccountStatements from "./../ListAccountStatements";
import {render, act} from '@testing-library/react';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const accountStatementObj = {
    currentPage: 1,
    totalItems: 36,
    totalPages: 12,
    accountStatements: [
        {
            dateTime: "2344-01-20T04:42:29.000Z",
            folioNumber: "87275152",
            totalPrice: 690,
            unitPrice: 360.6,
            unitsBought: 334,
            userID: "def@example.com",
            _id: "60576f6967fd167dae7dc2c1"
        },
        {
            dateTime: "2355-01-20T04:42:29.000Z",
            folioNumber: "87275163",
            totalPrice: 701,
            unitPrice: 371.6,
            unitsBought: 345,
            userID: "def@example.com",
            _id: "60576f6967fd167dae7dc2cf"
        },
        {
            dateTime: "2365-01-20T04:42:29.000Z",
            folioNumber: "87275173",
            totalPrice: 711,
            unitPrice: 381.6,
            unitsBought: 355,
            userID: "def@example.com",
            _id: "60576f6967fd167dae7dc2e4"
        }
    ]
}

it("renders ListAccountStatements component without crashing", () => {
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(accountStatementObj)
    }));

    const div = document.createElement("div");
    ReactDOM.render(<ListAccountStatements />, div);
});

it("renders ListAccountStatements component correctly", async() => {
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(accountStatementObj)
    }));

    await act(async() => render(<ListAccountStatements />, container));
    const accountStatementsList = document.querySelector("[data-testid=accountStatementsList]");
    expect(accountStatementsList.children.length).toBe(1);
    expect(accountStatementsList.children[0]).toHaveClass("listAccountStatements");
});

it("ListAccountStatements component snapshot testing", async() => {
    global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(accountStatementObj)
    }));

    const domTree = await renderer.create(<ListAccountStatements />).toJSON();
    expect(domTree).toMatchSnapshot();
});