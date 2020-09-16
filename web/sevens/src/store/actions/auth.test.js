import * as auth from "./auth";
import * as firebaseBackend from "../firebase/firebaseBackend";
jest.mock("../firebase/firebaseBackend");

describe("Auth action", () => {
  let mocksetPersistence;
  let mockSignIn;
  let mockAuthFunction;
  let mockSignOut;
  beforeEach(() => {
    mockSignOut = jest.fn();
    mocksetPersistence = jest.fn().mockReturnValue(Promise.resolve());
    mockAuthFunction = jest.fn().mockReturnValue({
      setPersistence: mocksetPersistence,
      signInWithPopup: mockSignIn,
      signOut: mockSignOut,
    });
    firebaseBackend.firebaseApp = {
      auth: mockAuthFunction,
    };
  });
  it("should verify the auth sign in action successfully", () => {
    mockSignIn = jest
      .fn()
      .mockReturnValue(
        Promise.resolve({ user: {}, credential: { accessToken: "testToken" } })
      );
    expect(auth.signInAsync).toBeDefined();
    const signInAsyncFunction = auth.signInAsync();
    const mockdispatch = jest.fn();
    signInAsyncFunction(mockdispatch);
    expect(mockdispatch).toHaveBeenCalledWith(auth.authStart());
  });

  it("should verify the auth log out async action success", () => {
    mockSignOut.mockReturnValue(Promise.resolve(true));
    expect(auth.logoutAsync).toBeDefined();
    const logOutAsyncFunction = auth.logoutAsync();
    const mockdispatch = jest.fn();
    logOutAsyncFunction(mockdispatch);
    expect(mockdispatch).toHaveBeenCalledWith(auth.authStart());
  });

  it("should verify the auth log out async action failure", () => {
    const error = {};
    mockSignOut.mockReturnValue(Promise.reject(error));
    expect(auth.logoutAsync).toBeDefined();
    const logOutAsyncFunction = auth.logoutAsync();
    const mockdispatch = jest.fn();
    logOutAsyncFunction(mockdispatch);
    expect(mockdispatch).toHaveBeenCalledWith(auth.authStart());
  });

  it("should verify the auth sign in action failure", () => {
    mockSignIn = jest.fn().mockReturnValue(Promise.reject());
    expect(auth.signInAsync).toBeDefined();
    const signInAsyncFunction = auth.signInAsync();
    const mockdispatch = jest.fn();
    signInAsyncFunction(mockdispatch);
    expect(mockdispatch).toHaveBeenCalledWith(auth.authStart());
  });

  it("should verify the auth started action", () => {
    expect(auth.authStart).toBeDefined();
    const authStartAction = auth.authStart();
    expect(authStartAction.type).toEqual("AUTH_STARTED");
    expect(authStartAction.payload.isLoading).toBeTruthy();
  });

  it("should verify the auth error action", () => {
    expect(auth.authError).toBeDefined();
    const authErrorAction = auth.authError();
    expect(authErrorAction.type).toEqual("AUTH_FAILURE");
    expect(authErrorAction.payload.isLoading).toBeFalsy();
  });

  it("should verify the the auth success action", () => {
    expect(auth.authSuccess).toBeDefined();
    const authSuccessAction = auth.authSuccess();
    expect(authSuccessAction.type).toEqual("AUTH_SUCCESS");
    expect(authSuccessAction.payload.isLoading).toBeFalsy();
  });
});
