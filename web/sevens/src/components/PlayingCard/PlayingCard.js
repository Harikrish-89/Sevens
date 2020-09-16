import React, { Fragment } from "react";
import "./PlayingCard.css";
import { useDrag } from "react-dnd";
import { DraggableTypes } from "../../store/actions/gameUtility";

const PlayingCard = (props) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: DraggableTypes.PLAYING_CARD },
    end: () => {
      props.onCardDroppedOnTable({
        Suit: props.Suit,
        Description: props.Description,
        Point: props.Point,
        IsPower: props.IsPower,
      });
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const cardClassName = `card rank-${props.Description} ${props.Suit}`;
  let suit;
  if (props.Suit === "spades") {
    suit = "♠";
  } else if (props.Suit === "hearts") {
    suit = "♥";
  } else if (props.Suit === "diams") {
    suit = "♦";
  } else if (props.Suit === "clubs") {
    suit = "♣";
  }
  let card = (
    <span className={cardClassName}>
      <span className="rank">{props.Description}</span>
      <span className="suit">{suit}</span>
    </span>
  );
  const opacity = isDragging ? 0.4 : 1;
  if (!props.isDroppedCard) {
    card = (
      <li style={{ ...props.style, opacity }} ref={drag}>
        <a className={cardClassName} >
          <span className="rank">{props.Description}</span>
          <span className="suit">{suit}</span>
        </a>
      </li>
    );
  }
  return <Fragment>{card}</Fragment>;
};

export default PlayingCard;
