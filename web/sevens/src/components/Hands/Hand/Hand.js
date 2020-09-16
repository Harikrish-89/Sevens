import React from "react";
import PlayingCard from "../../PlayingCard/PlayingCard";

const Hand = (props) => {
  let cards = [];
  let i = 0;
  props.cards.forEach((card, index) => {
    var style = {
      left: i + "em",
    };
    cards.push(
      <PlayingCard
        {...card}
        isDroppedCard={false}
        style={style}
        onCardDroppedOnTable={props.onCardDropped}
        key={index}
      />
    );
    i = i + 2.2;
  });

  return <ul className="hand">{cards}</ul>;
};

export default Hand;
