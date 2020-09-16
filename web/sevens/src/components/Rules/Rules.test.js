import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import Rules from "./Rules";

configure({ adapter: new Adapter() });

describe("Rules", () => {
  let RulesComponent = shallow(<Rules />);
  it("should define the rules component", () => {
      expect(RulesComponent).toBeDefined();
  });
  it("should have the rules div", () => {
    expect(RulesComponent.find("div#rules")).toBeDefined();
});
});
