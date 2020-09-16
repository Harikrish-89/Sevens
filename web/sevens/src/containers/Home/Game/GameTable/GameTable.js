import React, { Fragment, useEffect, useCallback } from "react";
import withErrorHandler from "../../../../hoc/withErrorHandler/withErrorHandler";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import "./GameTable.css";
import { GamePlayer } from "../../../../components/GamePlayer/GamePlayer";
import TableContent from "../../../../components/TableContent/TableContent";
import Hands from "../../../../components/Hands/Hands";
import { useDrop } from "react-dnd";
import { DraggableTypes } from "../../../../store/actions/gameUtility";
import * as actions from "../../../../store/actions/";
import JackInputOption from "../../../../components/JackInputOption/JackInputOption";
import PlayerInput from "../../../../components/PlayerInput/PlayerInput";

export const GameTable = (props) => {
  const game = useSelector((state) => {
    return state.game.game;
  });
  const user = useSelector((state) => {
    return state.auth.user;
  });

  const isJackInputOptionRequired = useSelector((state) => {
    return state.game.isJackInputRequired;
  });

  const isPlayerInputRequiredForJack = useSelector((state) => {
    return state.game.isPlayerInputRequiredForJack;
  });

  const isPlayerInputRequireForSameRankOrSuit = useSelector((state) => {
    return state.game.isPlayerInputRequiredForSameRankOrSuit;
  });

  const token = useSelector((state) => {
    return state.auth.token;
  });
  const dispatch = useDispatch();
  const initSocketIo = useCallback(
    (game, userId) => {
      dispatch(actions.initSocketIo(game, userId));
    },
    [dispatch]
  );
  useEffect(() => {
    initSocketIo(game, user.uid);
  }, [initSocketIo]);

  const [{}, drop] = useDrop({
    accept: DraggableTypes.PLAYING_CARD,
  });

  const players =
    game.Rounds.length > 0
      ? game.Rounds[game.Rounds.length - 1].Players
      : game.Players;

  const onJoinHandler = (index) => {
    if (isSeatFree(players, index) && playerNotAlreadyJoined(players, user)) {
      players[index] = {
        ID: user.uid,
        Name: user.displayName,
        PhotoURL: user.photoURL,
        Token: token,
        Points: 0,
        IsDealer: players.every(
          (player) => player.ID === null || player.ID === ""
        ),
        IsHost: players.every(
          (player) => player.ID === null || player.ID === ""
        ),
        IsPlayingHand: false,
        HasPlayedHand: false,
        FailedToPlayCount: 0,
        IsWaiting: game.Started && game.Rounds.length > 0,
      };
      const host = players.filter((player) => player.IsHost)[0];
      let tableMessage = `${host.Name} will Host the game`;
      if (game.Started && game.Rounds.length > 0) {
        tableMessage = `${user.displayName} please wait for next round`;
      }
      dispatch(actions.sendTableMessageThroughSocket(tableMessage));
      dispatch(actions.sendGameThroughSocket(game));
    }
  };

  const onStart = () => {
    dispatch(actions.gameStart(game));
  };

  const onEnd = () => {
    dispatch(actions.endGameRequested())
  };

  const droppedCards =
    game.Rounds.length > 0
      ? game.Rounds[game.Rounds.length - 1].DroppedCards
      : null;
  const droppedCard =
    droppedCards && droppedCards.length > 0
      ? droppedCards[droppedCards.length - 1]
      : null;

  function playerNotAlreadyJoined(players, user) {
    return players.every((player) => player.ID !== user.uid);
  }

  function isSeatFree(players, index) {
    return players[index].ID === null || players[index].ID === "";
  }

  const currentPlayer =
    game.Rounds.length > 0
      ? game.Rounds[game.Rounds.length - 1].Players.find(
          (player) => player.ID === user.uid
        )
      : null;
  const isPlayerInputRequiredForEight =
    game.Rounds.length > 0 &&
    currentPlayer &&
    currentPlayer.IsPlayingHand &&
    game.Rounds[game.Rounds.length - 1].IsPlayerSkipRequired;
  const resetPlayerInput = () => {
    if (isPlayerInputRequiredForJack) {
      dispatch(actions.playerInputGivenForJack());
    } else if (isPlayerInputRequireForSameRankOrSuit) {
      dispatch(actions.playerInputGivenForSameRankOrSuit());
    }
  };

  const onCardDropped = (card) => {
    resetPlayerInput();
    dispatch(actions.onCardDropped(card, user.uid, game));
  };

  const showStartButton =
    players &&
    players.filter((player) => player.ID !== null && player.ID !== "").length >
      1 &&
    players.find((player) => player.ID === user.uid) &&
    players.find((player) => player.ID === user.uid).IsHost;

  const onCardFetch = () => {
    dispatch(actions.onCardFetch(user.uid, game));
  };
  const onJackOptionChosen = (chosenOption) => {
    dispatch(actions.onJackOptionChosenAsync(game, chosenOption, user.uid));
  };

  const onContinue = () => {
    resetPlayerInput();
    dispatch(actions.onContinue(user.uid, game));
  };
  let jackInputOptionComponent = null;

  if (isJackInputOptionRequired) {
    jackInputOptionComponent = (
      <JackInputOption onOptionChosen={onJackOptionChosen} />
    );
  }
  let userInputRequiredComponent = null;
  if (
    isPlayerInputRequireForSameRankOrSuit ||
    isPlayerInputRequiredForEight ||
    isPlayerInputRequiredForJack
  ) {
    userInputRequiredComponent = (
      <PlayerInput
        isJack={isPlayerInputRequiredForJack}
        isEight={isPlayerInputRequiredForEight}
        isSameRankOrSuit={isPlayerInputRequireForSameRankOrSuit}
        onContinue={onContinue}
      />
    );
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row top-players">
          <GamePlayer
            {...players[0]}
            onJoinHandler={() => onJoinHandler(0)}
            timeOut={game.Settings.ResponseTime}
          />
          <GamePlayer
            {...players[1]}
            onJoinHandler={() => onJoinHandler(1)}
            timeOut={game.Settings.ResponseTime}
          />
          <GamePlayer
            {...players[2]}
            onJoinHandler={() => onJoinHandler(2)}
            timeOut={game.Settings.ResponseTime}
          />
        </div>
        <div className="row">
          <div className="col-1 left-players">
            <GamePlayer
              {...players[3]}
              onJoinHandler={() => onJoinHandler(3)}
              timeOut={game.Settings.ResponseTime}
            />
            <GamePlayer
              {...players[4]}
              onJoinHandler={() => onJoinHandler(4)}
              timeOut={game.Settings.ResponseTime}
            />
            <GamePlayer
              {...players[5]}
              onJoinHandler={() => onJoinHandler(5)}
              timeOut={game.Settings.ResponseTime}
            />
          </div>
          <div className="col-6 gameTable" ref={drop}>
            <TableContent
              gameId={game.GameID}
              hasGameStarted={game.Started}
              onStart={onStart}
              onEnd={onEnd}
              droppedCard={droppedCard}
              showStart={showStartButton}
              onCardFetch={onCardFetch}
            />
          </div>
          <div className="col-1 right-players">
            <GamePlayer
              {...players[6]}
              onJoinHandler={() => onJoinHandler(6)}
              timeOut={game.Settings.ResponseTime}
            />
            <GamePlayer
              {...players[7]}
              onJoinHandler={() => onJoinHandler(7)}
              timeOut={game.Settings.ResponseTime}
            />
            <GamePlayer
              {...players[8]}
              onJoinHandler={() => onJoinHandler(8)}
              timeOut={game.Settings.ResponseTime}
            />
          </div>
        </div>
        <div className="row bottom-players">
          <GamePlayer {...players[9]} onJoinHandler={() => onJoinHandler(9)} />
          <GamePlayer
            {...players[10]}
            onJoinHandler={() => onJoinHandler(10)}
            timeOut={game.Settings.ResponseTime}
          />
          <GamePlayer
            {...players[11]}
            onJoinHandler={() => onJoinHandler(11)}
            timeOut={game.Settings.ResponseTime}
          />
        </div>
      </div>
      <div className="container">
        {jackInputOptionComponent}
        {userInputRequiredComponent}
        <Hands
          cards={currentPlayer ? currentPlayer.Cards : []}
          onCardDropped={onCardDropped}
        />
      </div>
    </Fragment>
  );
};

export default withErrorHandler(GameTable, axios);
