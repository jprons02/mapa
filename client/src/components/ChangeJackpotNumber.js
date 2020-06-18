import React from 'react';
import axios from 'axios';
import {Button, Header, Form} from 'semantic-ui-react';

class ChangeJackPotNumber extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isWorking: false
        };
    }
    

    changeNumber = async () => {
        //is the number a string?
        const url = '/api/tribe/jackpotnumber/';
        const data = {
            number: this.state.value
        }
        
        try {
            const response = await axios({
                method: 'POST',
                url: url,
                data: data
            })
            if(response.data) {
                console.log(response.data);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }
    

    render() {
        console.log(this.state.value);
        return (
            <React.Fragment>
                <Form >
                    <Form.Input onChange={this.handleChange} value={this.state.value} />
                    <Button style={{marginTop: '14px'}} loading={this.state.isWorking} onClick={this.changeNumber}>Submit</Button>
                </Form>
            </React.Fragment>
        )
    }
}


export default (ChangeJackPotNumber);