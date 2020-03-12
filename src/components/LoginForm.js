import React from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { loginToggle } from '../actions';


const LoginForm = (props) => {

    const handleSubmit = () => {
        props.loginToggle(true);
    }


    return (
        <Form onSubmit={() => handleSubmit()}>
            <Form.Field>
                <label>First Name</label>
                <input placeholder='First Name' />
            </Form.Field>
            <Form.Field>
                <label>Last Name</label>
                <input placeholder='Last Name' />
            </Form.Field>
            <Form.Field>
                <Checkbox label='I agree to the Terms and Conditions' />
            </Form.Field>
            <Button type='submit'>Submit</Button>
        </Form>
    )
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(
    mapStateToProps,
    {loginToggle}
    )(LoginForm);