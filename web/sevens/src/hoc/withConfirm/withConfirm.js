import React, { Fragment, useEffect } from "react";
import * as actions from "../../store/actions/";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../components/ModalDialogBox/ModalDialogBox";

const withConfirm = (WrappedComponent) => {
  return (props) => {
    const isEndGameConfirmationRequried = useSelector((state) => {
      return state.game.isEndGameConfirmationRequried;
    });
    const isPlayerLeaveConfirmationRequired = useSelector((state) => {
      return state.game.isPlayerLeaveConfirmationRequired;
    });
    const game = useSelector((state) => {
      return state.game.game;
    });
    const user = useSelector((state) => {
      return state.auth.user;
    });
    const dispatch = useDispatch();
    const onUnload = (event) => {
      dispatch(actions.playerLeaveGameConfirmedAsync(user.uid, game));
    };

    useEffect(() => {
      window.addEventListener("unload", onUnload);
      return () => {
        window.removeEventListener("unload", onUnload);
      };
    }, []);

    const closeHandler = () => {
      if (isEndGameConfirmationRequried) {
        dispatch(actions.endGameClosed());
      }
      if (isPlayerLeaveConfirmationRequired) {
        dispatch(actions.playerLeaveGameClosed());
      }
    };
    const confirmHandler = () => {
      if (isEndGameConfirmationRequried) {
        dispatch(actions.endGameConfirmedAsync(game));
      }
      if (isPlayerLeaveConfirmationRequired) {
        dispatch(
          actions.playerLeaveGameConfirmedAsync(user.uid, game, props.history)
        );
      }
    };
    let message = "";
    if (isEndGameConfirmationRequried) {
      message = "Are you sure you wanted to end the game";
    }
    if (isPlayerLeaveConfirmationRequired) {
      message = "Are you sure you wanted to leave the game";
    }
    return (
      <Fragment>
        <Modal
          show={
            isEndGameConfirmationRequried || isPlayerLeaveConfirmationRequired
          }
          onHide={closeHandler}
          onConfirm={confirmHandler}
        >
          {message}
        </Modal>
        <WrappedComponent {...props} />
      </Fragment>
    );
  };
};

export default withConfirm;
