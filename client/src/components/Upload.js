import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {selectFile, uploadingFile, fetchList} from '../actions';
import {Button, Header, Form, List, Icon} from 'semantic-ui-react';
//socket.io for upload progress
import io from 'socket.io-client';
const socket = io('http://localhost:4000');

class Upload extends React.Component {
    
    componentDidMount = () => {
        socket.on('message', function(data){
            console.log(data);
        })
        socket.on('disconnect', function(){});

        this.props.fetchList();
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

    renderUpload = () => {
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

    handleChange = (element) => {
        //document.getElementById("demo");
        console.log(element);
        element.checked ? element.checked = true : element.checked = false;
    }

    deleteFile = async (files) => {
        console.log('delete clicked');
        const url = 'https://api.dropboxapi.com/2/files/delete_batch';
        
        /* working on this...
        const response = await axios({
            method: 'POST',
            url: url,
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/octet-stream'
            }
        })
        console.log(response.data);
        */
    }

    renderDeleteList = () => {
        if(this.props.mediaList.entries) {
            return (
                <React.Fragment>
                    <Header as='h2'>Delete File(s)</Header>
                    <Form>
                        {this.props.mediaList.entries.map((listItem) => {
                            const element = document.getElementById(listItem.name);
                            return (
                                <div key={listItem.id} style={{marginBottom: '6px'}}>
                                    <Form.Checkbox
                                        id={listItem.name}
                                        inline
                                        label={listItem.name}
                                        onChange={() => this.handleChange(element)}
                                    />
                                </div>
                            )
                        })}
                    </Form>
                </React.Fragment>
            )
        }
    }
    

    render() {
        console.log(this.props.mediaList.entries);
        return (
            <React.Fragment>
                <div>
                    {this.renderUpload() || 'loading...'}
                </div>
                <div style={{marginTop: '50px', marginBottom: '14px'}}>
                    {this.renderDeleteList() || 'loading...'}
                </div>
                <Button onClick={this.deleteFile}>Delete</Button>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{selectFile, uploadingFile, fetchList})(Upload);