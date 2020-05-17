import React, { useState } from 'react';

import {FeatureCollection, Geometry, GeoJsonProperties} from 'geojson';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getAugmentedDiff } from './osm';
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

const emptyFeatureCollection: FeatureCollection<Geometry, GeoJsonProperties> =
  {type: 'FeatureCollection', features: []};

function App() {
  const classes = useStyles();
  const [features, setFeatures] = useState<FeatureCollection<Geometry, GeoJsonProperties>>(emptyFeatureCollection);

  const onSequenceChange = (sequenceId: string) => {
    getAugmentedDiff(sequenceId).then((data) => setFeatures(data));
  }

  return (
    <Box className={classes.windowBox}>
      <Box mx={2}  className={classes.sidebarBox}>
        <Header />
        <SequenceSelector onChange={onSequenceChange} />
      </Box>
      <Map className={classes.mapBox} geojsonLayer={features}/>
    </Box>
  );
}

export default App;
