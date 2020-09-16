import React from "react";
import DrawableCards from "./DrawableCards/DrawableCards";
import DroppedCard from "../PlayingCard/PlayingCard";

const TableContent = (props) => {
  const tableContent = props.showStart ? !props.hasGameStarted ? (
    <React.Fragment>
      
      <span>
        <button type="button" className="btn btn-light" onClick={props.onStart}>
          Start
        </button>
      </span>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <span>
        <button type="button" className="btn btn-light" onClick={props.onEnd}>
          End
        </button>
      </span>
    </React.Fragment>
  ) :  null;
  let droppedCard = null;
  if (props.droppedCard) {
    droppedCard = <DroppedCard {...props.droppedCard} isDroppedCard/>;
  }
  return (
    <React.Fragment>
      <p>{props.gameId}</p>
      {tableContent}
      <div className="playingCards row simpleCards">
        <DrawableCards onCardFetch={props.onCardFetch}/>
        {droppedCard}
      </div>
    </React.Fragment>
  );
};

export default TableContent;
