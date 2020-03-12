import React, { useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import history from '../history';

import LoginForm from './LoginForm';
import Navigation from './Navigation';
import Footer from './Footer';
import Media from './Media';
import Tools from './Tools';


//on component mount... isSignedIn... and send user to /login.

const App = (props) => {

    useEffect(() => {
        if(!props.isSignedIn) {
            history.push('/login');
        }
    }, [])

    return (
        <Router history={history}>
            <div className="ui container">
                <Navigation />
                <Switch>
                    <Route path="/login" exact component={LoginForm}/>
                    <Route path="/media/:id" exact component={Media}/>
                    <Route path="/tools/:id" exact component={Tools}/>
                </Switch>
                <Footer />
            </div>
        </Router>
    );
}

const mapStateToProps = (state) => {
    return {isSignedIn: state.isSignedIn};
}

export default connect(mapStateToProps)(App);