import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import {AppNav} from "./Navbar";
import { NavLink } from "react-router-dom";

configure({ adapter: new Adapter() });
describe("Nav component", () => {
  let AppNavComponent;
  beforeEach(() => {
    AppNavComponent = shallow(<AppNav />);
  });
  it("should define the home component", () => {
    expect(AppNavComponent).toBeDefined();
  });

  it("should define the nav link component", () => {
    AppNavComponent.setProps({ relative: "test" });
    expect(
      AppNavComponent.contains(
        <NavLink to="test/rules" className="nav-link">
          Rules
        </NavLink>
      )
    ).toBeTruthy();
    expect(
      AppNavComponent.contains(
        <NavLink to="/home" className="nav-link">
          Sevens
        </NavLink>
      )
    ).toBeTruthy();
  });
  it("should peform log out successfully", () => {
    const mockLogOutFunction = jest.fn();
    AppNavComponent.setProps({ logout: mockLogOutFunction });
    AppNavComponent.find("button").simulate("click");
    expect(mockLogOutFunction).toHaveBeenCalled();
  });

  it("should show the children", () => {
    AppNavComponent.setProps({ children: <div id="test"> test </div> });
    expect(AppNavComponent.find("div#test").length).toEqual(1);
  });

  it("should show the user icon", () => {
    AppNavComponent.setProps({ userIcon: "testUrl"});
    expect(AppNavComponent.find("img").length).toEqual(1);
  });

});
