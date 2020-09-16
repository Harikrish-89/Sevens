import React from "react";
import { Button, Modal } from "react-bootstrap";

const modalDialogBox = (props) => {
  const confirmButton = props.onConfirm ? (
    <Button onClick={props.onConfirm} variant="primary">
      Confirm
    </Button>
  ) : null;
  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header id="alert-dialog-title">{props.title}</Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="primary">
          Close
        </Button>
        {confirmButton}
      </Modal.Footer>
    </Modal>
  );
};
export default React.memo(modalDialogBox);
