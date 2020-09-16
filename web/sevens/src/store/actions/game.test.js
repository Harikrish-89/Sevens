import * as game from "./game";
import * as ActionTypes from "./actionTypes";
import axios from "axios";
import io from "socket.io-client";

jest.mock("axios");
jest.mock("socket.io-client");

describe("Game action", () => {
  const gamePayLoad = {
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
  it("should verify the game fetch started action", () => {
    expect(game.gameFetchStarted).toBeDefined();
    const action = game.gameFetchStarted();
    expect(action).toEqual({ type: ActionTypes.GAME_FETCH_STARTED });
  });

  it("should verify the game fetch failed action", () => {
    expect(game.gameFetchFailed).toBeDefined();
    const action = game.gameFetchFailed();
    expect(action).toEqual({ type: ActionTypes.GAME_FETCH_FAILED });
  });

  it("should verify the game fetch success action", () => {
    expect(game.gameFetched).toBeDefined();
    const action = game.gameFetched(gamePayLoad);
    expect(action).toEqual({
      type: ActionTypes.GAME_FETCHED,
      payload: { game: gamePayLoad },
    });
  });
  it("should verify the game fetch async action success", () => {
    expect(game.gameFetchAsync).toBeDefined();
    const dispatch = jest.fn();
    axios.get.mockImplementation(() => Promise.resolve(gamePayLoad));
    game.gameFetchAsync(12345, {})(dispatch);
    expect(dispatch).toHaveBeenCalledWith(game.gameFetchStarted());
  });

  it("should verify the game fetch async action failure", () => {
    expect(game.gameFetchAsync).toBeDefined();
    const dispatch = jest.fn();
    axios.get.mockImplementationOnce(() => Promise.reject());
    game.gameFetchAsync(12345, {})(dispatch);
    expect(dispatch).toHaveBeenCalledWith(game.gameFetchStarted());
  });

  it("should verify the create game async action success", () => {
    expect(game.createGameAsync).toBeDefined();
    const dispatch = jest.fn();
    const pushFunction = jest.fn();
    axios.post.mockImplementationOnce(() => Promise.resolve());
    game.createGameAsync(
      { Decks: 2, MaxPoint: 235, ResponseTime: 21 },
      { push: pushFunction }
    )(dispatch);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("should verify the create game async action failure", () => {
    expect(game.createGameAsync).toBeDefined();
    const dispatch = jest.fn();
    const pushFunction = jest.fn();
    axios.post.mockImplementationOnce(() => Promise.reject());
    game.createGameAsync(
      { Decks: 2, MaxPoint: 235, ResponseTime: 21 },
      { push: pushFunction }
    )(dispatch);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(pushFunction).toHaveBeenCalledTimes(0);
  });

  it("should verify the init io scoket action", () => {
    expect(game.initSocketIo).toBeDefined();
    const dispatch = jest.fn();
    io.mockReturnValue({ send: jest.fn() });
    game.initSocketIo(gamePayLoad, "firstPlayer")(dispatch);
    expect(io).toHaveBeenCalled();
  });

  it("should verify the send socket function", () => {
    const mockSendFunction = jest.fn();
    expect(game.sendThroughSocket).toBeDefined();
    io.mockReturnValue({ send: mockSendFunction });
    game.sendThroughSocket(gamePayLoad);
  });

  it("should verify the data receieved socket function", () => {
    const dispatch = jest.fn();
    const mockRecieveFunction = jest.fn();
    mockRecieveFunction.mockReturnValue(gamePayLoad);
    expect(game.recieveDataThroughSocket).toBeDefined();
    io.mockReturnValue({ on: mockRecieveFunction });
    game.recieveDataThroughSocket()(dispatch);
    expect(mockRecieveFunction).toHaveBeenCalled();
  });
});
