import React, { useEffect, Fragment, useCallback, useRef } from "react";
import GameTable from "./GameTable/GameTable";
import { useSelector, useDispatch } from "react-redux";
import { Prompt, Redirect } from "react-router";
import Stats from "./Stats/Stats";
import Chat from "./Chat/Chat";
import "./Game.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import * as actions from "../../../store/actions";
import withConfirm from "../../../hoc/withConfirm/withConfirm";

const Game = (props) => {
  const isNewChatRecieved = useSelector((state) => {
    return state.game.isNewChatRecieved;
  });

  const leaveGame = useSelector((state) => {
    return state.game.leaveGame;
  });

  const gameEnded = useSelector((state) => {
    return state.game.game.Ended;
  });

  const dispatch = useDispatch();

  const onBack = (event) => {
    dispatch(actions.playerLeaveGameRequested());
    event.preventDefault();
  };
  const onBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };
  useEffect(() => {
    window.addEventListener("popstate", onBack);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("popstate", onBack);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  let notificationComponent = null;
  if (isNewChatRecieved) {
    notificationComponent = (
      <div className="animated-chat-notification">
        <FontAwesomeIcon icon={faComment} />
      </div>
    );
  }
  let gameContainer = (
    <div>
      <Prompt />
      {notificationComponent}
      <div className="row">
        <div className="col-lg-3">
          <Chat />
        </div>
        <div className="col-lg-6">
          <GameTable />
        </div>
        <div className="col-lg-3">
          <Stats />
        </div>
      </div>
    </div>
  );
  if (leaveGame || gameEnded) {
    gameContainer = <Redirect to="/home/play" />;
  }
  return <Fragment>{gameContainer}</Fragment>;
};

export default withConfirm(Game);
