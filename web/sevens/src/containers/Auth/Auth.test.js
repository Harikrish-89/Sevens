import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { Auth } from "./Auth";
import { Redirect } from "react-router";
import Spinner from "../../components/Spinner/Spinner";

configure({ adapter: new Adapter() });

describe("Auth", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Auth />);
  });

  it("should define auth component", () => {
    expect(wrapper.find("button")).toBeDefined();
  });

  it("should redirect to home once logged in", () => {
    wrapper.setProps({ isLoggedIn: true });
    expect(wrapper.contains(<Redirect to="/home"/>)).toBeTruthy();
  });

  it("should load spinner while authenticating", () => {
    wrapper.setProps({ isLoading: true });
    expect(wrapper.contains(<Spinner />)).toBeTruthy();
  });
});
