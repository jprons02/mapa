import React from 'react'
import { Dropdown, Menu } from 'semantic-ui-react'
import {Link} from 'react-router-dom';

import Login from './Login';
import { connect } from 'react-redux';

const Navigation = (props) => {

    console.log(props);

    return (
      <Menu size='large' stackable>
        <Menu.Item>
          <img alt="logo" src='https://react.semantic-ui.com/logo.png' />
        </Menu.Item>

        <Menu.Menu position='right'>

            <Dropdown item text='Media'>
                <Dropdown.Menu>
                    <Dropdown.Item>
                        <Link to="/media/english">English</Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <Link to="/media/spanish">Spanish</Link>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Dropdown item text='Tools'>
                <Dropdown.Menu>
                    <Dropdown.Item>
                        <Link to="/tools/job-form">Job Form</Link>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Login />
        
        </Menu.Menu>

      </Menu>
    )
  
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(
    mapStateToProps
    )(Navigation);