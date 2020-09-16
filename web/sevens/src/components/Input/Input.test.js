import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import Input from "./Input";

configure({ adapter: new Adapter() });

describe("Input component", () => {
  let inputComponent;
  let onInputChangeHanlder = jest.fn();
  let props = {
    elementType: "",
    onChanged: onInputChangeHanlder,
    elementConfig: { type: "" },
  };
  beforeEach(() => {
    inputComponent = shallow(<Input {...props} />);
  });
  it("should verify the input text component", () => {
    props.elementType = "input";
    props.elementConfig.type = "text";
    inputComponent.setProps(props);
    expect(inputComponent.find(`input[type="text"]`).length).toEqual(1);
  });
  it("should call the on change handler when input changes", () => {
    props.elementType = "input";
    props.elementConfig.type = "text";
    inputComponent.setProps(props);
    inputComponent.find(`input[type="text"]`).simulate("change", "testData");
    expect(onInputChangeHanlder).toHaveBeenCalled();
  });
  it("should call the on change handler when input changes", () => {
    props.elementType = "input";
    props.elementConfig.type = "textarea";
    inputComponent.setProps(props);
    expect(inputComponent.find(`input[type="textarea"]`).length).toEqual(1);
  });
  it("should call the on change handler when input changes", () => {
    props.elementType = "input";
    props.elementConfig.type = "select";
    inputComponent.setProps(props);
    expect(inputComponent.find(`input[type="select"]`).length).toEqual(1);
  });
});
