import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {connect} from 'react-redux';

import AdminTools from './AdminTools';
import DesignTools from './DesignTools';
import NavMenu from './NavMenu';
import Login from './Login';
import Home from './Home';
import MediaList from './MediaList';

import { Container } from 'semantic-ui-react';


class App extends React.Component {

    render() {
        return (
            <div>
                <div className="container">
                    <BrowserRouter>
                        <Container>
                            <NavMenu />
                            <div style={{paddingTop: "80px"}}>
                                <Route exact path="/login" component={Login} />
                                <Route exact path="/admintools" component={AdminTools} />
                                <Route exact path="/" component={Home} />
                                <Route exact path="/media" component={MediaList} />
                                <Route exact path="/designtools" component={DesignTools} />
                            </div>
                        </Container>
                    </BrowserRouter>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(App);