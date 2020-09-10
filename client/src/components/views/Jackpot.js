import React from "react";
import DailyJackpotNumber from "../jackpotComponents/DailyJackpotNumber";
import MonthlyJackpotNumber from "../jackpotComponents/MonthlyJackpotNumber";
import { Button, Header, Segment, Tab } from "semantic-ui-react";

class Jackpot extends React.Component {
  panes = () => {
    return [
      {
        menuItem: "Daily",
        render: () => (
          <Tab.Pane>
            <DailyJackpotNumber />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Monthly",
        render: () => (
          <Tab.Pane>
            <MonthlyJackpotNumber />
          </Tab.Pane>
        ),
      },
    ];
  };

  render() {
    return (
      <React.Fragment>
        <Button
          onClick={() => this.props.history.push("/")}
          labelPosition="left"
          icon="left chevron"
          content="Back"
        />
        <Segment style={{ padding: "20px 14px 40px 14px" }} raised>
          <Header as="h2">Jackpots</Header>
          <Tab panes={this.panes()} />
        </Segment>
      </React.Fragment>
    );
  }
}

export default Jackpot;
