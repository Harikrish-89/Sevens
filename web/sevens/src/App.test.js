import React from "react"
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import App from "./App";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

configure({adapter: new Adapter()})


describe("App", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<App />)
  })
  it("should render the app properly", () => {
    expect(wrapper.find(Switch)).toBeDefined();
    expect(wrapper.find(BrowserRouter)).toHaveLength(1);
    expect(wrapper.find(Route)).toHaveLength(2);
    const route = wrapper.find(Route);
    console.log(route)
    expect(route.get(0).props.path).toEqual("/login");
    expect(route.get(1).props.path).toEqual("/home");
    expect(wrapper.find(Redirect)).toHaveLength(1);
  });
});