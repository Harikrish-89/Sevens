import React from "react";

import "./GamePlayerImage.css";

const GamePlayerImage = (props) => {
  return (
    <img
      src={props.PhotoURL}
      alt={props.Name.slice(0, 4)}
      className="gamePlayerImage"
    />
  );
};

export default GamePlayerImage;
