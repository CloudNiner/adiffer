import React, { useState, ChangeEvent } from 'react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { Box, Button, InputAdornment, TextField, Typography } from '@material-ui/core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

type SequenceSelectorProps = {
  onChange: (sequenceId: string) => void,
};

const useStyles = makeStyles((theme) => ({
  sequenceInput: {
    marginRight: theme.spacing(1),
  },
}));

const osmEpoch = 1347432900;

const dateToSequence = (date: Date): string => {
  const epoch = Math.floor(date.getTime() / 1000);
  return Math.floor(((epoch - osmEpoch) / 60)).toString();
}

const sequenceToDate = (sequence: string): Date | null => {
  const sequenceInt = parseInt(sequence, 10);
  if (isNaN(sequenceInt) || sequenceInt < 0) {
    return null;
  }
  const epoch = sequenceInt * 60 + osmEpoch;
  return new Date(epoch * 1000);
}

const isSequenceValid = (sequence: string): boolean => {
  const sequenceDate = sequenceToDate(sequence);
  return Boolean(sequenceDate) && sequenceDate!.getTime() < new Date().getTime();
}

const SequenceSelector: React.FC<SequenceSelectorProps> = ({onChange}) => {
  const classes = useStyles();
  const [sequenceId, setSequenceId] = useState<string>("");

  const onDateChange = (date: Date | null) => {
    if (date) {
      setSequenceId(dateToSequence(date));
    } else {
      setSequenceId("");
    }
  }

  const onSequenceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sequence = event.target.value;
    const date = sequenceToDate(sequence);
    const newSequenceId = date ? sequence : "";
    setSequenceId(newSequenceId);
  }

  const sequenceDate: Date | null = sequenceId === "" ? null : sequenceToDate(sequenceId);

  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Box display="flex" alignItems="center">
        <TextField
          id="input-adiff-sequence-id"
          className={classes.sequenceInput}
          label="Sequence ID"
          onChange={onSequenceChange}
          variant="outlined"
          value={sequenceId}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }} />
        <Button
          color="primary"
          disabled={!isSequenceValid(sequenceId)}
          disableElevation
          onClick={() => onChange(sequenceId)}
          variant="contained">Go</Button>
      </Box>
      <Box my={1} alignSelf="center" fontWeight="bold">-- OR --</Box>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDateTimePicker
          id="input-adiff-date-picker"
          disableFuture={true}
          format="yyyy/MM/dd hh:mma"
          inputVariant="outlined"
          label="Sequence Date"
          minDate={sequenceToDate("0")}
          onChange={onDateChange}
          placeholder="Or a Date"
          value={sequenceDate}
          variant="inline" />
      </MuiPickersUtilsProvider>
    </Box>
  );
}

export default SequenceSelector;
