import React from "react";
import Hand from "./Hand/Hand";

const Hands = (props) => {
  let hands = [];
  let cards = [];
  props.cards && props.cards.forEach((card, index) => {
    if ((index +1) % 13 === 0) {
      cards.push(card);
      hands.push(<Hand cards={cards} onCardDropped={props.onCardDropped} key={(index +1) % 13}/>);
      cards = [];
    } else {
      cards.push(card);
    }
  });
  hands.push(<Hand cards={cards} onCardDropped={props.onCardDropped}/>)
  return <div className="playingCards simpleCards rotateHand">{hands}</div>;
};

export default Hands;
