import authReducer from "./auth";
import * as ActionTypes from "../actions/actionTypes";

describe("AuthReducer", () => {
  it("should define auth reducer", () => {
    expect(authReducer).toBeDefined();
  });
  it("should update the state for auth start", () => {
    const newState = authReducer(null, {
      type: ActionTypes.AUTH_STARTED,
      payload: { isLoading: true },
    });
    expect(newState.isLoading).toBeTruthy();
  });
  it("should update the state for auth failure", () => {
    const newState = authReducer(null, {
      type: ActionTypes.AUTH_FAILURE,
      payload: { isLoading: false, error: { msg: "some error" } },
    });
    expect(newState.isLoading).toBeFalsy();
    expect(newState.error.msg).toEqual("some error");
  });
  it("should update the state for auth success", () => {
    const newState = authReducer(null, {
      type: ActionTypes.AUTH_SUCCESS,
      payload: {
        isLoading: false,
        user: { userName: "test user name" },
        token: "testToken",
      },
    });
    expect(newState.isLoading).toBeFalsy();
    expect(newState.user.userName).toEqual("test user name");
    expect(newState.token).toEqual("testToken");
  });
});
