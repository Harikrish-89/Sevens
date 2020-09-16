import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import Game from "./Game";
import GameTable from "./GameTable/GameTable"

configure({ adapter: new Adapter() });
describe("Play component", () => {
  let gameComponent = shallow(<Game />);
  it("should define the game component", () => {
    expect(gameComponent).toBeDefined();
  });

  it("should have the game table component", () => {
    expect(gameComponent.contains(<GameTable />)).toBeTruthy();
  });
});
