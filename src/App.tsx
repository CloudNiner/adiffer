import React from 'react';
import { Box } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import Header from './Components/Header';
import SequenceSelector from './Components/SequenceSelector';
import Map from './Sections/Map';

const useStyles = makeStyles((theme) => ({
  windowBox: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    flex: 1,

    '@media (min-width: 768px)': {
      flexDirection: 'row',
    }
  },
  sidebarBox: {
    flex: '0 0 24em',
    display: 'flex',
    flexDirection: 'column',
  },
  mapBox: {
    flex: 1,
  }
}));

function App() {
  const classes = useStyles();
  return (
    <Box className={classes.windowBox}>
      <Box mx={2}  className={classes.sidebarBox}>
        <Header />
        <SequenceSelector onChange={(sequenceId) => alert(`Sequence ID: ${sequenceId}`)} />
      </Box>
      <Map className={classes.mapBox} />
    </Box>
  );
}

export default App;
