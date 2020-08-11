//IMPORTANT
//This component holds the front-end authentication functionality within componentDidMount().
//And needs to always render throughout the project to keep front-end authentication working correctly and securely.
//Without it, anyone can type in directly domain/admintools and go straight to the page without logging in.

import React from "react";
import { connect } from "react-redux";
import { setSignIn } from "../../actions";
import { Link } from "react-router-dom";
//withrouter is needed to give history object in props for componentdidmount history.push
import { withRouter } from "react-router-dom";
import { Container, Image, Menu } from "semantic-ui-react";

class NavMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
    };
  }

  componentDidMount() {
    if (!this.props.isSignedIn.isMatch) {
      this.props.history.push("/login");
    }
  }

  logout = () => {
    this.props.setSignIn({
      username: null,
      isMatch: null,
    });
    this.props.history.push("/login");
  };

  render() {
    return (
      <React.Fragment>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as={Link} to="/" header>
              <Image
                size="mini"
                src="/micc_logo.png"
                style={{ marginRight: "1.5em" }}
              />
              MAPA
            </Menu.Item>
            <Menu.Item onClick={() => this.logout()} header>
              Logout
            </Menu.Item>
          </Container>
        </Menu>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, { setSignIn })(withRouter(NavMenu));
