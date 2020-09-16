import * as ActionTypes from "./actionTypes";
import * as firebase from "../firebase/firebaseBackend";

export const authStart = () => {
  return {
    type: ActionTypes.AUTH_STARTED,
    payload: { isLoading: true },
  };
};

export const authSuccess = (user, token) => {
  return {
    type: ActionTypes.AUTH_SUCCESS,
    payload: { isLoading: false, user: user, token: token },
  };
};

export const authError = (error) => {
  return {
    type: ActionTypes.AUTH_FAILURE,
    payload: { isLoading: false, error: error },
  };
};

export const logoutAsync = () => {
  return (dispatch) => {
    dispatch(authStart());
    firebase.firebaseApp
      .auth()
      .signOut()
      .then(() => {
        dispatch(authSuccess(null, null));
      })
      .catch((error) => {
        dispatch(authError(error));
      });
  };
};

export const signInAsync = () => {
  return (dispatch) => {
    dispatch(authStart());
    var provider = firebase.googleAuthProvider;
    provider.addScope("profile");
    provider.addScope("email");
    firebase.firebaseApp
      .auth()
      .setPersistence(firebase.SESSION_PERSISTANCE)
      .then(() => {
        firebase.firebaseApp
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            dispatch(authSuccess(result.user, result.credential.accessToken));
          })
          .catch((err) => {
            dispatch(authError(err));
          });
      })
      .catch((error) => {
        dispatch(authError(error));
      });
  };
};
