import React from 'react';

import { Button, InputAdornment, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  textField: {
    width: '100%',
  }
}));

const SequenceSelector = () => {
  const classes = useStyles();
  const goButton = <Button>Go</Button>;
  return (
    <TextField
      className={classes.textField}
      id="input-adiff-sequence-id"
      label="Sequence ID"
      variant="outlined"
      margin="dense"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: <InputAdornment position="end">{goButton}</InputAdornment>
      }} />
  );
}

export default SequenceSelector;
