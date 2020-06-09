import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {selectFile, uploadingFile, fetchList} from '../actions';
import {Button, Header, Form, List, Icon} from 'semantic-ui-react';
//socket.io for upload progress
import io from 'socket.io-client';
const socket = io('http://localhost:4000');

class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            filesToDelete: [],
            filesListChange: 0
        };
    }
    
    componentDidMount() {
        socket.on('message', function(data){
            console.log(data);
        })
        socket.on('disconnect', function(){});
        
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
                console.log(response.data);
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
    chooseFileFunction = () => {
        console.log('choose file fired...');
        //this.props.uploadingFile(false);
    }

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
                            onClick={() => {
                                this.chooseFileFunction();
                                this.fileInputRef.current.click();
                            }}
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

    handleChange = (element, path) => {
        if(element) {
            if(element.checked) {
                //push element path to state if checkmarked
                this.setState({
                    filesToDelete: [...this.state.filesToDelete, path]
                })
                return element.checked = true;
            }
            else {
                //remove element path from state if uncheckmarked
                const newList = this.state.filesToDelete.filter(file => file !== path);
                this.setState({
                    filesToDelete: newList
                })
                return element.checked = false;
            }
        }
        
    }

    deleteFile = async () => {
        const url = '/api/deletefiles';
        
        const response = await axios({
            method: 'POST',
            url: url,
            responseType: 'application/json',
            headers: {
                'Content-Type': 'application/json'
            },
            data: this.state.filesToDelete
        })
        if(response.data) {
            console.log(response.data);
            this.props.fetchList();
        }
    }

    renderDeleteList = () => {
        if(this.props.mediaList.entries) {
            return (
                <React.Fragment>
                    <Header as='h2'>Delete File(s)</Header>
                    <Form>
                        {this.props.mediaList.entries.map((listItem) => {
                            const element = document.getElementById(listItem.path_lower);
                            return (
                                <div key={listItem.id} style={{marginBottom: '6px'}}>
                                    <Form.Checkbox
                                        id={listItem.path_lower}
                                        inline
                                        label={listItem.name}
                                        onChange={() => this.handleChange(element, listItem.path_lower)}
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
        if(this.props.mediaList.entries) {
            console.log(this.props.mediaList.entries.length);
        }
        return (
            <React.Fragment>
                <div>
                    {this.renderUpload()}
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


//fetch list is not firing after delete is completed...