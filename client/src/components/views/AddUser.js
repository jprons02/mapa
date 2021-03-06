//Lists tools available to admin.
import React from 'react';
import {connect} from 'react-redux';
import {Button, Header, Form, Segment, Grid} from 'semantic-ui-react';

class AddUser extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Button onClick={()=>this.props.history.goBack()} labelPosition='left' icon='left chevron' content='Back' />
                <Segment style={{padding: '20px 14px 40px 14px'}} raised>
                    <Header as='h2'>Add User</Header>
                    <Header as='h3'>This will create a new user to use mapa tools. Users include:</Header>
                    <ul>
                        <li>Internal admin</li>
                        <li>Internal designers to upload media</li>
                        <li>External media houses to download media</li>
                    </ul>
                    <Header as='h5'>This user info is encrypted/decrypted with bcrypt in Nodejs and then sent/retrieved to/from MongoDB</Header>
                    <Grid>
                        <Grid.Column style={{ maxWidth: 450 }}>
                            <Form size='large' method='post' action='/api/adduser'>
                                <Segment raised>
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
                        </Grid.Column>
                    </Grid>
                </Segment>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(AddUser);

/*
Google OAUTH not working. Have a '/GET error'
<div style={{marginTop: "50px"}}>
    <Header as='h5'>Google oauth is working but not implemented yet. Keeping here for testing purposes.</Header>
    <Button as='a' href='/auth/google'>Google OAuth Login</Button>
    <Button as='a' href='/api/logout'>Google OAuth Logout</Button>
</div>
*/
