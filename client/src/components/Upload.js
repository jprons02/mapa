//Upload a file to dropbox.

import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {selectFile, uploadingFile, fetchList} from '../actions';
import {Button, Header, Form, Segment, List, Message} from 'semantic-ui-react';
//below is socket.io for upload progress
//import io from 'socket.io-client';
//const socket = io('http://localhost:4000');

class Upload extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            valueUpload: '',
            isUploading: false,
            showInvalidErrorUpload: false,
            fileUploaded: false
        }
    }

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
            //this.props.uploadingFile(true);
            this.setState({isUploading: true})
            //need to use FormData for backend Multer middleware.
            let formData = new FormData();
            formData.append('myFile', this.props.selectedFile);
            const url = `/api/upload/${this.props.selectedFile.name}/${this.props.selectedFile.size}`;
            
            const response = await axios({
                method: 'POST',
                url: url,
                headers: {
                    'content-type': 'multipart/form-data'
                },
                data: formData
            })
            if(response.data) {
                this.setState({
                    isUploading: false,
                    fileUploaded: true
                })
                //this is why i can't show which got uploaded...
                //this.props.selectFile(null);
                this.props.fetchList();
            }
        }
        else {
            this.setState({showInvalidErrorUpload: true})
        }
    }

    handleChange = (event) => {
        this.props.selectFile(event);
        event.target.value = null;
    }

    //stolen from - https://stackoverflow.com/questions/55464274/react-input-type-file-semantic-ui-react
    fileInputRef = React.createRef();

    renderUpload = () => {
        const successOrErrorUpload = this.state.fileUploaded ? 'success' : this.state.showInvalidErrorUpload ? 'error' : '';

        return (
            <React.Fragment>
                <Header as='h2'>Upload File</Header>
                <Form className={successOrErrorUpload} style={{marginTop: '30px'}}>
                    <Form.Field>
                        <Button
                            content= {
                                //this.state.fileUploaded ? 'Choose File' :
                                this.props.selectedFile === null ? 'Choose File' : 
                                this.state.isUploading && this.props.selectedFile.name === false ? 'Choose File' :
                                this.props.selectedFile.name ? this.props.selectedFile.name : 'Choose File'
                            }
                            labelPosition="left"
                            icon="file"
                            onClick={() => {
                                this.setState({fileUploaded: false})
                                this.fileInputRef.current.click()
                            }}
                            loading={this.state.isUploading}
                        />
                        <input
                            ref={this.fileInputRef}
                            name='uploadFile'
                            type='file'
                            hidden
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Message
                        success
                        //header={`File has been uploaded.`}
                        header={`${this.props.selectedFile.name} has been uploaded.`}
                    />
                    <Message
                        error
                        header='Please select a file'
                    />
                    <Button onClick={this.uploadFile}>Upload</Button>
                </Form>
            </React.Fragment>
        )
    }

    
    

    render() {
        return (
            <React.Fragment>
                <Button onClick={()=>this.props.history.goBack()} labelPosition='left' icon='left chevron' content='Back' />
                <Segment style={{padding: '20px 14px 40px 14px'}} raised>
                    <div style={{paddingBottom: '20px'}}>
                        <Header as='h4'>Instructions</Header>
                        <List bulleted>
                            <List.Item>To categorize as spanish please prefix file name with "sp_".<br/>Example: "sp_village.mov"</List.Item>
                            <List.Item>To categorize as logo, please use the word "logo" somewhere in the filename, case insensitive.</List.Item>
                            <List.Item>To categorize web banner, file must be zip.</List.Item>
                        </List>
                    </div>
                    {this.renderUpload()}
                </Segment>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{selectFile, uploadingFile, fetchList})(Upload);