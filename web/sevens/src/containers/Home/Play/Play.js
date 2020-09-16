import React, { useEffect } from "react";
import Card from "../../../components/Card/Card";
import { useDispatch } from "react-redux";
import * as actions from "../../../store/actions";

const Play = (props) => {
  const onHostAGameClicked = () => {
    props.history.push("host");
  };
  const onJoinClicked = () => {
    props.history.push("join");
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.resetLeaveGame());
    dispatch(actions.closeSocket());
  }, []);
  return (
    <div id="options" className="row">
      <Card
        title="Host"
        description="Host a game"
        onClick={onHostAGameClicked}
      />
      <Card title="Join" description="Join a game" onClick={onJoinClicked} />
    </div>
  );
};

export default Play;
