//Lists tools available to admin.
import React from 'react';
import {connect} from 'react-redux';
import {Container} from 'semantic-ui-react';
import AddUser from './AddUser';
import ChangeJackpotNumber from './ChangeJackpotNumber';

class AdminTools extends React.Component {

    render() {
        return (
            <Container>
                <div>
                    <AddUser />
                </div>
                <div style={{marginTop: '50px', marginBottom: '14px'}}>
                    <ChangeJackpotNumber />
                </div>
            </Container>
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
