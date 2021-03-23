import React from 'react';

const FileUpload = (props) => {
    return(
        <div data-testid="fileUploadID" className="testfileUploadClass">
            <input type="file" onChange={e => props.changeHandler(e)}></input>
            <button onClick={props.clickHandler}>Upload</button>
        </div>
    )
}

export default FileUpload;