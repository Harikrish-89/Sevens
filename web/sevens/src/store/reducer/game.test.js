import gameReducer from "./game";
import * as ActionTypes from "../actions/actionTypes";

describe("gameReducer", () => {
  it("should define game reducer", () => {
    expect(gameReducer).toBeDefined();
  });

  it("should update the state for game fetch start", () => {
    const state = { isLoading: false };
    const updatedState = gameReducer(state, {
      type: ActionTypes.GAME_FETCH_STARTED,
    });
    expect(updatedState.isLoading).toBeTruthy();
  });

  it("should update the state for game fetch failure", () => {
    const state = { isLoading: true, isError: false };
    const updatedState = gameReducer(state, {
      type: ActionTypes.GAME_FETCH_FAILED,
    });
    expect(updatedState.isLoading).toBeFalsy();
    expect(updatedState.isError).toBeTruthy();
  });

  it("should update the state for game fetch success", () => {
    const initialGame = {
      DrawableCards: [],
      DroppedCards: [],
      Ended: false,
      GameID: "",
      IsClockwise: true,
      Messages: [],
      Players: [],
      Settings: { Decks: 0, MaxPoint: 0, ResponseTime: 0 },
      Started: false,
    };
    const state = { isLoading: true, isError: true, game: initialGame };
    const game = {
      DrawableCards: [
        {
          Rank: "Ace",
          Suit: "Clubs",
        },
      ],
      DroppedCards: [
        {
          Rank: "5",
          Suit: "Spade",
        },
      ],
      Ended: true,
      GameID: "hariDhanaDemo",
      IsClockwise: false,
      Messages: ["some", "text", "messages"],
      Players: [
        {
          Cards: [
            {
              Rank: "5",
              Suit: "hearts",
            },
          ],
          ID: "123456",
          IsDealer: false,
          Name: "Hari",
          PhotoURL: "testUrl",
          Points: 23,
          Token: "tstToken",
        },
        {
          Cards: [
            {
              Rank: "8",
              Suit: "spade",
            },
          ],
          ID: "123457",
          IsDealer: true,
          Name: "HariKrish",
          PhotoURL: "testUrl",
          Points: 45,
          Token: "tstToken",
        },
      ],
      Settings: {
        Decks: 2,
        MaxPoint: 230,
        ResponseTime: 20,
      },
      Started: false,
    };
    const updatedState = gameReducer(state, {
      type: ActionTypes.GAME_FETCHED,
      payload: { game: game },
    });
    expect(updatedState.isLoading).toBeFalsy();
    expect(updatedState.isError).toBeFalsy();
    expect(updatedState.game).toEqual(game);
  });

  it("should return the initial state for default action", () => {
    const initialGame = {
      DrawableCards: [],
      DroppedCards: [],
      Ended: false,
      GameID: "",
      IsClockwise: true,
      Messages: [],
      Players: [],
      Settings: { Decks: 0, MaxPoint: 0, ResponseTime: 0 },
      Started: false,
    };
    const updatedState = gameReducer(
      { game: initialGame },
      { type: "default" }
    );
    expect(updatedState.game).toEqual(initialGame);
  });
});
