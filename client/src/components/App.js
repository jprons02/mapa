import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {connect} from 'react-redux';

import Header from './Header';
import Login from './Login';
import Home from './Home';
import AdminTools from './AdminTools';
import MediaList from './MediaList';
import Upload from './Upload';


class App extends React.Component {

    render() {
        console.log(this.props);
        return (
            <div>
                <div className="container">
                    <BrowserRouter>
                        <Header />
                        <div>
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/admintools" component={AdminTools} />
                            <Route exact path="/" component={Home} />
                            <Route exact path="/media" component={MediaList} />
                            <Route exact path="/upload" component={Upload} />
                        </div>
                    </BrowserRouter>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    //const {isSignedIn} = state;
    return state;
}

export default connect(mapStateToProps)(App);