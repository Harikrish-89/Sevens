import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import Spinner from "./Spinner";
import React from "react";

configure({adapter: new Adapter()});

describe("spinner", ()=>{
    const wrapper = shallow(<Spinner />);
    it("should define the spinner component",()=>{
        expect(wrapper.find("div.spinner")).toBeDefined();
    })
})