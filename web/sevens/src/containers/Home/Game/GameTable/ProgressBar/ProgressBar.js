import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../../store/actions";

const PlayerProgressBar = (props) => {
  const game = useSelector((state) => {
    return state.game.game;
  });

  const user = useSelector((state) => {
    return state.auth.user;
  });

  const [progressTime, setProgressTime] = useState(100);
  const dispatch = useDispatch();
  useEffect(() => {
    const holdSetInterval = setInterval(() => {
      setProgressTime(progressTime - 100 / props.timeOut);
    }, 1000);

    return () => clearInterval(holdSetInterval);
  }, [progressTime]);
  useEffect(() => {
    const holdSetTimeOut = setTimeout(() => {
      if (props.isPlayingHand && props.playerId === user.uid) {
        dispatch(actions.onPlayerUnResponsive(props.playerId, game));
      }
    }, props.timeOut * 1000);
    return () => clearTimeout(holdSetTimeOut);
  }, []);
  return <ProgressBar now={progressTime} />;
};

export default PlayerProgressBar;
