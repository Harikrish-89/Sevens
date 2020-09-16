import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import Card from "./Card";
configure({ adapter: new Adapter() });

describe("Card", () => {
  let cardComponent;
  const mockClickFunction = jest.fn();
  beforeEach(() => {
    const props = {
      title: "Host",
      descripton: "Host a game",
      onClick: mockClickFunction,
    };
    cardComponent = shallow(<Card {...props} />);
  });
  it("should define the card component", () => {
    expect(cardComponent).toBeDefined();
    expect(cardComponent.find("div.card")).toBeDefined();
    cardComponent.find("div.card").simulate("click");
    expect(mockClickFunction).toHaveBeenCalled();
  });
});
