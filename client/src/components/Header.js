import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/media">Media</a></li>
                    <li><a href="/upload">Upload</a></li>
                </ul>
            </div>
        )
    }
}

export default Header;