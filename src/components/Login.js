import React from 'react';
import { Menu } from 'semantic-ui-react'
import { connect } from 'react-redux';
import {loginToggle} from '../actions';

const Login = (props) => {
    const handleClick = () => {
        props.loginToggle(!props.isSignedIn);
    }

    return (
        <Menu.Item name='features' onClick={(e) => handleClick(e)}>
            Login
        </Menu.Item>
    );
}

const mapStateToProps = (state) => {
    return {isSignedIn: state.isSignedIn};
}

export default connect(
    mapStateToProps,
    {loginToggle}
    )(Login);