import React from "react";

import { OsmObjectDiff } from "../osm";

interface OsmDiffDetailProps {
  className?: string;
  diff: OsmObjectDiff;
}

const OsmDiffDetail: React.FC<OsmDiffDetailProps> = ({ className, diff }) => {
  const featureId = diff.new?.id || diff.old?.id || "";
  return (
    <div className={className}>
      <h2>
        OSM OBJECT {diff.action}:{featureId}
      </h2>
    </div>
  );
};

export default OsmDiffDetail;
