//Home page, what user sees once logged in.

import React from "react";
import { connect } from "react-redux";
import { Container, Header, Card } from "semantic-ui-react";

class Home extends React.Component {
  componentDidMount() {
    if (!this.props.isSignedIn.isMatch) {
      this.props.history.push("/login");
    }
  }

  toolsObj = () => {
    return [
      {
        id: "addUser",
        access: "admin",
        name: "Add User",
        meta: "Admin",
        description: "Create a new user to use mapa tools.",
        path: "/adduser",
      },
      {
        id: "googleAnalytics",
        access: "mapa",
        name: "Google Analytics",
        meta: "Administration",
        description: "View Google Analytics tools.",
        path: "/ga",
      },
      {
        id: "jackpot",
        access: "design",
        name: "Jackpot",
        meta: "Web",
        description: "Change the daily jackpot number on the website.",
        path: "/jackpot",
      },
      {
        id: "upload",
        access: "design",
        name: "Upload",
        meta: "Design",
        description:
          "Upload TV spots, radio spots, web banners and/or logos for media partners to download.",
        path: "/upload",
      },
      {
        id: "delete",
        access: "design",
        name: "Delete",
        meta: "Design",
        description: "Delete files from media list.",
        path: "/delete",
      },
      {
        id: "downloadMedia",
        access: "media",
        name: "Media List",
        meta: "Media Partner",
        description: "View list of available media to download.",
        path: "/medialist",
      },
    ];
  };

  renderTools = () => {
    let availableTools = [];
    //Admin user
    if (this.props.isSignedIn.username === "admin") {
      availableTools = this.toolsObj();
    }
    //Designers
    else if (this.props.isSignedIn.username === "design") {
      const availableToolsFilter = (tool) => {
        return tool.access !== "admin";
      };
      availableTools = this.toolsObj().filter(availableToolsFilter);
    }
    //Mapa
    else if (this.props.isSignedIn.username === "mapa") {
      const availableToolsFilter = (tool) => {
        return tool.access !== "admin" && tool.access !== "design";
      };
      availableTools = this.toolsObj().filter(availableToolsFilter);
    }
    //Media Partners
    else if (this.props.isSignedIn.username === "media") {
      const availableToolsFilter = (tool) => {
        return (
          tool.access !== "admin" &&
          tool.access !== "design" &&
          tool.access !== "mapa"
        );
      };
      availableTools = this.toolsObj().filter(availableToolsFilter);
    }

    return (
      <Card.Group>
        {availableTools.map((tool) => {
          return (
            <Card
              key={tool.id}
              onClick={() => this.props.history.push(tool.path)}
              header={tool.name}
              meta={tool.meta}
              description={tool.description}
            />
          );
        })}
      </Card.Group>
    );
  };

  render() {
    return (
      <Container>
        <Header as="h2">
          {this.props.isSignedIn.username === "admin"
            ? "Welcome Joey"
            : this.props.isSignedIn.username === "design"
            ? "Welcome Design Team"
            : this.props.isSignedIn.username === "mapa"
            ? "Welcome MAPA Administration"
            : this.props.isSignedIn.username === "media"
            ? "Welcome Media Partner"
            : "Welcome"}
        </Header>
        <Header as="h4">Tools Available</Header>
        {this.renderTools() || "loading..."}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Home);

/*
Old routing...        
<Route exact path="/login" component={Login} />
<Route exact path="/admintools" component={AdminTools} />
<Route exact path="/" component={Home} />
<Route exact path="/media" component={MediaList} />
<Route exact path="/designtools" component={DesignTools} />
        
*/
