import React from "react";
import axios from "axios";
import { Button, Header, Form, Message, Segment } from "semantic-ui-react";
import validateNumber from "../../utility/validateNumber";

class MonthlyJackPotNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      isSubmit: false,
      showInvalidError: false,
      setNumberIsLoading: false,
      getNumberIsLoading: false,
      currentJackpotNumber: "",
      addToCurrent: "",
      buttonIsDisabled: true,
    };
  }

  //Sends input data to express server and then to update wordpress website
  changeNumber = async () => {
    if (this.state.showInvalidError || this.state.value === "") {
      return;
    } else {
      this.setState({ setNumberIsLoading: true });

      console.log("number submitted.");

      const setURL = "/api/jackpotmonthlynumber";
      const data = { number: this.state.value };

      try {
        const response = await axios({
          method: "POST",
          url: setURL,
          data: data,
        });
        if (response.data === "OK") {
          console.log(response.data);
          this.setState({
            setNumberIsLoading: false,
            isSubmit: true,
          });
        } else {
          alert("error, contact admin");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Fires when new jackpot number field is typed in directly
  handleChange = (event) => {
    this.setState({
      isSubmit: false,
      showInvalidError: false,
      buttonIsDisabled: false,
    });
    if (validateNumber(event.target.value)) {
      this.setState({ value: event.target.value });
    } else {
      this.setState({
        showInvalidError: true,
        buttonIsDisabled: true,
      });
    }
  };

  render() {
    const successOrError = this.state.isSubmit
      ? "success"
      : this.state.showInvalidError
      ? "error"
      : "";

    return (
      <Form className={successOrError}>
        <Form.Input
          label="New monthly jackpot number"
          onChange={this.handleChange}
          value={this.state.value}
        />
        <Message
          success
          header="Jackpot number updated"
          content={`${this.state.value} has been set.`}
        />
        <Message
          error
          header="Please type in a valid number."
          content='Do not use " , " or " $ " in the number.'
        />
        <Button
          disabled={
            this.state.value === "" ? true : this.state.buttonIsDisabled
          }
          loading={this.state.setNumberIsLoading}
          onClick={this.changeNumber}
        >
          Submit
        </Button>
      </Form>
    );
  }
}

export default MonthlyJackPotNumber;
