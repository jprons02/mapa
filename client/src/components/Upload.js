import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {selectFile} from '../actions';


class Upload extends React.Component {

    uploadFile = async () => {
        if(this.props.selectedFile.name) {
            
            const url = `/api/upload/${this.props.selectedFile.name}/${this.props.selectedFile.size}`;
            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'content-type': 'application/octet-stream'
                },
                data: this.props.selectedFile
            })
            console.log(response.statusText);
        }
        else {
            alert("Please select a file.");
        }
    }

    render() {
        console.log(this.props);
        return (
            <div>
                <h1>Upload File</h1>
                <input type="file" name="file" id="file" onChange={this.props.selectFile}/>
                <br />
                <button onClick={this.uploadFile}>Upload</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{selectFile})(Upload);