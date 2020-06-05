import React from 'react';
import {connect} from 'react-redux';
import {Button, Header, Form, Segment} from 'semantic-ui-react';

class AdminTools extends React.Component {

    componentDidMount() {
        const user = this.props.isSignedIn.username;
        const signedIn = this.props.isSignedIn.isMatch;
    }

    renderAdminTools = () => {
        return (
            <React.Fragment>
                <Header as='h2'>Admin Tools</Header>
                <Header as='h3'>This will create a new user to use mapa tools. Users include:</Header>
                <ul>
                    <li>Internal admin</li>
                    <li>Internal designers to upload media</li>
                    <li>External media houses to download media</li>
                </ul>
                <Header as='h5'>This user info is encrypted/decrypted with bcrypt in Nodejs and then sent/retrieved to/from MongoDB</Header>
                <Form size='large' method='post' action='/api/adduser'>
                    <Segment stacked>
                        <Form.Input 
                            type='text' name='loginId' 
                            fluid icon='user' iconPosition='left' placeholder='Username' 
                        />
                        <Form.Input 
                            type='password' name='loginPassword'
                            fluid icon='lock' iconPosition='left' placeholder='Password' 
                        />
                        <Button type='submit' fluid size='large'>
                            Add User
                        </Button>
                    </Segment>
                </Form>
            </React.Fragment>
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.renderAdminTools()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(AdminTools);

/*
Google OAUTH not working. Have a '/GET error'
<div style={{marginTop: "50px"}}>
    <Header as='h5'>Google oauth is working but not implemented yet. Keeping here for testing purposes.</Header>
    <Button as='a' href='/auth/google'>Google OAuth Login</Button>
    <Button as='a' href='/api/logout'>Google OAuth Logout</Button>
</div>
*/
