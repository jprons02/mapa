import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';

import Navigation from './Navigation';
import Footer from './Footer';
import Media from './Media';
import Tools from './Tools';


const App = () => {
    return (
        <Router history={history}>
            <div className="ui container">
                <Navigation />
                <Switch>
                    <Route path="/media/:id" exact component={Media}/>
                    <Route path="/tools/:id" exact component={Tools}/>
                </Switch>
                <Footer />
            </div>
        </Router>
    );
}

export default App;