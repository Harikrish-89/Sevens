import React, { Fragment } from "react";

const DrawableCards = (props) => {
  return (
    <Fragment>
      <ul className="deck" onClick={props.onCardFetch}>
        <li>
          <div className="card back">*</div>
        </li>
        <li>
          <div className="card back">*</div>
        </li>
        <li>
          <div className="card back">*</div>
        </li>
      </ul>
    </Fragment>
  );
};

export default DrawableCards;
