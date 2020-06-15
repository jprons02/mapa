import React from 'react';
import {connect} from 'react-redux';
import {setSignIn} from '../actions'
import {Link} from 'react-router-dom';
//needed to give history object in props for componentdidmount history.push
import {withRouter} from 'react-router-dom';
import {Container, Dropdown, Image, Menu} from 'semantic-ui-react';

class NavMenu extends React.Component {

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
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item as='a' name='Logout' onClick={() => this.logout()} header></Menu.Item>
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
            ['/media', 'Media']
        ];

        //setup page object according to user logged in
        switch(user) {
            case 'admin':
                adminPages = allPages;
                return this.renderNav(adminPages);
            
            case 'design':
                designPages = [
                    ['/designtools', 'Design Tools'],
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
            <React.Fragment>
                {this.navLogic()}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, {setSignIn})(withRouter(NavMenu));