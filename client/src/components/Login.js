//Login screen. If user is not logged in, they will be directed always to this component.

import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {setSignIn} from '../actions';
import {Button, Form, Grid, Header, Image, Segment, Message} from 'semantic-ui-react'

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false
        }
    }


    submit = async (e) => {
        e.preventDefault();

        const response = await axios ({
            method: 'POST',
            url: '/api/login',
            data: {
                username: document.getElementById('username').value.toLowerCase(),
                password: document.getElementById('password').value
            }
        })
        //action creator to set state to response object
        this.props.setSignIn(response.data);        
        if(this.props.isSignedIn.isMatch) {
            this.props.history.push('/');
        } else {
            this.setState({
                hasError: true
            })
        }
    }

    renderLogin = () => {
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' textAlign='center'>
                        <Image style={{width: '38px', margin: 'auto', marginRight: '5px'}} src='/micc_logo.png' />Log-in to your account
                    </Header>
                    <Form error={this.state.hasError} size='large'>
                        <Segment stacked>
                        <Form.Input 
                            id="username" type="text" name="loginId" 
                            fluid icon='user' iconPosition='left' placeholder='Username' 
                        />
                        <Form.Input 
                            id="password" type="password" name="loginPassword"
                            fluid icon='lock' iconPosition='left' placeholder='Password' 
                        />
                        <Message
                            style={{textAlign: 'left'}}
                            error
                            content='Username or password is incorrect. Please try again.'
                        />
                        <Button onClick={this.submit} fluid size='large'>
                            Login
                        </Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }


    render() {
        return this.renderLogin();
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{setSignIn})(Login);