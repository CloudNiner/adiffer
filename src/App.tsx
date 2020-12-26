import React, { useState } from "react";

import { Box, Button, ButtonGroup, Divider, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DropzoneArea } from "material-ui-dropzone";

import { getAugmentedDiff, isSequenceValid, parseDiff, AugmentedDiff, OsmObjectDiff } from "./osm";
import ADifferLegend from "./Components/ADifferLegend";
import ActionSelector, { ActionSelectorState } from "./Components/ActionSelector";
import Header from "./Components/Header";
import SequenceSelector from "./Components/SequenceSelector";
import AugmentedDiffMap from "./Sections/AugmentedDiffMap";
import OsmObjectSelector, { OsmObjectSelectorState } from "./Components/OsmObjectSelector";
import OsmDiffDetail from "./Components/OsmDiffDetail";

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
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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
  const [selectedActions, setSelectedActions] = useState<ActionSelectorState>(defaultActions);
  const [selectedObjects, setSelectedObjects] = useState<OsmObjectSelectorState>(defaultObjects);
  const [sequenceId, setSequenceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDiff, setSelectedDiff] = useState<OsmObjectDiff | undefined>(undefined);

  const isAugmentedDiffValid = !!(
    augmentedDiff.created.length ||
    augmentedDiff.deleted.length ||
    augmentedDiff.modified.length
  );

  const [inputMethod, setInputMethod] = useState<"overpass" | "file">("overpass");

  const handleModalClose = () => setSelectedDiff(undefined);

  const goButtonClicked = () => {
    setIsLoading(true);
    setAugmentedDiff({ created: [], modified: [], deleted: [] });
    getAugmentedDiff(sequenceId)
      .then((newADiff) => setAugmentedDiff(newADiff))
      .finally(() => setIsLoading(false));
  };

  const onActionChanged = (state: ActionSelectorState) => setSelectedActions(state);

  const onDropzoneFilesChange = (files: File[]) => {
    if (files.length) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event?.target?.result && typeof event.target.result === "string") {
          setAugmentedDiff(parseDiff(event.target.result as string));
        } else {
          console.error("Unable to read uploaded file as xml string!", event);
        }
      };
      reader.readAsText(files[0], "UTF-8");
    } else {
      setAugmentedDiff({ created: [], deleted: [], modified: [] });
    }
  };

  const onMapFeatureClick = (diff: OsmObjectDiff) => {
    console.log(diff);
    setSelectedDiff(diff);
  };

  const onOsmObjectChanged = (state: OsmObjectSelectorState) => setSelectedObjects(state);

  return (
    <Box className={classes.windowBox}>
      <Box mx={2} className={classes.sidebarBox}>
        <Header />
        <Box mb={2} display="flex" justifyContent="center">
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button
              variant={inputMethod === "overpass" ? "contained" : "outlined"}
              onClick={() => setInputMethod("overpass")}
            >
              Overpass
            </Button>
            <Button
              variant={inputMethod === "file" ? "contained" : "outlined"}
              onClick={() => setInputMethod("file")}
            >
              Upload
            </Button>
          </ButtonGroup>
        </Box>
        {inputMethod === "overpass" && (
          <>
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
          </>
        )}
        {inputMethod === "file" && (
          <DropzoneArea
            acceptedFiles={[".xml", "text/xml", "text/plain"]}
            filesLimit={1}
            maxFileSize={25 * 1024 * 1024}
            onChange={onDropzoneFilesChange}
            showFileNames={true}
          />
        )}
        {isAugmentedDiffValid && (
          <>
            <Divider className={classes.divider} />
            <ActionSelector defaultState={defaultActions} onChange={onActionChanged} />
            <OsmObjectSelector defaultState={defaultObjects} onChange={onOsmObjectChanged} />
          </>
        )}
      </Box>
      <AugmentedDiffMap
        augmentedDiff={augmentedDiff}
        className={classes.mapBox}
        onFeatureClick={onMapFeatureClick}
        showActionCreate={selectedActions.create}
        showActionDelete={selectedActions.delete}
        showActionModify={selectedActions.modify}
        showNodes={selectedObjects.node}
        showRelations={selectedObjects.relation}
        showWays={selectedObjects.way}
      />
      <Box className={classes.legendBox}>
        <ADifferLegend />
      </Box>
      <Modal
        open={selectedDiff !== undefined}
        onClose={handleModalClose}
        aria-labelledby="osm-feature-modal-title"
        aria-describedby="osm-feature-modal-description"
      >
        <div className={classes.modal}>
          {selectedDiff !== undefined ? <OsmDiffDetail diff={selectedDiff} /> : <></>}
        </div>
      </Modal>
    </Box>
  );
}

export default App;
