//Home page, what user sees once logged in.

import React from 'react';
import {connect} from 'react-redux';
import {Container, Header, Card} from 'semantic-ui-react';

class Home extends React.Component {

    componentDidMount() {
        if(!this.props.isSignedIn.isMatch) {
            this.props.history.push('/login');
        }
    }

    toolsObj = () => {
        return [
            {
                id: 'addUser',    
                minUser: 'admin',
                name: 'Add User',
                meta: 'Admin',
                description: 'Create a new user to use mapa tools.',
                path: '/adduser'
            },
            {
                id: 'jackpot',
                minUser: 'design',
                name: 'Jackpot',
                meta: 'Design',
                description: 'Change the daily jackpot number on the website.',
                path: '/jackpot'
            },
            {
                id: 'upload',
                minUser: 'design',
                name: 'Upload',
                meta: 'Design',
                description: 'Upload TV spots, radio spots, web banners and/or logos for media partners to download.',
                path: '/upload'
            },
            {    
                id: 'delete',
                minUser: 'design',
                name: 'Delete',
                meta: 'Design',
                description: 'Delete files from media list.',
                path: '/delete'                
            },
            {
                id: 'downloadMedia',
                minUser: 'media',
                name: 'Media List',
                meta: 'Media',
                description: 'View list of available media to download.',
                path: '/medialist'  
            }
        ]
    }

    renderTools = () => {
        let availableTools = [];
        if(this.props.isSignedIn.username === 'admin') {
            availableTools = this.toolsObj();
        }
        else if(this.props.isSignedIn.username === 'design') {
            const checkMinUser = (tool) => {
                return tool.minUser !== 'admin';
            }
            availableTools = this.toolsObj().filter(checkMinUser);
        }
        else if(this.props.isSignedIn.username === 'media') {
            const checkMinUser = (tool) => {
                return tool.minUser !== 'admin' && tool.minUser !== 'design';
            }
            availableTools = this.toolsObj().filter(checkMinUser);
        }

        return (
            <Card.Group>
                {availableTools.map((tool) => {
                    return (
                        <Card
                            key={tool.id}
                            onClick={()=>this.props.history.push(tool.path)}
                            header={tool.name}
                            meta={tool.meta}
                            description={tool.description}
                        />
                    )
                })}
            </Card.Group>
        )
    }

    render() {
        return (
            <Container>
                <Header as='h2'>{
                    this.props.isSignedIn.username === 'admin' ? 'Welcome Admin' : 
                    this.props.isSignedIn.username === 'design' ? 'Welcome Design Team' :
                    this.props.isSignedIn.username === 'media' ? 'Welcome Media Partner' : 'Welcome'}
                </Header>
                <Header as='h4'>Tools Available</Header>
                {this.renderTools() || 'loading...'}
            </Container>    
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps)(Home);


/*
Old routing...        
<Route exact path="/login" component={Login} />
<Route exact path="/admintools" component={AdminTools} />
<Route exact path="/" component={Home} />
<Route exact path="/media" component={MediaList} />
<Route exact path="/designtools" component={DesignTools} />
        
*/