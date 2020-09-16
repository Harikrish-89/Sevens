import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { GamePlayer } from "./GamePlayer";

configure({ adapter: new Adapter() });
describe("Play component", () => {
  let gamePlayerComponent;
  let props;
  beforeEach(() => {
    gamePlayerComponent = shallow(<GamePlayer {...props} />);
  });
  it("should define the game component", () => {
    expect(gamePlayerComponent).toBeDefined();
  });

  it("should have the game player", () => {
    expect(gamePlayerComponent.find("div.gamePlayer").length).toEqual(1);
  });

  it("should show the game player image url", () => {
    gamePlayerComponent.setProps({ PhotoURL: "testUrl" });
    expect(gamePlayerComponent.find("div.gamePlayer img").length).toEqual(1);
  });

  it("should show the join when no image url", () => {
    gamePlayerComponent.setProps({ PhotoURL: null });
    expect(gamePlayerComponent.find("div.gamePlayer p").length).toEqual(1);
  });
});
