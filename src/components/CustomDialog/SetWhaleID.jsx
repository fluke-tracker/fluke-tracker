import React, {createRef} from 'react';
import Button from "components/CustomButtons/Button.jsx";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { updatePicture } from 'graphql/mutations';

export default function SetWhaleDialog(props) {
  const [open, setOpen] = React.useState(false);
  let id;
  const handleClickOpen = () => {
    setOpen(true);
  };
  const myChangeHandler = (event) => {
    id = event.target.value;
  }
  const handleCloseAbort = () => {
    setOpen(false);
  };
  const handleCloseOk = () => {
    setOpen(false);
    console.log(props.function(id));
  };

  return (
    <div>
      <Button size="sm" variant="contained" color="white" onClick={handleClickOpen}>Set ID</Button>
      <Dialog
        open={open}
        onClose={handleCloseAbort}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Set ID manually"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          </DialogContentText>
          <TextField
          id="standard-number"
          label="Number"
          type="number"
          onChange={myChangeHandler}
          InputLabelProps={{
            shrink: true,
          }}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOk} color="success">
            Ok
          </Button>
          <Button onClick={handleCloseAbort} color="primary" autoFocus>
            Abort
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}