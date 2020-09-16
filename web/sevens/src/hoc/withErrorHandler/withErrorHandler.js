import React,{Fragment} from "react";
import Modal from "../../components/ModalDialogBox/ModalDialogBox";
import useHttpErrorHandler from "../../hooks/http-error-handler";

const withErrorHandler = (WrappedComponent, axios) => {
  return (props) => {
    const [error, closeHandler] = useHttpErrorHandler(axios);
    console.log(error)
    return (
      <Fragment>
        <Modal show={error} onHide={closeHandler}>
          {error ? error.message : ""}
        </Modal>
        <WrappedComponent {...props} />
      </Fragment>
    );
  };
};

export default withErrorHandler;
