import React, { Fragment, useState } from "react";
import { Card } from "react-bootstrap";
import Input from "../../../components/Input/Input";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../../components/Spinner/Spinner";
import axios from "axios";

export const Host = (props) => {
  const [hostForm, setHostForm] = useState({
    decks: {
      elementType: "input",
      elementConfig: {
        type: "number",
        placeholder: "No of decks",
      },
      value: "",
      validation: {
        required: true,
        maxLength: 1,
        isNumeric: true,
      },
      valid: false,
      touched: false,
    },
    entryPoints: {
      elementType: "input",
      elementConfig: {
        type: "number",
        placeholder: "Entry points",
      },
      value: "",
      validation: {
        required: true,
        isNumeric: true,
      },
      valid: false,
      touched: false,
    },

    responseTime: {
      elementType: "input",
      elementConfig: {
        type: "number",
        placeholder: "Response time for all players",
      },
      value: "",
      validation: {
        required: true,
        isNumeric: true,
        maxValue: 60,
      },
      valid: false,
      touched: false,
    },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const inputChangedHandler = (event, elementId) => {
    event.preventDefault();
    const updatedHostForm = {
      ...hostForm,
    };
    const updatedElement = { ...updatedHostForm[elementId] };
    updatedElement.value = event.target.value;
    updatedElement.valid = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.touched = true;
    updatedHostForm[elementId] = updatedElement;
    let isFormValid = true;
    for (let id in updatedHostForm) {
      isFormValid = updatedHostForm[id].valid && isFormValid;
    }
    setHostForm(updatedHostForm);
    setIsFormValid(isFormValid);
  };

  const checkValidity = (value, rules) => {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }
    if (rules.maxValue) {
      isValid = value <= rules.maxValue && isValid;
    }
    return isValid;
  };
  const onHostFormSubmit = (event) => {
    event.preventDefault();
    const gameSettings = {
      Decks: hostForm.decks.value,
      MaxPoint: hostForm.entryPoints.value,
      ResponseTime: hostForm.responseTime.value,
    };
    props.hostFormSubmitted(gameSettings, props.history);
  };

  const formElements = [];
  for (let key in hostForm) {
    formElements.push({ id: key, config: hostForm[key] });
  }

  let display = (
    <form id="hostForm" onSubmit={onHostFormSubmit}>
      {formElements.map((formElement) => (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.value}
          onChanged={(event) => inputChangedHandler(event, formElement.id)}
          inValid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
        />
      ))}
      <button
        type="submit"
        className="btn btn-primary float-right mr-3 mb-3"
        disabled={!isFormValid}
      >
        Host
      </button>
    </form>
  );

  if (props.isLoading) {
    display = <Spinner />;
  }

  return (
    <Fragment>
      <div className="container">
        <Card>
          <Card.Body>
            <Card.Title>Game Settings</Card.Title>
            <Card.Text>{display}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.game.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hostFormSubmitted: (gameSettings, history) => {
      dispatch(actions.createGameAsync(gameSettings, history));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Host, axios));
