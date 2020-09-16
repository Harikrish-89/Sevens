import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { Home } from "./home";
import { Redirect } from "react-router";
import Rules from "../../components/Rules/Rules";
import { Route } from "react-router";
import Play from "./Play/Play";
import Host from "./Host/Host";
import Join from "./Join/Join";
import Game from "./Game/Game";

configure({ adapter: new Adapter() });
describe("Home component", () => {
  let homeComponent;
  let props;
  const mockLogOutFunction = jest.fn();
  beforeEach(() => {
    props = {
      isLoggedOut: false,
      logout: mockLogOutFunction,
      match: { path: "test" },
    };
    console.log(props.match.path);
    homeComponent = shallow(<Home {...props} />);
  });
  it("should define the home component", () => {
    expect(homeComponent).toBeDefined();
  });

  it("should have the app nav component when logged in", () => {
    homeComponent.setProps({ isLoggedOut: false });
    expect(homeComponent.find("Connect(AppNav)").length).toEqual(1);
  });

  it("should have navigation to play component when logged in", () => {
    expect(
      homeComponent.contains(<Route path="test/play" component={Play} />)
    ).toBeTruthy();
  });

  it("should have navigation to host component when logged in", () => {
    expect(
      homeComponent.contains(<Route path="test/host" component={Host} />)
    ).toBeTruthy();
  });

  it("should have navigation to join component when logged in", () => {
    expect(
      homeComponent.contains(<Route path="test/join" component={Join} />)
    ).toBeTruthy();
  });

  it("should have the navgation to rules component when logged in", () => {
    expect(
      homeComponent.contains(<Route path="test/rules" component={Rules} />)
    ).toBeTruthy();
  });

  it("should have navigation to game component when logged in", () => {
    expect(
      homeComponent.contains(<Route path="test/game" component={Game} />)
    ).toBeTruthy();
  });

  it("should redirect when logged out", () => {
    homeComponent.setProps({ isLoggedOut: true });
    expect(homeComponent.contains(<Redirect to="/" />)).toBeTruthy();
  });
});
