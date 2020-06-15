import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {selectFile, uploadingFile, fetchList} from '../actions';
import {Button, Header, Form} from 'semantic-ui-react';
//socket.io for upload progress
//import io from 'socket.io-client';
//const socket = io('http://localhost:4000');

class Upload extends React.Component {

    componentDidMount() {
        /*
        socket.on('message', function(data){
            console.log(data);
        })
        socket.on('disconnect', function(){});
        */
        this.props.fetchList();
        this.props.uploadingFile(false);
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
                this.props.uploadingFile(false);
                this.props.selectFile(null);
                this.props.fetchList();
            }
        }
        else {
            alert("Please select a file.");
        }
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
                            
                        {this.props.selectedFile !== null ? `${this.props.selectedFile.name} has been uploaded.` : 'No file selected.'}
                    </div>
                    <Form.Field>
                        <Button
                            
                            content= {
                                this.props.isUploading === 'done' ? 'Choose File' :
                                this.props.selectedFile === null ? 'Choose File' : 
                                this.props.isUploading === false && this.props.selectedFile.name === false ? 'Choose File' :
                                this.props.selectedFile.name ? this.props.selectedFile.name : 'Choose File'
                            }
                                
                            labelPosition="left"
                            icon="file"
                            onClick={() => this.fileInputRef.current.click()}
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

    
    

    render() {
        return (
            <React.Fragment>
                {this.renderUpload()}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{selectFile, uploadingFile, fetchList})(Upload);


//add spinner to delete button until file is gone...