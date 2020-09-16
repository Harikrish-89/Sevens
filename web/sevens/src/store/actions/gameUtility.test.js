import * as gameUtility from "./gameUtility";
jest.mock("uniqid", () => () => "akldfask");

describe("Game utility", () => {
  it("should define the create game from game settings utility", () => {
    expect(gameUtility.createGameFromSettings).toBeDefined();
  });
  it("should return the game with settings", () => {
    const game = gameUtility.createGameFromSettings({
      Decks: 2,
      MaxPoint: 240,
      ResponseTime: 10,
    });
    expect(game.Settings.Decks).toEqual(2);
    expect(game.Settings.MaxPoint).toEqual(240);
    expect(game.Settings.ResponseTime).toEqual(10);
  });
  it("should return a unique id for each game", () => {
    const game = gameUtility.createGameFromSettings({
      Decks: 2,
      MaxPoint: 240,
      ResponseTime: 10,
    });
    expect(game.GameID).toEqual("akldfask");
  });

  it("should have two deck of cards if game settings is two", () => {
    const game = gameUtility.createGameFromSettings({
      Decks: 2,
      MaxPoint: 240,
      ResponseTime: 10,
    });
    expect(game.DrawableCards.length).toEqual(104);
  });

});

