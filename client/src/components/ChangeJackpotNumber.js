import React from 'react';
import axios from 'axios';
import {Button, Header, Form, Message} from 'semantic-ui-react';

class ChangeJackPotNumber extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isWorking: false,
            isSubmit: false
        };
    }
    

    changeNumber = async () => {
        //is the number a string?
        const url = '/api/jackpotnumber/';
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
                this.setState({
                    isSubmit: true
                })
            }
        }
        catch(error){
            console.log(error);
        }
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
        this.setState({isSubmit: false})
    }
    

    render() {
        return (
            <React.Fragment>
                <Header as='h2'>Jackpot Number</Header>
                <Form className={this.state.isSubmit ? 'success' : ''}>
                    <Form.Input width={4} onChange={this.handleChange} value={this.state.value} />
                    <Message
                        success
                        header='Jackpot Number updated'
                        content={`${this.state.value} has been set.`}
                    />
                    <Button style={{marginTop: '14px'}} loading={this.state.isWorking} onClick={this.changeNumber}>Submit</Button>
                </Form>
            </React.Fragment>
        )
    }
}


export default (ChangeJackPotNumber);