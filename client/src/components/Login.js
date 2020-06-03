import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {setSignIn} from '../actions';
import {Button, Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react'

class Login extends React.Component {

    submit = async (e) => {
        e.preventDefault();

        const response = await axios ({
            method: 'POST',
            url: '/api/login',
            data: {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            }
        })
        //action creator to set state to response object
        this.props.setSignIn(response.data);        
        if(this.props.isSignedIn.isMatch) {
            this.props.history.push('/');
        } else {
            alert("wrong info.");
        }
    }

    renderLogin = () => {
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src='/logo192.png' /> Log-in to your account
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                        <Form.Input 
                            id="username" type="text" name="loginId" 
                            fluid icon='user' iconPosition='left' placeholder='Username' 
                        />
                        <Form.Input 
                            id="password" type="password" name="loginPassword"
                            fluid icon='lock' iconPosition='left' placeholder='Password' type='password' 
                        />

                        <Button onClick={this.submit} color='teal' fluid size='large'>
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




/*
<div>
    <form>
        <label>Login: </label>
        <input id="username" type="text" name="loginId" placeholder="ID" />
        <br />
        <label>Password: </label>
        <input id="password" type="password" name="loginPassword" placeholder="Password" />
        <br />
        <input onClick={this.submit} type="submit" value="Submit" />
    </form>
</div>
*/