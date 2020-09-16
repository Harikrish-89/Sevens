import React from "react";

const Card = (props) => {
  return (
    <div className="container">
    <div className="card col" onClick={props.onClick}>
      <div className="card-body">
        <h2 className="card-title">{props.title}</h2>
        <p className="card-text">{props.description}</p>
      </div>
    </div>
    </div>
  );
};

export default Card;
