import React from 'react';
import {connect} from 'react-redux';
import {getCurrentJackpotNumber} from '../actions';
import axios from 'axios';
import {Button, Header, Form, Message, Segment} from 'semantic-ui-react';


class ChangeJackPotNumber extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isSubmit: false,
            showInvalidError: false,
            setNumberIsLoading: false,
            getNumberIsLoading: false,
            currentJackpotNumber: '',
            addToCurrent: ''
        };
    }

    componentDidMount = () => {
        this.props.getCurrentJackpotNumber();
    }


    changeNumber = async () => {
        this.setState({setNumberIsLoading: true})
        
        console.log('number submitted.');
        
        const setURL = '/api/jackpotnumber';
        const data = {
            number: this.state.value
        }
        
        try {
            const response = await axios({
                method: 'POST',
                url: setURL,
                data: data
            })
            if(response.data === 'OK') {
                console.log(response.data);
                this.setState({
                    setNumberIsLoading: false,
                    isSubmit: true
                })
                this.props.getCurrentJackpotNumber();
            } else {
                alert('error, call admin');
            }
        }
        catch(error){
            console.log(error);
        }
            
        
    }

    
    validateNumber = (number) => {
        if(number === '') {
            return true;
        } else if (parseInt(number) === 0) {
            return false;
        }
        else {
            const numberInt = parseInt(number);
            if(number === numberInt) {
                if(isNaN(numberInt)) {
                    return false
                }
                else {
                    return true
                }
            }
        }
        
    }

    handleChange = (event) => {
        this.setState({
            isSubmit: false,
            showInvalidError: false
        })
        if(this.validateNumber(event.target.value)) {
            this.setState({value: event.target.value})
        } else {
            this.setState({showInvalidError: true})
        }
    }

    handleAddChange = (event) => {
        this.setState({
            showInvalidError: false,
            isSubmit: false
        })
        //need to figure out how to delete... and show ''.
        if(this.validateNumber(event.target.value)) {
            this.setState({
                addToCurrent: event.target.value
            })

            this.calculateTotal(event.target.value);
        } else {
            this.setState({showInvalidError: true})
        }
    }

    calculateTotal = (amount) => {
        console.log('calculate total fired...');
        if(parseInt(this.props.currentJackpotNumber) > 1) {
            const currentNumber = parseInt(this.props.currentJackpotNumber);
            const amountToAdd = amount === '' ? 0 : parseInt(amount);
            const valueToSubmit = currentNumber + amountToAdd;

            this.setState({value: valueToSubmit.toString()})
        }
    }


    


    render() {
        const successOrError = this.state.isSubmit ? 'success' : this.state.showInvalidError ? 'error' : '';

        return (
            <React.Fragment>
                <Button onClick={()=>this.props.history.goBack()} labelPosition='left' icon='left chevron' content='Back' />
                <Segment style={{padding: '20px 14px 40px 14px'}} raised>
                    <Header as='h2'>Jackpot Number</Header>
                    <Form className={successOrError}>
                        <Form.Input label='Current jackpot' value={this.props.currentJackpotNumber}/>
                        <Form.Input label='Amount to add' onChange={this.handleAddChange} value={this.state.addToCurrent}/>
                        <Form.Input label='New jackpot number' onChange={this.handleChange} value={this.state.value}/>
                        <Message
                            success
                            header='Jackpot number updated'
                            content={`${this.state.value} has been set.`}
                        />
                        <Message
                            error
                            header='Please type in a valid number.'
                            content='Do not use " , " or " $ " in the number.'
                        />
                        <Button loading={this.state.setNumberIsLoading} onClick={this.changeNumber}>Submit</Button>
                    </Form>
                </Segment>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{getCurrentJackpotNumber})(ChangeJackPotNumber);
