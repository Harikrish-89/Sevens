import * as ActionTypes from "./actionTypes";
import axios from "axios";
import * as config from "./config";
import * as gameUtility from "./gameUtility";
let socket = null;
export const gameFetchStarted = () => {
  return { type: ActionTypes.GAME_FETCH_STARTED };
};

export const chatFetchStarted = () => {
  return { type: ActionTypes.CHAT_FETCH_STARTED };
};

export const chatFetchFailed = () => {
  return { type: ActionTypes.CHAT_FETCH_FAILED };
};

export const gameFetchFailed = () => {
  return { type: ActionTypes.GAME_FETCH_FAILED };
};

export const gameFetched = (game) => {
  return { type: ActionTypes.GAME_FETCHED, payload: { game: game } };
};

export const gameFetchAsync = (gameId, history) => {
  return (dispatch) => {
    dispatch(gameFetchStarted());
    axios
      .get(config.apiBaseUrl + "/game/" + gameId)
      .then((resp) => {
        dispatch(gameFetched(resp.data));
        history.push("game");
      })
      .catch((error) => {
        dispatch(gameFetchFailed());
      });
  };
};

export const createGameAsync = (gameSettings, history) => {
  return (dispatch) => {
    dispatch(gameFetchStarted());
    axios
      .post(
        config.apiBaseUrl + "/game",
        gameUtility.createGameFromSettings(gameSettings)
      )
      .then((resp) => {
        dispatch(gameFetched(resp.data));
        history.push("game");
      })
      .catch((error) => {
        dispatch(gameFetchFailed());
      });
  };
};

export const sendGameThroughSocket = (game) => {
  return (dispatch) => {
    socket.send(JSON.stringify({ MessageType: "GAME", Game: game }));
    dispatch(gameFetchStarted());
  };
};

export const sendTableMessageThroughSocket = (tableMessage, gameId) => {
  const socketTableMessage = {
    MessageType: "TABLE_MESSAGE",
    TableMessage: { GameID: gameId, TableMessage: tableMessage },
  };
  return (dispatch) => {
    socket.send(JSON.stringify(socketTableMessage));
    dispatch(gameFetchStarted());
  };
};

export const socketInitiated = (socket) => {
  return { type: ActionTypes.SOCKET_INITIATED, payload: { socket: socket } };
};

export const closeSocket = () => {
  socket && socket.close();
  return { type: ActionTypes.SOCKET_CLOSED };
};

export const tableMessageFetched = (tableMessage) => {
  return {
    type: ActionTypes.TABLE_MESSAGE_FETCHED,
    payload: { TableMessage: tableMessage },
  };
};

export const chatFetched = (chatMessages) => {
  return {
    type: ActionTypes.CHAT_FETCHED,
    payload: { Messages: chatMessages },
  };
};

export const initSocketIo = (game, playerId) => {
  return (dispatch) => {
    if (game.GameID) {
      socket = new WebSocket(
        config.socketIoUrl + `?gameId=${game.GameID}&playerId=${playerId}`
      );
      socket.onopen = () => {
        console.log("socket opened");
      };
      socket.onmessage = (e) => {
        const socketData = JSON.parse(e.data);
        if (socketData.MessageType === "GAME") {
          dispatch(gameFetched(socketData.Game));
        } else if (socketData.MessageType === "TABLE_MESSAGE") {
          dispatch(tableMessageFetched(socketData.TableMessage.TableMessage));
        } else if (socketData.MessageType === "CHAT") {
          dispatch(chatFetched(socketData.Chat.Messages));
          dispatch(newChatRecieved());
        }
      };
      socket.onclose = () => {
        console.log("closed connection");
      };
      socket.onerror = (e) => {
        console.log("error occured", e);
      };
      dispatch(socketInitiated(socket));
    }
  };
};

export const gameStart = (game) => {
  gameUtility.startGame(game);
  const gameMessage = { MessageType: "GAME", Game: game };
  socket.send(JSON.stringify(gameMessage));
  return gameFetchStarted();
};

export const onJackDropped = () => {
  return {
    type: ActionTypes.J_DROPPED,
  };
};

export const onJackOptionChosen = () => {
  return {
    type: ActionTypes.J_CHOSEN,
  };
};

export const onJackOptionChosenAsync = (game, option, playerId) => {
  return (dispatch) => {
    gameUtility.getLastRound(game).CurrentSuit = option;
    gameUtility.findNextPlayer(game, playerId);
    const tableMessage = `${
      gameUtility
        .getLastRound(game)
        .Players.find((player) => player.ID === playerId).Name
    } : continue with ${gameUtility.chooseSuit(option)}`;
    dispatch(sendTableMessageThroughSocket(tableMessage));
    dispatch(onJackOptionChosen());
    dispatch(sendGameThroughSocket(game));
  };
};

export const onCardDropped = (playerDroppedCard, playerId, game) => {
  return (dispatch) => {
    if (
      gameUtility.getCurrentPlayer(game, playerId).IsPlayingHand &&
      gameUtility.isAllowedToDropCard(playerDroppedCard, game)
    ) {
      const actionToBeTaken = gameUtility.cardDropped(
        game,
        playerId,
        playerDroppedCard
      );
      if (actionToBeTaken.action === "START_NEXT_ROUND") {
        sendWinMessageAndPrepareForNextRound(game, playerId, dispatch);
      } else if(actionToBeTaken.action === "FINISH_GAME"){
        sendFinalWinMessageAndFinishGame(game, playerId, dispatch)
      }else if (actionToBeTaken.action === "USER_INPUT") {
        dispatch(onJackDropped());
        const tableMessage = `${
          gameUtility
            .getLastRound(game)
            .Players.find((player) => player.ID === playerId).Name
        } is choosing color`;
        dispatch(sendTableMessageThroughSocket(tableMessage, game.GameID));
      } else if (actionToBeTaken.action === "CONTINUE") {
        gameUtility.findNextPlayer(game, playerId);
      }
    }
    dispatch(sendGameThroughSocket(game));
  };
};

export const playerInputRequiredForJack = () => {
  return {
    type: ActionTypes.PLAYER_INPUT_REQUIRED_FOR_JACK,
  };
};

export const playerInputRequiredForSameRankOrSuit = () => {
  return {
    type: ActionTypes.PLAYER_INPUT_REQUIRED_FOR_SAME_RANK_OR_SUIT,
  };
};

export const playerInputGivenForEight = () => {
  return {
    type: ActionTypes.PLAYER_INPUT_GIVEN_FOR_EIGHT,
  };
};

export const playerInputGivenForJack = () => {
  return {
    type: ActionTypes.PLAYER_INPUT_GIVEN_FOR_JACK,
  };
};

export const playerInputGivenForSameRankOrSuit = () => {
  return {
    type: ActionTypes.PLAYER_INPUT_GIVEN_FOR_SAME_RANK_OR_SUIT,
  };
};

export const onCardFetch = (playerId, game) => {
  return (dispatch) => {
    if (gameUtility.getCurrentPlayer(game, playerId).IsPlayingHand) {
      const actionToBeTaken = gameUtility.onCardFetch(playerId, game);
      if (actionToBeTaken.action === "USER_INPUT") {
        if (actionToBeTaken.type === "J") {
          dispatch(playerInputRequiredForJack());
        } else if (actionToBeTaken.type === "SAME_RANK_OR_SUIT") {
          dispatch(playerInputRequiredForSameRankOrSuit());
        }
      } else if (actionToBeTaken.action === "CONTINUE") {
        dispatch(onContinue(playerId, game));
      }
    }
  };
};

export const onContinue = (playerId, game) => {
  return (dispatch) => {
    gameUtility.getLastRound(game).IsPlayerSkipRequired = false;
    gameUtility.findNextPlayer(game, playerId);
    dispatch(sendGameThroughSocket(game));
  };
};

export const onPlayerUnResponsive = (playerId, game) => {
  return (dispatch) => {
    if (
      gameUtility.getLastElement(gameUtility.getLastRound(game).DroppedCards)
        .Description === "J"
    ) {
      dispatch(onJackOptionChosenAsync(game, "spades", playerId));
    } else {
      gameUtility.handlePlayerNotResponding(playerId, game);
      dispatch(sendGameThroughSocket(game));
    }
  };
};

function sendWinMessageAndPrepareForNextRound(game, playerId, dispatch) {
  let tableMessage = `${
    gameUtility
      .getLastRound(game)
      .Players.find((player) => player.ID === playerId).Name
  } has won the round`;
  const lostPlayers = gameUtility
    .getLastRound(game)
    .Players.filter((player) => player.Points >= game.Settings.MaxPoint)
    .map((player) => player.Name);
  if (lostPlayers && lostPlayers.length > 0) {
    tableMessage = `${tableMessage} and ${lostPlayers.join()} have lost the game so they are removed`;
  }

  dispatch(sendTableMessageThroughSocket(tableMessage, game.GameID));
  gameUtility.startRound(game, false);
}

function sendFinalWinMessageAndFinishGame(game, playerId, dispatch){
  let tableMessage = `${
    gameUtility
      .getLastRound(game)
      .Players.find((player) => player.ID === playerId).Name
  } has won the game`;
  dispatch(sendTableMessageThroughSocket(tableMessage, game.GameID));
  dispatch(endGameConfirmedAsync(game, false))
}

export const sendChatMessageAsync = (chatMessages, gameId) => {
  return (dispatch) => {
    const socketChatMessage = {
      MessageType: "CHAT",
      Chat: { GameID: gameId, Messages: chatMessages },
    };
    socket.send(JSON.stringify(socketChatMessage));
    dispatch(gameFetchStarted());
  };
};
export const newChatRecieved = () => {
  return {
    type: ActionTypes.NEW_CHAT_RECIEVED,
  };
};

export const newChatReset = () => {
  return {
    type: ActionTypes.RESET_NEW_CHAT,
  };
};
export const fetchChatMessageAsync = (gameId) => {
  return (dispatch) => {
    dispatch(chatFetchStarted());
    axios
      .get(config.apiBaseUrl + "/chats/" + gameId)
      .then((resp) => {
        dispatch(
          chatFetched(resp.data && resp.data.Messages ? resp.data.Messages : [])
        );
        if (resp.data && resp.data.Messages) {
          dispatch(newChatRecieved());
        }
      })
      .catch((error) => {
        dispatch(gameFetchFailed());
      });
  };
};

export const playerLeaveGameRequested = () => {
  return {
    type: ActionTypes.PLAYER_LEAVE_GAME_REQUESTED,
  };
};

export const playerLeaveGameClosed = () => {
  return {
    type: ActionTypes.PLAYER_LEAVE_GAME_CLOSED,
  };
};

export const endGameRequested = () => {
  return {
    type: ActionTypes.END_GAME_REQUESTED,
  };
};

export const endGameClosed = () => {
  return {
    type: ActionTypes.END_GAME_CLOSED,
  };
};

export const leaveGame = () => {
  return {
    type: ActionTypes.LEAVE_GAME,
  };
};

export const resetLeaveGame = () => {
  return {
    type: ActionTypes.RESET_LEAVE_GAME,
  };
};

export const playerLeaveGameConfirmedAsync = (playerId, game, history) => {
  return (dispatch) => {
    const tableMessage =
      game.Rounds &&
      game.Rounds.length > 0 &&
      gameUtility.getCurrentPlayer(game, playerId).Name
        ? `${gameUtility.getCurrentPlayer(game, playerId).Name} has left`
        : null;
    axios
      .post(config.apiBaseUrl + "/leave", {
        PlayerID: playerId,
        GameID: game.GameID,
      })
      .then((data) => {
        dispatch(playerLeaveGameClosed());
        gameUtility.removePlayer(game, playerId);
        dispatch(sendGameThroughSocket(game));
        tableMessage && dispatch(sendTableMessageThroughSocket(tableMessage));
        dispatch(leaveGame());
      })
      .catch((error) => {
        console.log(error);
        dispatch(playerLeaveGameClosed());
        gameUtility.removePlayer(playerId, game);
        dispatch(sendGameThroughSocket(game));
        tableMessage && dispatch(sendTableMessageThroughSocket(tableMessage));
        dispatch(leaveGame());
      });
  };
};

export const endGameConfirmedAsync = (game, isEndedByHost) => {
  return (dispatch) => {
    game.Ended = true;
    if(isEndedByHost){
      dispatch(sendTableMessageThroughSocket("Game ended by host"));
    }
    axios
      .post(config.apiBaseUrl + "/end", game)
      .then((data) => {
        dispatch(endGameClosed());
        dispatch(leaveGame());
      })
      .catch((error) => {
        console.log(error);
        dispatch(endGameClosed());
        dispatch(leaveGame());
      });
  };
};

export const clearTableMessage = () => {
  return {
    type: ActionTypes.CLEAR_TABLE_MESSAGE,
  };
};
