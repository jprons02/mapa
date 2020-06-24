//IMPORTANT 
//This component holds the front-end authentication functionality within componentDidMount().
//And needs to always render throughout the project to keep front-end authentication working correctly and securely.
//Without it, anyone can type in directly domain/admintools and go straight to the page without logging in.

import React from 'react';
import {connect} from 'react-redux';
import {setSignIn} from '../actions'
import {Link} from 'react-router-dom';
//withrouter is needed to give history object in props for componentdidmount history.push
import {withRouter} from 'react-router-dom';
import {Container, Dropdown, Image, Menu} from 'semantic-ui-react';

class NavMenuOld extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isMenuOpen: false
        }
    }

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

    setIsShown = (value) => {
        if(value === 'enter') {
            this.setState({
                isMenuOpen: true
            })
        }
        else if (value === 'leave') {
            this.setState({
                isMenuOpen: false
            })
        }
        else if (value === 'clicked') {
            this.setState({
                isMenuOpen: !this.state.isMenuOpen
            })
        }
    }

    renderNav = (pages) => {
        
        const itemSelect = (path) => {
            this.props.history.push(path);
            this.setState({
                isMenuOpen: false
            })
        }

        return (
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item as={Link} to='/' header>
                        <Image size='mini' src='/micc_logo.png' style={{ marginRight: '1.5em' }} />
                        MAPA
                    </Menu.Item>
                    <Dropdown 
                        onMouseEnter={() => this.setIsShown('enter')}
                        onMouseLeave={() => this.setIsShown('leave')}
                        onClick={() => this.setIsShown('clicked')}
                        open={this.state.isMenuOpen} closeOnChange={true} style={{fontWeight: '700'}} item simple text='Tools'
                    >
                        <Dropdown.Menu style={{display: this.state.isMenuOpen ? 'block' : 'none'}} open={this.state.isMenuOpen}>
                            {pages.map((page) => <Dropdown.Item key={page[1]} onClick={() => itemSelect(page[0])}>{page[1]}</Dropdown.Item>)}
                            <Dropdown.Item key='Logout' onClick={() => this.logout()}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
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
            ['/designtools', 'Design Tools'],
            ['/media', 'Media List']
        ];

        //setup page object according to user logged in
        switch(user) {
            case 'admin':
                adminPages = allPages;
                return this.renderNav(adminPages);
            
            case 'design':
                designPages = [
                    ['/designtools', 'Design Tools'],
                    ['/media', 'Media List']
                    
                ];
                return this.renderNav(designPages);

            case 'media':
                mediaPages = [
                    ['/media', 'Media List']
                ];
                return this.renderNav(mediaPages);
            default:
                return null;
        }
    }


    render() {
        return (
            <React.Fragment>
                {this.navLogic()}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, {setSignIn})(withRouter(NavMenuOld));