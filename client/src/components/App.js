import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";

import NavMenu from "./views/NavMenu";
import Login from "./views/Login";
import Home from "./views/Home";
import MediaList from "./views/MediaList";
import AddUser from "./views/AddUser";
import Jackpot from "./views/Jackpot";
import Upload from "./views/Upload";
import Delete from "./views/Delete";
import GaViewReport from "./views/GaViewReport";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <NavMenu />
          <Container style={{ paddingTop: "80px" }}>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Home} />
            <Route exact path="/adduser" component={AddUser} />
            <Route exact path="/jackpot" component={Jackpot} />
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/delete" component={Delete} />
            <Route exact path="/medialist" component={MediaList} />
            <Route exact path="/ga" component={GaViewReport} />
          </Container>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(App);
