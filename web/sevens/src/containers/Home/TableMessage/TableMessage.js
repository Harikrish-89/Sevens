import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../store/actions";

const TableMessage = (props) => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.game.socket);
  useEffect(() => {
    const holdSetInterval = setInterval(() => {
      dispatch(actions.clearTableMessage());
      if (socket && props.gameId) {
        dispatch(actions.sendTableMessageThroughSocket(null, props.gameId));
      }
    }, 10000);
    return () => {
      clearInterval(holdSetInterval);
    };
  }, []);

  return props.tableMessage ? (
    <Alert variant="info">{props.tableMessage}</Alert>
  ) : null;
};

export default TableMessage;
