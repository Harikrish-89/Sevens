import React, { Fragment, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import GamePlayerImage from "../../../../components/GamePlayer/GamePlayerImage/GamePlayerImage";
import * as actions from "../../../../store/actions/";
import Input from "../../../../components/Input/Input";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import "./Chat.css";
import Spinner from "../../../../components/Spinner/Spinner";

const Chat = (props) => {
  const [open, setOpen] = useState(false);

  const chats = useSelector((state) => {
    return state.game.Messages;
  });

  const game = useSelector((state) => {
    return state.game.game;
  });

  const isLoading = useSelector((state) => {
    return state.game.isChatLoading;
  });
  const user = useSelector((state) => {
    return state.auth.user;
  });

  const lastChatMessageRef = useRef(null);

  const lastChatMessageSwipeableRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    lastChatMessageRef &&
      lastChatMessageRef.current &&
      lastChatMessageRef.current.scrollIntoView();
    lastChatMessageSwipeableRef &&
      lastChatMessageSwipeableRef.current &&
      lastChatMessageSwipeableRef.current.scrollIntoView();
  });
  useEffect(() => {
    dispatch(actions.fetchChatMessageAsync(game.GameID));
  }, []);

  const initialState = {
    messageToBeSent: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Type your message here",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
  };
  const [messageForm, setMessageForm] = useState(initialState);
  const [isFormValid, setIsFormValid] = useState(false);
  const inputChangedHandler = (event, elementId) => {
    event.preventDefault();
    const updatedMessageForm = {
      ...messageForm,
    };
    const updatedElement = { ...updatedMessageForm[elementId] };
    updatedElement.value = event.target.value;
    updatedElement.valid = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.touched = true;
    updatedMessageForm[elementId] = updatedElement;
    let isFormValid = true;
    for (let id in updatedMessageForm) {
      isFormValid = updatedMessageForm[id].valid && isFormValid;
    }
    setMessageForm(updatedMessageForm);
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

  const messageSubmitted = (event) => {
    event.preventDefault();

    const chatMessage = {
      DisplayPhoto: user.photoURL,
      Name: user.displayName,
      Message: messageForm.messageToBeSent.value,
    };
    chats.push(chatMessage);
    document.getElementById("messageForm").reset();
    document.getElementById("messageFormSwipeable") &&
      document.getElementById("messageFormSwipeable").reset();
    dispatch(actions.sendChatMessageAsync(chats, game.GameID));
  };
  const formElements = [];
  for (let key in messageForm) {
    formElements.push({ id: key, config: messageForm[key] });
  }

  let formDisplay = (
    <form id="messageForm" onSubmit={messageSubmitted}>
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
        Send
      </button>
    </form>
  );

  let swipeableFormDisplay = (
    <form id="messageFormSwipeable" onSubmit={messageSubmitted}>
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
        Send
      </button>
    </form>
  );

  const messagesComponent = [];
  chats.forEach((message, index) => {
    if (index === chats.length - 2) {
      messagesComponent.push(
        <div key={index} ref={lastChatMessageRef} className="border-bottom-0">
          <div>
            <GamePlayerImage
              PhotoURL={message.DisplayPhoto}
              Name={message.Name}
            />
            <p className="ml-2">{message.Message}</p>
          </div>
        </div>
      );
    } else {
      messagesComponent.push(
        <div key={index} className="border-bottom-0">
          <div>
            <GamePlayerImage
              PhotoURL={message.DisplayPhoto}
              Name={message.Name}
            />
            <p className="ml-2">{message.Message}</p>
          </div>
        </div>
      );
    }
  });
  const swipeableMessagesComponent = [];
  chats.forEach((message, index) => {
    if (index === chats.length - 2) {
      swipeableMessagesComponent.push(
        <div
          key={index}
          ref={lastChatMessageSwipeableRef}
          className="border-bottom-0"
        >
          <div>
            <GamePlayerImage
              PhotoURL={message.DisplayPhoto}
              Name={message.Name}
            />
            <p className="ml-2">{message.Message}</p>
          </div>
        </div>
      );
    } else {
      swipeableMessagesComponent.push(
        <div key={index} className="border-bottom-0">
          <div>
            <GamePlayerImage
              PhotoURL={message.DisplayPhoto}
              Name={message.Name}
            />
            <p className="ml-2">{message.Message}</p>
          </div>
        </div>
      );
    }
  });
  const onOpen = () => {
    setOpen(true);
    dispatch(actions.newChatReset());
  };
  const onClose = () => {
    setOpen(false);
    dispatch(actions.newChatReset());
  };
  const onDivClicked = () => {
    dispatch(actions.newChatReset());
  };
  return (
    <Fragment>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        className="col-8"
      >
        <div className="chatMessages p-3">
          {" "}
          {isLoading ? <Spinner /> : swipeableMessagesComponent}
        </div>
        <div className="chatForm col-8 fixed-bottom">
          {swipeableFormDisplay}
        </div>
      </SwipeableDrawer>
      <div
        className="d-none d-md-block d-lg-block d-xl-block"
        onClick={onDivClicked}
      >
        <div className="chatMessages p-3">
          {isLoading ? <Spinner /> : messagesComponent}
        </div>
        <div className="chatForm fixed-bottom">{formDisplay}</div>
      </div>
    </Fragment>
  );
};

export default Chat;
