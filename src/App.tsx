import React, { useState } from 'react';

import {Feature, FeatureCollection, Geometry} from 'geojson';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getAugmentedDiff, OsmObjectProperties } from './osm';
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

const emptyFeatureCollection: FeatureCollection<Geometry, OsmObjectProperties> =
  {type: 'FeatureCollection', features: []};

function App() {
  const classes = useStyles();
  const [oldFeatures, setOldFeatures] = useState<FeatureCollection<Geometry, OsmObjectProperties>>(emptyFeatureCollection);
  const [newFeatures, setNewFeatures] = useState<FeatureCollection<Geometry, OsmObjectProperties>>(emptyFeatureCollection);

  const onSequenceChange = (sequenceId: string) => {
    getAugmentedDiff(sequenceId).then(({created, modified, deleted}) => {
      // const newFeatures = [created, modified]
      //   .flat(2)
      //   .map((d) => d.new)
      //   .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null);
      // setNewFeatures({
      //   type: "FeatureCollection",
      //   features: newFeatures
      // });
      const oldFeatures = [modified, deleted]
        .flat(2)
        .map((d) => d.old)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null);
      setOldFeatures({
        type: "FeatureCollection",
        features: oldFeatures
      });
    });
  }

  return (
    <Box className={classes.windowBox}>
      <Box mx={2}  className={classes.sidebarBox}>
        <Header />
        <SequenceSelector onChange={onSequenceChange} />
      </Box>
      <Map className={classes.mapBox} newObjects={newFeatures} oldObjects={oldFeatures}/>
    </Box>
  );
}

export default App;
