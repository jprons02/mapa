import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {setSignIn} from '../actions';

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


    render() {
        return (
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
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps,{setSignIn})(Login);