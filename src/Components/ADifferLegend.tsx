import React from "react";

import { List, ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StopIcon from "@material-ui/icons/Stop";

import theme from "../theme";

const useStyles = makeStyles((theme) => ({
  listItemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

interface LegendItemProps {
  color: string;
  text: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, text }) => {
  const classes = useStyles();
  return (
    <ListItem className={classes.listItemRoot}>
      <StopIcon htmlColor={color} />
      <ListItemText primary={text}></ListItemText>
    </ListItem>
  );
};

const legendItems: LegendItemProps[] = [
  {
    color: theme.palette.osm.created,
    text: "created",
  },
  {
    color: theme.palette.osm.deleted,
    text: "deleted",
  },
  {
    color: theme.palette.osm.modifiedTags,
    text: "modified, tags only",
  },
  {
    color: theme.palette.osm.modifiedNew,
    text: "modified, new geometry",
  },
  {
    color: theme.palette.osm.modifiedOld,
    text: "modified, old geometry",
  },
];

const ADifferLegend: React.FC = () => {
  const items = legendItems.map((props) => <LegendItem {...props} />);
  return (
    <List dense={true} disablePadding={true}>
      {items}
    </List>
  );
};

export default ADifferLegend;
