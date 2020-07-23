import React, { createRef } from "react";
import Button from "components/CustomButtons/Button.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { updatePicture } from "graphql/mutations";

const SetMaxWhaleIdAutoDialog = (props) => {
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
      <Button size="sm" variant="contained" color="white" onClick={handleClickOpen}>
        Create and set new whale ID
      </Button>
      <Dialog
        open={open}
        onClose={handleCloseAbort}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Automatically create and set new whale ID"}
        </DialogTitle>
        <DialogContent>
          <br />
          <b>Warning!</b> You're about to <b>create a new whale ID</b>. Are you sure there is no
          current whale matching?
          <br />
          <b>If you're not sure please return to the matching page</b> and match the new picture via
          the "Match" button to an existing whale ID.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOk} color="success">
            YES, create new whale ID
          </Button>
          <Button onClick={handleCloseAbort} color="primary" autoFocus>
            Abort
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SetMaxWhaleIdAutoDialog;
