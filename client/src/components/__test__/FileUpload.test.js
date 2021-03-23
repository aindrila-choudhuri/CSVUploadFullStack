import React from 'react';
import ReactDOM from 'react-dom';
import FileUpload from "./../FileUpload";
import {render, cleanup} from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
import renderer from 'react-test-renderer';

const baseProps = {
    changeHandler: jest.fn(),
    clickHandler: jest.fn(),
};

afterEach(cleanup);

it("renders FileUpload component without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<FileUpload {...baseProps} />, div);
});

it("renders FileUpload component correctly", () => {
    const {getByTestId} = render(<FileUpload {...baseProps} />);
    
    const fileUpload = getByTestId('fileUploadID');
    expect(fileUpload).toContainElement(fileUpload);
    expect(fileUpload).toHaveClass("testfileUploadClass");
});

it("matches snapshot of FileUpload component", () => {
    const domTree = renderer.create(<FileUpload {...baseProps} />).toJSON();
    expect(domTree).toMatchSnapshot();
});