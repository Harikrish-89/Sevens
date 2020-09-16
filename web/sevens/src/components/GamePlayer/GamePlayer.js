import React, { Fragment } from "react";
import "./GamePlayer.css";
import PlayerProgressBar from "../../containers/Home/Game/GameTable/ProgressBar/ProgressBar";
import GamePlayerImage from "./GamePlayerImage/GamePlayerImage";
export const GamePlayer = (props) => {
  let gamePlayerClassName = "gamePlayer";
  let display = <p>Join</p>;
  let cardCount = null;
  if (props.PhotoURL) {
    gamePlayerClassName = "gamePlayerJoined";
    display = (
      <GamePlayerImage PhotoURL = {props.PhotoURL} Name = {props.Name} />
    );
    cardCount = props.Cards ? (
      <div className="cardCount">{props.Cards.length} </div>
    ) : null;
  }

  let progress = null;
  if (props.IsPlayingHand) {
    progress = (
      <PlayerProgressBar
        timeOut={props.timeOut}
        isPlayingHand={props.IsPlayingHand}
        playerId={props.ID}
      />
    );
  }
  return (
    <Fragment>
      <div className={gamePlayerClassName} onClick={props.onJoinHandler}>
        <div className="progressBar">
          {cardCount}
          {display}
        </div>
        {progress}
      </div>
    </Fragment>
  );
};

export default GamePlayer;
