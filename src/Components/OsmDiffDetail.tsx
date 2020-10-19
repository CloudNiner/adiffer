import React from "react";

import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import { OsmObjectDiff } from "../osm";

interface OsmDetailTableProps {
  diff: OsmObjectDiff;
}

const OsmDetailTable: React.FC<OsmDetailTableProps> = ({ diff }) => {
  const tagKeys = new Set<string>();
  Object.keys(diff.old?.properties.tags || {}).forEach((k, _) => tagKeys.add(k));
  Object.keys(diff.new?.properties.tags || {}).forEach((k, _) => tagKeys.add(k));
  return (
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell>timestamp</TableCell>
          <TableCell>{diff.old?.properties.meta.timestamp || ""}</TableCell>
          <TableCell>{diff.new?.properties.meta.timestamp || ""}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>uid</TableCell>
          <TableCell>{diff.old?.properties.meta.uid || ""}</TableCell>
          <TableCell>{diff.new?.properties.meta.uid || ""}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>user</TableCell>
          <TableCell>{diff.old?.properties.meta.user || ""}</TableCell>
          <TableCell>{diff.new?.properties.meta.user || ""}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>version</TableCell>
          <TableCell>{diff.old?.properties.meta.version?.toString() || ""}</TableCell>
          <TableCell>{diff.new?.properties.meta.version?.toString() || ""}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>changeset</TableCell>
          <TableCell>{diff.old?.properties.meta.changeset || ""}</TableCell>
          <TableCell>{diff.new?.properties.meta.changeset || ""}</TableCell>
        </TableRow>
        {Array.from(tagKeys.values()).map((tagKey) => {
          // TODO: Figure out how to type this properly (any is a band aid)
          // https://stackoverflow.com/a/57088282 didn't solve
          const oldTags: any = diff.old?.properties.tags || {};
          const newTags: any = diff.new?.properties.tags || {};
          return (
            <TableRow>
              <TableCell>{tagKey}</TableCell>
              <TableCell>{oldTags[tagKey] || ""}</TableCell>
              <TableCell>{newTags[tagKey] || ""}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

interface OsmDiffDetailProps {
  className?: string;
  diff: OsmObjectDiff;
}

const OsmDiffDetail: React.FC<OsmDiffDetailProps> = ({ className, diff }) => {
  const featureId = diff.new?.id || diff.old?.id || "";
  return (
    <Box className={className}>
      <Typography variant="h6">
        {diff.action}:{featureId}
      </Typography>
      <OsmDetailTable diff={diff} />
    </Box>
  );
};

export default OsmDiffDetail;
