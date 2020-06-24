import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {fetchList} from '../actions';
import {Button, Header, Form, Segment} from 'semantic-ui-react';

class Delete extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            filesToDelete: [],
            isDeleting: false
        };
    }
    
    componentDidMount() {
        this.props.fetchList();
    }
    

    handleChange = (path) => {
        const element = document.getElementById(path);
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
        this.setState({
            isDeleting: true
        })
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
            this.setState({
                isDeleting: false
            })
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
                                //const element = document.getElementById(listItem.path_lower);
                                return (
                                    <div key={listItem.id} style={{marginBottom: '6px'}}>
                                        <Form.Checkbox
                                            id={listItem.path_lower}
                                            inline
                                            label={listItem.name}
                                            onChange={() => this.handleChange(listItem.path_lower)}
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
        return (
            <React.Fragment>
                <Button onClick={()=>this.props.history.goBack()} labelPosition='left' icon='left chevron' content='Back' />
                <Segment style={{padding: '20px 14px 40px 14px'}} raised>
                    {this.renderDeleteList() || 'loading...'}
                <Button style={{marginTop: '14px'}} loading={this.state.isDeleting} onClick={this.deleteFile}>Delete</Button>
                </Segment>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{fetchList})(Delete);