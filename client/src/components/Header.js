import React from 'react';
import {connect} from 'react-redux';

class Header extends React.Component {

    //render home, media for "user"
    //render above + upload for "design"
    //render all for "admin"
    renderHeader = () => {
        const user = this.props.isSignedIn.username;
        const signedIn = this.props.isSignedIn.isMatch;

        //if user is admin
        if(user === 'admin' && signedIn === true) {
            return (
                <div>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/">Home</a></li>
                    <li><a href="/admintools">Admin Tools</a></li>
                    <li><a href="/media">Media</a></li>
                    <li><a href="/upload">Upload</a></li>
                </div>
            )
        }

        //if user is design team
        if(user === 'design' && signedIn === true) {
            return (
                <div>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/">Home</a></li>
                    <li><a href="/media">Media</a></li>
                    <li><a href="/upload">Upload</a></li>
                </div>
            )
        }

        //if user is media house
        if(user === 'media' && signedIn === true) {
            return (
                <div>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/">Home</a></li>
                    <li><a href="/media">Media</a></li>
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
        /*(
            <div>
                <ul>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/">Home</a></li>
                    <li><a href="/media">Media</a></li>
                    <li><a href="/upload">Upload</a></li>
                </ul>
            </div>
        )*/
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps)(Header);