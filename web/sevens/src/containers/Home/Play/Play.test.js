import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import  Play  from "./Play";

configure({ adapter: new Adapter() });
describe("Play component", () => {
  let playComponent = shallow(<Play />);
  it("should define the play component", () => {
    expect(playComponent).toBeDefined();
  });
  it("should have the card components", () => {
    expect(playComponent.find("div#options.row").length).toEqual(1);
    expect(playComponent.find("Card").length).toEqual(2);
  });
});
