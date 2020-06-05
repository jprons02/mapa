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
        this.props.history.push('/login');
    }

    renderNav = (pages) => {
        //map over pages object
        return (
            <Menu fixed='top' inverted>
                <Menu.Item as={Link} to='/' header>
                    <Image size='mini' src='/micc_logo.png' style={{ marginRight: '1.5em' }} />
                    MAPA
                </Menu.Item>
                <Dropdown style={{fontWeight: '700'}} item simple text='Tools'>
                    <Dropdown.Menu>
                        {pages.map((page) => <Dropdown.Item style={{color: "black !important"}} key={page[1]} as={Link} to={page[0]}>{page[1]}</Dropdown.Item>)}
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item as='a' name='Logout' onClick={() => this.logout()} header></Menu.Item>
            </Menu>
        )          
    }

    navLogic = () => {
        const user = this.props.isSignedIn.username;
        //const signedIn = this.props.isSignedIn.isMatch;

        let adminPages;
        let designPages;
        let mediaPages;
        const allPages = [
            ['/admintools', 'Admin Tools'],
            ['/upload', 'Upload'],
            ['/media', 'Media']
        ];

        //setup page object according to user logged in
        switch(user) {
            case 'admin':
                adminPages = allPages;
                return this.renderNav(adminPages);
            
            case 'design':
                designPages = [
                    ['/upload', 'Upload'],
                    ['/media', 'Media']
                    
                ];
                return this.renderNav(designPages);

            case 'media':
                mediaPages = [
                    ['/media', 'Media']
                ];
                return this.renderNav(mediaPages);
            default:
                return null;
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