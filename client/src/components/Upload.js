import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {selectFile, uploadingFile} from '../actions';
import {Button, Header, Form} from 'semantic-ui-react';
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
        console.log(this.props.selectedFile);
        if(this.props.selectedFile) {
            this.props.uploadingFile(true);
            //need to use FormData for backend Multer middleware.
            let formData = new FormData();
            formData.append('myFile', this.props.selectedFile);
            const url = `/api/testupload/${this.props.selectedFile.name}/${this.props.selectedFile.size}`;
            
            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'content-type': 'multipart/form-data'
                },
                data: formData
            })
            if(response.data) {
                this.props.uploadingFile('done');
            }
            console.log(response.data);
        }
        else {
            alert("Please select a file.");
        }
    }

    inputSelectFile = (event) => {
        if(event) {
            return this.props.selectFile(event);
        }
        return null;
        //this.props.selectFile(null);
    }


    render() {
        console.log(this.props.selectedFile);
        return (
            <React.Fragment>
                <Header as='h2'>Upload File</Header>
                <Form style={{marginTop: '30px'}}>
                    <div style={{marginBottom: '10px', 
                        display: this.props.isUploading === true ? 'none' : this.props.isUploading === 'done' ? 'block' : 'none'}}>
                            {this.props.selectedFile ? this.props.selectedFile.name : 'No file selected.'}<br/>
                            has been uploaded.
                    </div>
                    <Form.Field>
                        <Form.Input type='file' name='file' id='file' loading={this.props.isUploading === true ? true : false} icon='file' onChange={this.props.selectFile}/>
                    </Form.Field>
                    <Button onClick={this.uploadFile}>Upload</Button>
                </Form>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{selectFile, uploadingFile})(Upload);


//onChange={this.props.selectFile}