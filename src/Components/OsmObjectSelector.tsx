import React, { useState } from "react";

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@material-ui/core";

import { OsmObject } from "../osm";

type OsmObjectSelectorProps = {
  className?: string;
  defaultState: OsmObjectSelectorState;
  onChange: (state: OsmObjectSelectorState) => void;
};

export type OsmObjectSelectorState = {
  [OsmObject.Node]: boolean;
  [OsmObject.Way]: boolean;
  [OsmObject.Relation]: boolean;
};

const ActionSelector: React.FC<OsmObjectSelectorProps> = ({
  className,
  defaultState,
  onChange,
}) => {
  const [state, setState] = useState<OsmObjectSelectorState>(defaultState);
  const { node, way, relation } = state;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = { ...state, [event.target.name]: event.target.checked };
    setState(newState);
    onChange(newState);
  };
  return (
    <Box className={className}>
      <FormControl component="fieldset">
        <FormLabel component="legend">OSM Object Type</FormLabel>
        <FormGroup aria-label="osm action type" row>
          <FormControlLabel
            label="Nodes"
            control={
              <Checkbox
                checked={node}
                onChange={handleChange}
                name={OsmObject.Node}
              />
            }
          />
          <FormControlLabel
            label="Ways"
            control={
              <Checkbox
                checked={way}
                onChange={handleChange}
                name={OsmObject.Way}
              />
            }
          />
          <FormControlLabel
            label="Relations"
            control={
              <Checkbox
                checked={relation}
                onChange={handleChange}
                name={OsmObject.Relation}
              />
            }
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default ActionSelector;
