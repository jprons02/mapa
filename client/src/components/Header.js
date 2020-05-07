import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class Header extends React.Component {
    renderHeader = () => {
        const user = this.props.isSignedIn.username;
        const signedIn = this.props.isSignedIn.isMatch;

        //if user is admin
        if(user === 'admin' && signedIn === true) {
            return (
                <div>
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/admintools">Admin Tools</Link></li>
                        <li><Link to="/media">Media</Link></li>
                        <li><Link to="/upload">Upload</Link></li>
                        <li><button>Logout</button></li>
                    </ul>
                </div>
            )
        }

        //if user is design team
        if(user === 'design' && signedIn === true) {
            return (
                <div>
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/media">Media</Link></li>
                        <li><Link to="/upload">Upload</Link></li>
                        <li><button>Logout</button></li>
                    </ul>
                </div>
            )
        }

        //if user is media house
        if(user === 'media' && signedIn === true) {
            return (
                <div>
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/media">Media</Link></li>
                        <li><button>Logout</button></li>
                    </ul>
                </div>
            )
        }
    }


    render() {
        return (
            <div>
                {this.renderHeader()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps)(Header);