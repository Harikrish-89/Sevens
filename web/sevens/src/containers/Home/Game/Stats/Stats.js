import React, { useState, Fragment } from "react";
import { Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import withConfirm from "../../../../hoc/withConfirm/withConfirm";
import * as actions from "../../../../store/actions"

const Stats = (props) => {
  const [open, setOpen] = useState(false);
  const rounds = useSelector((state) => {
    return state.game.game.Rounds ? state.game.game.Rounds : [];
  });
  const user = useSelector((state) => {
    return state.auth.user;
  });
  const dispatch = useDispatch();
  let currentPlayer = null;
  const tableBody = [];
  if (rounds.length > 0) {
    const lastRoundPlayers = rounds[rounds.length - 1].Players
      ? rounds[rounds.length - 1].Players.filter(
          (player) => player.ID !== null && player.ID !== ""
        ).sort((playerOne, playerTwo) => {
          return playerTwo.Points - playerOne.Points;
        })
      : [];

    for (let i = 0; i < lastRoundPlayers.length; i++) {
      tableBody.push(
        <tr key={i}>
          <td>{lastRoundPlayers[i].Name}</td>
          <td>{lastRoundPlayers[i].Points}</td>
        </tr>
      );
    }
    currentPlayer = lastRoundPlayers.find((player) => player.ID === user.uid);
  }
  const leaveGameHandler = () => {
    dispatch(actions.playerLeaveGameRequested())
  };
  const leaveButton = currentPlayer ? (
    <button className="btn btn-primary mt-5" onClick={leaveGameHandler}>
      Leave Game
    </button>
  ) : null;
  const table = (
    <Table responsive>
      <thead>
        <tr>
          <th>Player</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>{tableBody}</tbody>
    </Table>
  );
  return (
    <Fragment>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
      >
        {table}
        {leaveButton}
      </SwipeableDrawer>
      <div className="d-none d-lg-block d-xl-block">
        {table}
        {leaveButton}
      </div>
    </Fragment>
  );
};

export default withConfirm(Stats);
