import * as ActionTypes from "../actions/actionTypes";

const initialState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
};

const authStarted = (state, action) => {
  return {
    ...state,
    isLoading: action.payload.isLoading,
  };
};

const authFailure = (state, action) => {
  return {
    ...state,
    isLoading: action.payload.isLoading,
    error: action.payload.error,
  };
};

const authSuccess = (state, action) => {
    return {
      ...state,
      isLoading: action.payload.isLoading,
      token: action.payload.token,
      user: action.payload.user
    };
  };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.AUTH_STARTED:
      return authStarted(state, action);
    case ActionTypes.AUTH_FAILURE:
      return authFailure(state, action);
    case ActionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    default:
      return state;
  }
};

export default authReducer;
