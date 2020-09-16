import React from "react";
import PlayingCard from "../PlayingCard/PlayingCard";
const JackInputOption = (props) => {
  const spade = { Suit: "spades" };
  const diamond = { Suit: "diams" };
  const clubs = { Suit: "clubs" };
  const hearts = { Suit: "hearts" };
  return (
    <div className="container playingCards simpleCards">
      <div className="border-bottom-0">
        <h3>Choose the suit</h3>
      </div>
      <ul className="table">
        <li onClick={() => props.onOptionChosen("spades")}>
          <PlayingCard isDroppedCard={true} {...spade} />
        </li>
        <li onClick={() => props.onOptionChosen("diams")}>
          <PlayingCard isDroppedCard={true} {...diamond} />
        </li>
        <li onClick={() => props.onOptionChosen("clubs")}>
          <PlayingCard isDroppedCard={true} {...clubs} />
        </li>
        <li onClick={() => props.onOptionChosen("hearts")}>
          <PlayingCard isDroppedCard={true} {...hearts} />
        </li>
      </ul>
    </div>
  );
};

export default JackInputOption;
