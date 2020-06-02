import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {selectFile} from '../actions';
//socket.io for upload progress
import io from 'socket.io-client';
const socket = io('http://localhost:4000');

class Upload extends React.Component {
    
    componentDidMount = () => {
        socket.on('message', function(data){
            console.log(data);
        })
        socket.on('disconnect', function(){});
    }

    uploadFile = async () => {
        if(this.props.selectedFile.name) {
            //need to use FormData for backend Multer middleware.
            let formData = new FormData();
            formData.append('myFile', this.props.selectedFile);
            
            /*
            how to console log formdata:
            for (var value of formData.values()) {
                console.log(value); 
            }
            */

            const url = `/api/testupload/${this.props.selectedFile.name}/${this.props.selectedFile.size}`;
            

            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    //'content-type': 'application/octet-stream' //working without multer
                    'content-type': 'multipart/form-data'
                },
                //data: this.props.selectedFile //working without multer
                data: formData
            })
            
            console.log(response.data);
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