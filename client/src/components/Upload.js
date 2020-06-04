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

    fileUploaded = (bool) => {
        if(bool) {
            return 'block';
        }
        return 'none';
    }

    uploadFile = async () => {
        if(this.props.selectedFile.name) {
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
                this.fileUploaded(true);
                this.props.uploadingFile('done');
            }
            console.log(response.data);
        }
        else {
            alert("Please select a file.");
        }
    }


    render() {
        console.log(this.props);
        return (
            <React.Fragment>
                <Header as='h2'>Upload File</Header>
                <div style={{marginBottom: '10px', 
                    display: this.props.isLoading === true ? 'none' : this.props.isLoading === 'done' ? 'block' : 'none'}}>
                        {this.props.selectedFile.name}<br/>
                        has been uploaded.
                </div>
                <Form>
                    <Form.Field>
                        <Form.Input type='file' name='file' id='file' loading={this.props.isLoading === true ? true : false} icon='file' onChange={this.props.selectFile}/>
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
