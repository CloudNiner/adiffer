import React, { useState } from "react";

import { Feature, FeatureCollection, Geometry } from "geojson";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { getAugmentedDiff, OsmObjectProperties, AugmentedDiff } from "./osm";
import Header from "./Components/Header";
import SequenceSelector from "./Components/SequenceSelector";
import Map from "./Sections/Map";

const useStyles = makeStyles((theme) => ({
  windowBox: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    flex: 1,

    "@media (min-width: 768px)": {
      flexDirection: "row",
    },
  },
  sidebarBox: {
    flex: "0 0 24em",
    display: "flex",
    flexDirection: "column",
  },
  mapBox: {
    flex: 1,
  },
}));

function App() {
  const classes = useStyles();
  const [augmentedDiff, setAugmentedDiff] = useState<AugmentedDiff>({
    created: [],
    modified: [],
    deleted: [],
  });
  const { created, deleted } = augmentedDiff;

  const onSequenceChange = (sequenceId: string) => {
    getAugmentedDiff(sequenceId).then((augmentedDiff) =>
      setAugmentedDiff(augmentedDiff)
    );
  };

  const createdFeatures = created
    .map((f) => f.new)
    .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null);
  const createdCollection: FeatureCollection<Geometry, OsmObjectProperties> = {
    type: "FeatureCollection",
    features: createdFeatures,
  };

  const deletedFeatures = deleted
    .map((f) => f.old)
    .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null);
  const deletedCollection: FeatureCollection<Geometry, OsmObjectProperties> = {
    type: "FeatureCollection",
    features: deletedFeatures,
  };

  return (
    <Box className={classes.windowBox}>
      <Box mx={2} className={classes.sidebarBox}>
        <Header />
        <SequenceSelector onChange={onSequenceChange} />
      </Box>
      <Map
        className={classes.mapBox}
        created={createdCollection}
        deleted={deletedCollection}
      />
    </Box>
  );
}

export default App;
