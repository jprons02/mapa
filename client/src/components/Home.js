//Home page, what user sees once logged in.

import React from 'react';
import {connect} from 'react-redux';
import {Container, Header} from 'semantic-ui-react';

class Home extends React.Component {
    render() {
        return (
            <Container>
                <Header as='h2'>{
                    this.props.isSignedIn.username === 'admin' ? 'Welcome Admin' : 
                    this.props.isSignedIn.username === 'design' ? 'Welcome Design Team' :
                    this.props.isSignedIn.username === 'media' ? 'Welcome Media Partner' : 'Welcome'}
                </Header>
            </Container>    
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(Home);