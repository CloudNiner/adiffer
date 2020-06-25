import React, { useState } from "react";

import { Feature, Geometry } from "geojson";
import { Box, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { getAugmentedDiff, OsmObjectProperties, AugmentedDiff } from "./osm";
import ActionSelector, {
  ActionSelectorState,
} from "./Components/ActionSelector";
import Header from "./Components/Header";
import SequenceSelector from "./Components/SequenceSelector";
import Map from "./Sections/Map";
import OsmObjectSelector, {
  OsmObjectSelectorState,
} from "./Components/OsmObjectSelector";

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

const defaultActions: ActionSelectorState = {
  create: true,
  modify: true,
  delete: true,
};

const defaultObjects: OsmObjectSelectorState = {
  node: true,
  way: true,
  relation: false,
};

function App() {
  const classes = useStyles();
  const [augmentedDiff, setAugmentedDiff] = useState<AugmentedDiff>({
    created: [],
    modified: [],
    deleted: [],
  });
  const [selectedActions, setSelectedActions] = useState<ActionSelectorState>(
    defaultActions
  );
  const [selectedObjects, setSelectedObjects] = useState<
    OsmObjectSelectorState
  >(defaultObjects);

  const isAugmentedDiffValid = !!(
    augmentedDiff.created.length ||
    augmentedDiff.deleted.length ||
    augmentedDiff.modified.length
  );

  const createdFeatures: Feature<
    Geometry,
    OsmObjectProperties
  >[] = selectedActions.create
    ? augmentedDiff.created
        .map((f) => f.new)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  const deletedFeatures: Feature<
    Geometry,
    OsmObjectProperties
  >[] = selectedActions.delete
    ? augmentedDiff.deleted
        .map((f) => f.old)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  // const modifiedFeatures: Feature<
  //   Geometry,
  //   OsmObjectProperties
  // >[] = selectedActions.modify
  //   ? augmentedDiff.modified
  //       .map((f) => f.new)
  //       .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
  //       .filter((f) => selectedObjects[f.properties.type])
  //   : [];

  // Why do we render twice?
  console.log("created", createdFeatures);
  console.log("deleted", deletedFeatures);

  const onSequenceChange = (sequenceId: string) => {
    getAugmentedDiff(sequenceId).then((newADiff) => setAugmentedDiff(newADiff));
  };

  const onActionChanged = (state: ActionSelectorState) =>
    setSelectedActions(state);

  const onOsmObjectChanged = (state: OsmObjectSelectorState) =>
    setSelectedObjects(state);

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
            <ActionSelector
              defaultState={defaultActions}
              onChange={onActionChanged}
            />
            <OsmObjectSelector
              defaultState={defaultObjects}
              onChange={onOsmObjectChanged}
            />
          </>
        )}
      </Box>
      <Map
        className={classes.mapBox}
        created={{ type: "FeatureCollection", features: createdFeatures }}
        deleted={{ type: "FeatureCollection", features: deletedFeatures }}
      />
    </Box>
  );
}

export default App;
