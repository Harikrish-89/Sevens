import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { GameTable } from "./GameTable";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import GameReducer from "../../../../store/reducer/game";
import GamePlayer from "../../../../components/GamePlayer/GamePlayer";
import AuthReducer from "../../../../store/reducer/auth";

const rootReducer = combineReducers({
  auth: AuthReducer,
  game: GameReducer,
});

configure({ adapter: new Adapter() });
describe("Play component", () => {
  const getComponentWithMockStore = (
    mockStore = createStore(rootReducer, {
      game: { game: { GameID: "hariTest" } },
    })
  ) => {
    return mount(
      <Provider store={mockStore}>
        <GameTable />
      </Provider>
    );
  };
  beforeEach(() => {});
  it("should define the game component", () => {
    expect(getComponentWithMockStore()).toBeDefined();
  });

  it("should show the game id", () => {
    expect(getComponentWithMockStore().find("div#gameId").text()).toEqual(
      "Game id: hariTest"
    );
  });
  it("should show the game player components", () => {
    expect(getComponentWithMockStore().find("GamePlayer").length).toEqual(12);
  });
  it("should show the current player component", () => {
    const store = createStore(rootReducer, {
      game: {
        game: {
          GameID: "hariTest",
          Players: [{ ID: "firstPlayer", PhotoURL: "testUrl" }],
        },
      },
      auth: { user: { uid: "firstPlayer" } },
    });
    expect(
      getComponentWithMockStore(store).find("GamePlayer").getElements()[10]
        .props.PhotoURL
    ).toEqual("testUrl");
  });
});
