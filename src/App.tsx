import React, { useState } from "react";

import { Feature, FeatureCollection, Geometry } from "geojson";
import { Box, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { getAugmentedDiff, OsmObjectProperties, AugmentedDiff } from "./osm";
import ActionSelector, {
  ActionSelectorState,
} from "./Components/ActionSelector";
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
  const [created, setCreated] = useState<
    FeatureCollection<Geometry, OsmObjectProperties>
  >({
    type: "FeatureCollection",
    features: [],
  });
  const [deleted, setDeleted] = useState<
    FeatureCollection<Geometry, OsmObjectProperties>
  >({
    type: "FeatureCollection",
    features: [],
  });

  const isAugmentedDiffValid = !!(
    augmentedDiff.created.length ||
    augmentedDiff.deleted.length ||
    augmentedDiff.modified.length
  );

  const onSequenceChange = (sequenceId: string) => {
    getAugmentedDiff(sequenceId).then((newADiff) => {
      setAugmentedDiff(newADiff);
      const { created: c, deleted: d } = newADiff;
      const createdFeatures = c
        .map((f) => f.new)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null);
      setCreated({
        type: "FeatureCollection",
        features: createdFeatures,
      });
      const deletedFeatures = d
        .map((f) => f.old)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null);
      setDeleted({
        type: "FeatureCollection",
        features: deletedFeatures,
      });
    });
  };

  const onActionChanged = (actions: ActionSelectorState) => {
    if (actions.create) {
      const createdFeatures = augmentedDiff.created
        .map((f) => f.new)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null);
      setCreated({
        type: "FeatureCollection",
        features: createdFeatures,
      });
    } else {
      setCreated({ type: "FeatureCollection", features: [] });
    }

    if (actions.delete) {
      const deletedFeatures = augmentedDiff.deleted
        .map((f) => f.old)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null);
      setDeleted({
        type: "FeatureCollection",
        features: deletedFeatures,
      });
    } else {
      setDeleted({ type: "FeatureCollection", features: [] });
    }
  };

  return (
    <Box className={classes.windowBox}>
      <Box mx={2} className={classes.sidebarBox}>
        <Header />
        <SequenceSelector onChange={onSequenceChange} />
        {isAugmentedDiffValid && (
          <>
            <Box my={3}>
              <Divider />
            </Box>
            <ActionSelector onActionChanged={onActionChanged} />
          </>
        )}
      </Box>
      <Map className={classes.mapBox} created={created} deleted={deleted} />
    </Box>
  );
}

export default App;
