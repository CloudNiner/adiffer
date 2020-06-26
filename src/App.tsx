import React, { useState } from "react";

import { Feature, Geometry } from "geojson";
import { Box, Button, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  getAugmentedDiff,
  isSequenceValid,
  OsmObjectProperties,
  AugmentedDiff,
} from "./osm";
import ADifferLegend from "./Components/ADifferLegend";
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
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  goButton: {
    marginTop: theme.spacing(1),
  },
  legendBox: {
    position: "absolute",
    bottom: theme.spacing(4),
    right: theme.spacing(2),
    minWidth: theme.spacing(6),
    backgroundColor: theme.palette.background.default,
    padding: 0,
  },
  mapBox: {
    flex: 1,
  },
  sidebarBox: {
    flex: "0 0 24em",
    display: "flex",
    flexDirection: "column",
  },
  windowBox: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    flex: 1,

    "@media (min-width: 768px)": {
      flexDirection: "row",
    },
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
  const [sequenceId, setSequenceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        .map((diff) => diff.new)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  const deletedFeatures: Feature<
    Geometry,
    OsmObjectProperties
  >[] = selectedActions.delete
    ? augmentedDiff.deleted
        .map((diff) => diff.old)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  const oldModifiedFeatures: Feature<
    Geometry,
    OsmObjectProperties
  >[] = selectedActions.modify
    ? augmentedDiff.modified
        .filter((diff) => diff.isGeometryChanged)
        .map((diff) => diff.old)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  const newModifiedFeatures: Feature<
    Geometry,
    OsmObjectProperties
  >[] = selectedActions.modify
    ? augmentedDiff.modified
        .filter((diff) => diff.isGeometryChanged)
        .map((diff) => diff.new)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  const tagsModifiedFeatures: Feature<
    Geometry,
    OsmObjectProperties
  >[] = selectedActions.modify
    ? augmentedDiff.modified
        .filter((diff) => !diff.isGeometryChanged)
        .map((diff) => diff.new)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  // Why do we render twice?
  if (process.env.NODE_ENV === "development") {
    console.log("created", createdFeatures);
    console.log("deleted", deletedFeatures);
    console.log("new modified", newModifiedFeatures);
    console.log("old modified", oldModifiedFeatures);
  }

  const goButtonClicked = () => {
    setIsLoading(true);
    setAugmentedDiff({ created: [], modified: [], deleted: [] });
    getAugmentedDiff(sequenceId)
      .then((newADiff) => setAugmentedDiff(newADiff))
      .finally(() => setIsLoading(false));
  };

  const onActionChanged = (state: ActionSelectorState) =>
    setSelectedActions(state);

  const onOsmObjectChanged = (state: OsmObjectSelectorState) =>
    setSelectedObjects(state);

  return (
    <Box className={classes.windowBox}>
      <Box mx={2} className={classes.sidebarBox}>
        <Header />
        <SequenceSelector onChange={setSequenceId} />
        <Button
          className={classes.goButton}
          color="primary"
          disabled={!isSequenceValid(sequenceId) || isLoading}
          disableElevation
          onClick={goButtonClicked}
          variant="contained"
        >
          {isLoading ? "Loading..." : "Go"}
        </Button>
        {isAugmentedDiffValid && (
          <>
            <Divider className={classes.divider} />
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
        modifiedNew={{
          type: "FeatureCollection",
          features: newModifiedFeatures,
        }}
        modifiedOld={{
          type: "FeatureCollection",
          features: oldModifiedFeatures,
        }}
        modifiedTags={{
          type: "FeatureCollection",
          features: tagsModifiedFeatures,
        }}
      />
      <Box className={classes.legendBox}>
        <ADifferLegend />
      </Box>
    </Box>
  );
}

export default App;
