import React from "react";
import Button from "components/CustomButtons/Button.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const DeletePictureDialog = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseAbort = () => {
    setOpen(false);
  };
  const handleCloseOk = () => {
    setOpen(false);
    props.function();
  };

  return (
    <div>
      <Button
        size="sm"
        disabled={props.disabled}
        variant="contained"
        color="warning"
        onClick={handleClickOpen}
      >
        Delete picture
      </Button>
      <Dialog
        open={open}
        onClose={handleCloseAbort}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete picture"}</DialogTitle>
        <DialogContent>
          <br />
          <b>Warning!</b>
          <br />
          You're about to <b>delete the picture with the filename "{props.picName}"</b>.
          <br />
          This deletion cannot be undone. Are you sure you want to continue?
          <br />
          <b>If you're not sure</b> please abort and return to the matching page.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOk} color="success">
            YES, delete the picture
          </Button>
          <Button onClick={handleCloseAbort} color="primary" autoFocus>
            Abort
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeletePictureDialog;
