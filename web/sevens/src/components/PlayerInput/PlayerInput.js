import React from "react";

const PlayerInput = (props) => {
  let display = null;
  if (props.isEight) {
    display = "Use if you have any 8 now or";
  } else if (props.isJack) {
    display = "Use your jack now or";
  } else if (props.isSameRankOrSuit) {
    display = "Use the card now or";
  }
  return (
    <div className="row">
      <p>{display}</p>
      <button className="btn btn-primary ml-1" onClick={props.onContinue}>
        Continue
      </button>
    </div>
  );
};

export default PlayerInput;
