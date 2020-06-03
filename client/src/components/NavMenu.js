import React from 'react';
import {connect} from 'react-redux';
import {setSignIn} from '../actions'
import {Link} from 'react-router-dom';
//needed to give history object in props for componentdidmount history.push
import {withRouter} from 'react-router-dom';
import {Dropdown, Image, Menu} from 'semantic-ui-react';

class NavMenu extends React.Component {

    componentDidMount() {
        if(!this.props.isSignedIn.isMatch) {
            this.props.history.push('/login');
        }
    }

    logout = () => {
        this.props.setSignIn({
            username: null,
            isMatch: null
        });
    }

    renderNav = (pages) => {
        //map over pages object
        console.log(pages);
        return (
            <Menu fixed='top' inverted>
                <Menu.Item as={Link} to='/home' header>
                    <Image size='mini' src='/logo192.png' style={{ marginRight: '1.5em' }} />
                    MAPA
                </Menu.Item>
                <Dropdown item simple text='Tools'>
                    <Dropdown.Menu>
                        {pages.map((page) => <Dropdown.Item style={{color: "black !important"}} key={page[1]} as={Link} to={page[0]}>{page[1]}</Dropdown.Item>)}
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item as={Link} name='Login' to='/login' header></Menu.Item>
            </Menu>
        )          
    }
    //{pages.map((page) => <Menu.Item key={page[1]} as={Link} name={page[1]} to={page[0]} header></Menu.Item>)}
    //as={ Link } name='profile' to='profile'
    //<Menu.Item><Link to='/'>{'Home'}</Link></Menu.Item>

    navLogic = () => {
        const user = this.props.isSignedIn.username;
        const signedIn = this.props.isSignedIn.isMatch;

        let adminPages;
        let designPages;
        let mediaPages;
        const pages = [
            ['/admintools', 'Admin Tools'],
            ['/media', 'Media'],
            ['/upload', 'Upload']
        ];

        //setup page object according to user logged in
        switch(user) {
            case 'admin':
                adminPages = pages;
                console.log(adminPages);
                return this.renderNav(adminPages);
                break;
            
            case 'design':
                designPages = pages;
                delete designPages.admintools;
                return this.renderNav(designPages);
                break;

            case 'media':
                mediaPages = pages;
                delete mediaPages.admintools;
                delete mediaPages.upload;
                return this.renderNav(mediaPages);
                break;
        }
    }


    render() {
        return (
            <div>
                {this.navLogic()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, {setSignIn})(withRouter(NavMenu));