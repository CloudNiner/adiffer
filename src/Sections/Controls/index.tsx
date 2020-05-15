import React from 'react';

import { Box, Button} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import SequenceSelector from './Components/SequenceSelector';

type Props = {
  className?: string,
}

const Controls: React.FC<Props> = ({className}) => {
  return (
    <Box className={className} display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h1>ADiffer</h1>
        <Button variant="contained" startIcon={<InfoIcon />}>Help</Button>
      </Box>
      <SequenceSelector />
    </Box>
  );
}

export default Controls;
