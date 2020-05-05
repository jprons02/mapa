import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Header from './Header';
import AdminTools from './AdminTools';
import MediaList from './MediaList';
import Upload from './Upload';

const Landing = () => <h2>Landing</h2>

class App extends React.Component {
    render() {
        return (
            <div>
                <div className="container">
                    <BrowserRouter>
                        <Header />
                        <div>
                            <Route exact path="/admintools" component={AdminTools} />
                            <Route exact path="/" component={Landing} />
                            <Route exact path="/media" component={MediaList} />
                            <Route exact path="/upload" component={Upload} />
                        </div>
                    </BrowserRouter>
                </div>
            </div>
        )
    }
}

export default App;