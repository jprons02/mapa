import React from "react";
import { connect } from "react-redux";
import { getCurrentJackpotNumber } from "../../actions";
import axios from "axios";
import { Button, Header, Form, Message, Segment } from "semantic-ui-react";
import validateNumber from "../../utility/validateNumber";

class DailyJackPotNumber extends React.Component {
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

  componentDidMount = () => {
    this.props.getCurrentJackpotNumber();
  };

  //Sends input data to express server and then to update wordpress website
  changeNumber = async () => {
    if (this.state.showInvalidError || this.state.value === "") {
      return;
    } else {
      this.setState({ setNumberIsLoading: true });

      console.log("number submitted.");

      const setURL = "/api/jackpotnumber";
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
          this.props.getCurrentJackpotNumber();
          this.sendEmail(data);
        } else {
          alert("error, contact admin");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Send email to admin with current jackpot number
  sendEmail = async (data) => {
    const emailURL = "/api/emailcurrentjackpot";
    try {
      const response = await axios({
        method: "POST",
        url: emailURL,
        data: data,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
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

  //Fires when amount to add field is typed in
  handleAddChange = (event) => {
    this.setState({
      isSubmit: false,
      showInvalidError: false,
      buttonIsDisabled: false,
    });

    if (validateNumber(event.target.value)) {
      this.setState({
        addToCurrent: event.target.value,
      });

      this.calculateTotal(event.target.value);
    } else {
      this.setState({
        showInvalidError: true,
        buttonIsDisabled: true,
      });
    }
  };

  //Calculates: (amount to add field) + (current jackpot numbers)
  calculateTotal = (amount) => {
    if (parseInt(this.props.currentJackpotNumber) > 1) {
      const currentNumber = parseInt(this.props.currentJackpotNumber);
      const amountToAdd = amount === "" ? 0 : parseInt(amount);
      const valueToSubmit = currentNumber + amountToAdd;

      this.setState({ value: valueToSubmit.toString() });
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
          label="Current jackpot"
          value={this.props.currentJackpotNumber}
        />
        <Form.Input
          label="Amount to add"
          onChange={this.handleAddChange}
          value={this.state.addToCurrent}
        />
        <Form.Input
          label="New daily jackpot number"
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

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, { getCurrentJackpotNumber })(
  DailyJackPotNumber
);
