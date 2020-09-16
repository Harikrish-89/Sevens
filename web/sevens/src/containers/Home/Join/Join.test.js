import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { Join } from "./Join";
import Spinner from "../../../components/Spinner/Spinner";

configure({ adapter: new Adapter() });

describe("Host Component", () => {
  let props;
  let joinComponent;
  const mockSubmitFunction = jest.fn();
  beforeEach(() => {
    props = { onSubmit: mockSubmitFunction };
    joinComponent = shallow(<Join {...props} />);
  });

  it("should define the host component", () => {
    expect(joinComponent).toBeDefined();
  });

  it("should define the join form", () => {
    expect(joinComponent.find("form").length).toEqual(1);
  });

  it("should submit the form", () => {
    joinComponent.find("form").simulate("submit", { preventDefault: () => {} });
    expect(mockSubmitFunction).toHaveBeenCalled();
  });
  it("should show spinner when loading", () => {
    joinComponent.setProps({ isLoading: true });
    expect(joinComponent.contains(<Spinner />)).toBeTruthy();
  });
});
