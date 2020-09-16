import * as ActionTypes from "../actions/actionTypes";

const initialState = {
  isLoading: false,
  isError: false,
  game: {
    Ended: false,
    GameID: "",
    Players: [],
    Rounds: [],
    Settings: { Decks: 0, MaxPoint: 0, ResponseTime: 0 },
    Started: false,
  },
  socket: null,
  TableMessage: null,
  Messages: [],
  isJackInputRequired: false,
  isPlayerInputRequiredForEight: false,
  isPlayerInputRequiredForJack: false,
  isPlayerInputRequiredForSameRankOrSuit: false,
  isNewChatRecieved: false,
  isChatLoading: false,
  isEndGameConfirmationRequried: false,
  isPlayerLeaveConfirmationRequired: false,
  leaveGame: false,
};

const gameStarted = (state, action) => {
  return {
    ...state,
    isLoading: true,
  };
};

const chatFetchStarted = (state, action) => {
  return {
    ...state,
    isChatLoading: true,
  };
};

const gameFetchFailed = (state, action) => {
  return {
    ...state,
    isLoading: false,
    isError: true,
  };
};

const chatFetchFailed = (state, action) => {
  return {
    ...state,
    isChatLoading: false,
    isError: true,
  };
};

const gameFetched = (state, action) => {
  return {
    ...state,
    isLoading: false,
    isError: false,
    game: {
      ...state.game,
      Rounds: action.payload.game.Rounds ? [...action.payload.game.Rounds] : [],
      Ended: action.payload.game.Ended,
      GameID: action.payload.game.GameID,
      Players: action.payload.game.Players
        ? [...action.payload.game.Players]
        : [],
      Settings: {
        ...state.game.Settings,
        Decks: action.payload.game.Settings.Decks,
        MaxPoint: action.payload.game.Settings.MaxPoint,
        ResponseTime: action.payload.game.Settings.ResponseTime,
      },
      Started: action.payload.game.Started,
    },
  };
};

const tableMessageFetched = (state, action) => {
  return {
    ...state,
    TableMessage: action.payload.TableMessage,
  };
};

const chatFetched = (state, action) => {
  return {
    ...state,
    Messages: [...action.payload.Messages],
    isChatLoading: false,
  };
};

const socketInitiated = (state, action) => {
  return {
    ...state,
    socket: action.payload.socket,
  };
};

const socketClosed = (state, action) => {
  return {
    ...state,
    socket: null,
  };
};

const jackDropped = (state, action) => {
  return {
    ...state,
    isJackInputRequired: true,
  };
};

const jackChosen = (state, action) => {
  return {
    ...state,
    isJackInputRequired: false,
  };
};

const playerInputRequiredForEight = (state, action) => {
  return {
    ...state,
    isPlayerInputRequiredForEight: true,
  };
};

const playerInputGivenForEight = (state, action) => {
  return {
    ...state,
    isPlayerInputRequiredForEight: false,
  };
};

const playerInputRequiredForJack = (state, action) => {
  return {
    ...state,
    isPlayerInputRequiredForJack: true,
  };
};

const playerInputGivenForJack = (state, action) => {
  return {
    ...state,
    isPlayerInputRequiredForJack: false,
  };
};

const playerInputRequiredForSameRankOrSuit = (state, action) => {
  return {
    ...state,
    isPlayerInputRequiredForSameRankOrSuit: true,
  };
};

const playerInputGivenForSameRankOrSuit = (state, action) => {
  return {
    ...state,
    isPlayerInputRequiredForSameRankOrSuit: false,
  };
};

const newChatRecieved = (state, action) => {
  return {
    ...state,
    isNewChatRecieved: true,
  };
};

const resetNewChat = (state, action) => {
  return {
    ...state,
    isNewChatRecieved: false,
  };
};

const endGameRequested = (state, action) => {
  return {
    ...state,
    isEndGameConfirmationRequried: true,
  };
};

const endGameClosed = (state, action) => {
  return {
    ...state,
    isEndGameConfirmationRequried: false,
  };
};
const playerLeaveGameRequested = (state, action) => {
  return {
    ...state,
    isPlayerLeaveConfirmationRequired: true,
  };
};

const playerLeaveGameClosed = (state, action) => {
  return {
    ...state,
    isPlayerLeaveConfirmationRequired: false,
  };
};
const leaveGame = (state, action) => {
  return {
    ...state,
    leaveGame: true,
  };
};
const resetLeaveGame = (state, action) => {
  return {
    ...state,
    leaveGame: false,
    isLoading: false
  };
};

const clearTableMessage = (state, action) => {
  return {
    ...state,
    TableMessage: null
  }
}
const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GAME_FETCH_STARTED:
      return gameStarted(state, action);
    case ActionTypes.GAME_FETCH_FAILED:
      return gameFetchFailed(state, action);
    case ActionTypes.GAME_FETCHED:
      return gameFetched(state, action);
    case ActionTypes.SOCKET_INITIATED:
      return socketInitiated(state, action);
    case ActionTypes.SOCKET_CLOSED:
      return socketClosed(state, action);
    case ActionTypes.TABLE_MESSAGE_FETCHED:
      return tableMessageFetched(state, action);
    case ActionTypes.CHAT_FETCHED:
      return chatFetched(state, action);
    case ActionTypes.J_DROPPED:
      return jackDropped(state, action);
    case ActionTypes.J_CHOSEN:
      return jackChosen(state, action);
    case ActionTypes.PLAYER_INPUT_REQUIRED_FOR_EIGHT:
      return playerInputRequiredForEight(state, action);
    case ActionTypes.PLAYER_INPUT_GIVEN_FOR_EIGHT:
      return playerInputGivenForEight(state, action);
    case ActionTypes.PLAYER_INPUT_REQUIRED_FOR_JACK:
      return playerInputRequiredForJack(state, action);
    case ActionTypes.PLAYER_INPUT_GIVEN_FOR_JACK:
      return playerInputGivenForJack(state, action);
    case ActionTypes.PLAYER_INPUT_REQUIRED_FOR_SAME_RANK_OR_SUIT:
      return playerInputRequiredForSameRankOrSuit(state, action);
    case ActionTypes.PLAYER_INPUT_GIVEN_FOR_SAME_RANK_OR_SUIT:
      return playerInputGivenForSameRankOrSuit(state, action);
    case ActionTypes.CHAT_FETCH_STARTED:
      return chatFetchStarted(state, action);
    case ActionTypes.NEW_CHAT_RECIEVED:
      return newChatRecieved(state, action);
    case ActionTypes.RESET_NEW_CHAT:
      return resetNewChat(state, action);
    case ActionTypes.CHAT_FETCH_FAILED:
      return chatFetchFailed(state, action);
    case ActionTypes.END_GAME_REQUESTED:
      return endGameRequested(state, action);
    case ActionTypes.END_GAME_CLOSED:
      return endGameClosed(state, action);
    case ActionTypes.PLAYER_LEAVE_GAME_REQUESTED:
      return playerLeaveGameRequested(state, action);
    case ActionTypes.PLAYER_LEAVE_GAME_CLOSED:
      return playerLeaveGameClosed(state, action);
    case ActionTypes.LEAVE_GAME:
      return leaveGame(state, action);
    case ActionTypes.RESET_LEAVE_GAME:
      return resetLeaveGame(state, action);
    case ActionTypes.CLEAR_TABLE_MESSAGE:
      return clearTableMessage(state, action);
    default:
      return state;
  }
};

export default gameReducer;
