import React, { useState, Fragment } from "react";
import Input from "../../../components/Input/Input";
import * as game from "../../../store/actions";
import { connect } from "react-redux";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import axios from "axios";
import { Card } from "react-bootstrap";
import Spinner from "../../../components/Spinner/Spinner";

export const Join = (props) => {
  const [joinForm, setJoinForm] = useState({
    gameId: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "game id",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const inputChangedHandler = (event, elementId) => {
    event.preventDefault();
    const updatedJoinForm = {
      ...joinForm,
    };
    const updatedElement = { ...updatedJoinForm[elementId] };
    updatedElement.value = event.target.value;
    updatedElement.valid = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.touched = true;
    updatedJoinForm[elementId] = updatedElement;
    let isFormValid = true;
    for (let id in updatedJoinForm) {
      isFormValid = updatedJoinForm[id].valid && isFormValid;
    }
    setJoinForm(updatedJoinForm);
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
    return isValid;
  };

  const gameIdSubmitted = (event) => {
    event.preventDefault();
    props.onSubmit(joinForm.gameId.value, props.history);
  };
  const formElements = [];
  for (let key in joinForm) {
    formElements.push({ id: key, config: joinForm[key] });
  }

  let display = (
    <form onSubmit={gameIdSubmitted} className="joinForm">
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
        Join
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
            <Card.Title>Join a game</Card.Title>
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
    isFetched: !state.game.isLoading && !state.game.isError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (gameId, history) => {
      dispatch(game.gameFetchAsync(gameId, history));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Join, axios));
