import React from 'react';
import axios from 'axios';
import {Button, Header, Form, Message} from 'semantic-ui-react';

class ChangeJackPotNumber extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isSubmit: false,
            showInvalidError: false
        };
    }
    

    changeNumber = async () => {
        //validate number
        if(!this.validateNumber()) {
            this.setState({showInvalidError: true})
        }
        else {
            const url = '/api/jackpotnumber';
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
    }

    validateNumber = () => {
        if(this.state.value) {
            const value = parseInt(this.state.value);
            //reason: doing nan test, 100abcd is still passing. so 100 == '100abcd' will result in false in javascript.
            if(value == this.state.value) {
                //not valid
                if (isNaN(value)) {
                    return false
                //valid
                } else {
                    return true
                }
            }
        }
        return false  
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
        this.setState({isSubmit: false});
        this.setState({showInvalidError: false});
    }


    render() {
        const successOrError = this.state.isSubmit ? 'success' : this.state.showInvalidError ? 'error' : '';

        return (
            <React.Fragment>
                <Header as='h2'>Jackpot Number</Header>
                <Form className={successOrError}>
                    <Form.Input width={4} onChange={this.handleChange} value={this.state.value} placeholder='Enter number here'/>
                    <Message
                        success
                        header='Jackpot Number updated'
                        content={`${this.state.value} has been set.`}
                    />
                    <Message
                        error
                        header='Please type in a valid number.'
                        content='Do not use " , " or " $ " in the number.'
                    />
                    <Button onClick={this.changeNumber}>Submit</Button>
                </Form>
            </React.Fragment>
        )
    }
}


export default (ChangeJackPotNumber);