import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {selectFile, uploadingFile} from '../actions';
import {Button, Header, Form, Icon} from 'semantic-ui-react';
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

    //stolen from - https://stackoverflow.com/questions/55464274/react-input-type-file-semantic-ui-react
    fileInputRef = React.createRef();

    render() {
        return (
            <React.Fragment>
                <Header as='h2'>Upload File</Header>
                <Form style={{marginTop: '30px'}}>
                    <div style={{marginBottom: '10px', 
                        display: 
                            this.props.isUploading === true ? 'none' : 
                            this.props.isUploading === 'done' ? 'block' : 'none'}}>
                        {this.props.selectedFile ? this.props.selectedFile.name : 'No file selected.'} has been uploaded.
                    </div>
                    <Form.Field>
                        <Button
                            content= {
                                this.props.selectedFile.name ? 
                                this.props.selectedFile.name : 
                                this.props.isUploading === 'done' ? 'Choose File' : 'Choose File'}
                            labelPosition="left"
                            icon="file"
                            onClick={() => this.fileInputRef.current.click()}
                            //debug this logic right here...
                            loading={this.props.isUploading === true ? true : false}
                        />
                        <input
                            ref={this.fileInputRef}
                            type='file'
                            hidden
                            onChange={this.props.selectFile}
                        />
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