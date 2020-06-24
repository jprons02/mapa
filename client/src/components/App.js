import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {Container} from 'semantic-ui-react';

import NavMenu from './NavMenu';
import Login from './Login';
import Home from './Home';
import MediaList from './MediaList';
import AddUser from './AddUser';
import ChangeJackpotNumber from './ChangeJackpotNumber';
import Upload from './Upload';
import Delete from './Delete';


class App extends React.Component {

    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <NavMenu />
                    <Container style={{paddingTop: "80px"}}>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/" component={Home} />
                        <Route exact path="/adduser" component={AddUser} />
                        <Route exact path="/jackpot" component={ChangeJackpotNumber} />
                        <Route exact path="/upload" component={Upload} />
                        <Route exact path="/delete" component={Delete} />
                        <Route exact path="/medialist" component={MediaList} />
                    </Container>
                </BrowserRouter>
            </React.Fragment>
        )
    }
    /*
    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <NavMenu />
                    <div style={{paddingTop: "80px"}}>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/admintools" component={AdminTools} />
                        <Route exact path="/" component={Home} />
                        <Route exact path="/media" component={MediaList} />
                        <Route exact path="/designtools" component={DesignTools} />
                    </div>
                </BrowserRouter>
            </React.Fragment>
        )
    }
    */
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(App);