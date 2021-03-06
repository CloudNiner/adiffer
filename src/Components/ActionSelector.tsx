import React, { useState } from "react";

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@material-ui/core";

import { ADiffAction } from "../osm";

type ActionSelectorProps = {
  className?: string;
  defaultState: ActionSelectorState;
  onChange: (state: ActionSelectorState) => void;
};

export type ActionSelectorState = {
  [ADiffAction.Create]: boolean;
  [ADiffAction.Modify]: boolean;
  [ADiffAction.Delete]: boolean;
};

const ActionSelector: React.FC<ActionSelectorProps> = ({
  className,
  defaultState,
  onChange,
}) => {
  const [state, setState] = useState<ActionSelectorState>(defaultState);
  const { create, modify, delete: deleted } = state;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = { ...state, [event.target.name]: event.target.checked };
    setState(newState);
    onChange(newState);
  };
  return (
    <Box className={className}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Action Type</FormLabel>
        <FormGroup aria-label="osm action type" row>
          <FormControlLabel
            label="Create"
            control={
              <Checkbox
                checked={create}
                onChange={handleChange}
                name={ADiffAction.Create}
              />
            }
          />
          <FormControlLabel
            label="Modify"
            control={
              <Checkbox
                checked={modify}
                onChange={handleChange}
                name={ADiffAction.Modify}
              />
            }
          />
          <FormControlLabel
            label="Delete"
            control={
              <Checkbox
                checked={deleted}
                onChange={handleChange}
                name={ADiffAction.Delete}
              />
            }
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default ActionSelector;
