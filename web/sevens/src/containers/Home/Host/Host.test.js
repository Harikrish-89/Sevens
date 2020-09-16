import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { Host } from "./Host";
import Spinner from "../../../components/Spinner/Spinner";

configure({ adapter: new Adapter() });

describe("Host Component", () => {
  let hostComponent;
  let props;
  beforeEach(() => {
    hostComponent = shallow(<Host {...props} />);
  });

  it("should define the host component", () => {
    expect(hostComponent).toBeDefined();
  });

  it("should define the host form", () => {
    expect(hostComponent.find("form#hostForm").length).toEqual(1);
  });

  it("should call the host form submit function", () => {
    const submitMockFn = jest.fn();
    hostComponent.setProps({ hostFormSubmitted: submitMockFn });
    const hostForm = hostComponent.find("form#hostForm");
    hostForm.simulate("submit", { preventDefault: () => {} });
    expect(submitMockFn).toHaveBeenCalled();
  });
  it("should show spinner when loading", () => {
    hostComponent.setProps({ isLoading: true });
    expect(hostComponent.contains(<Spinner />)).toBeTruthy();
  });
});
