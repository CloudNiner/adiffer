import React from 'react';

import { Box, Button} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

const Header = () => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <h1>ADiffer</h1>
      <Button size="small" startIcon={<InfoIcon />} variant="contained">Help</Button>
    </Box>
  );
};

export default Header;
