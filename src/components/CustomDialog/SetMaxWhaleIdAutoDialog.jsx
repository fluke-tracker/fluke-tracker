import React from 'react';
import Button from 'components/CustomButtons/Button.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getConfig } from 'graphql/queries';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

import API, { graphqlOperation } from '@aws-amplify/api';

const SetMaxWhaleIdAutoDialog = (props) => {
  const [open, setOpen] = React.useState(false);
  const [whaleID, setWhaleID] = React.useState();
  const [maxwhaleID, setMaxWhaleID] = React.useState();

  const handleClickOpen = async () => {
    setOpen(true);
    let getWhaleID = await API.graphql(
      graphqlOperation(getConfig, { id: 'maxWhaleId' })
    );
    setMaxWhaleID(getWhaleID.data.getConfig.value);
    setWhaleID(getWhaleID.data.getConfig.value);
  };
  const handleCloseAbort = () => {
    setOpen(false);
  };
  const handleCloseOk = () => {
    setOpen(false);
    props.function(whaleID, maxwhaleID);
  };
  const handleInputChange = (e) => {
    console.log('whale id parsed', e.target.value);
    setWhaleID(e.target.value);
  };
  return (
    <div>
      <Button
        size="sm"
        disabled={props.disabled}
        variant="contained"
        color="success"
        onClick={handleClickOpen}
      >
        Create and set new whale ID
      </Button>
      <Dialog
        open={open}
        onClose={handleCloseAbort}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Automatically create and set new whale ID'}
        </DialogTitle>
        <DialogContent>
          <br />
          <b>Warning!</b> You're about to <b>create a new whale ID</b> or match
          the whale to an <b>existing ID</b>
          <br />
          <b>If you're not sure please return to the matching page</b> and match
          the new picture via the "Match" button to an existing whale ID.
          <br />
          The Max Whale ID in the database is <b>{maxwhaleID}.</b>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOk} color="success">
            YES, create new whale ID
          </Button>
          <Button onClick={handleCloseAbort} color="primary" autoFocus>
            Abort
          </Button>
          <FormControl required>
            <Input
              type="text"
              /*   style={{ "text-align": "center", borderRadius: "5px" }} */
              name="whaleIDInput"
              placeholder="Whale ID"
              value={whaleID}
              onChange={handleInputChange}
              required={true}
            />
          </FormControl>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SetMaxWhaleIdAutoDialog;
