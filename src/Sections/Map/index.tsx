import React from "react";

import { FeatureCollection, Geometry } from "geojson";
import { FillPaint, LinePaint, CirclePaint } from "mapbox-gl";
import ReactMapboxGl, { Layer, Source } from "react-mapbox-gl";

import { OsmObjectProperties } from "../../osm";
import config from "../../config";

type MapProps = {
  className?: string;
  created: FeatureCollection<Geometry, OsmObjectProperties>;
  deleted: FeatureCollection<Geometry, OsmObjectProperties>;
};

const Map = ReactMapboxGl({ accessToken: "" });

const circlePaint = (overrides: CirclePaint) => {
  const defaults: CirclePaint = {
    "circle-color": "#FFFFFF",
    "circle-opacity": 0.2,
    "circle-radius": 4,
    "circle-stroke-color": "#FFFFFF",
    "circle-stroke-width": 1,
  };
  return Object.assign({}, defaults, overrides);
};

const fillPaint = (overrides: FillPaint) => {
  const defaults: FillPaint = { "fill-color": "#FFFFFF", "fill-opacity": 0.5 };
  return Object.assign({}, defaults, overrides);
};

const linePaint = (overrides: LinePaint) => {
  const defaults: LinePaint = { "line-color": "#FFFFFF", "line-width": 2 };
  return Object.assign({}, defaults, overrides);
};
const createdColor = "#00FF00";

const createdLayerFillPaint = fillPaint({ "fill-color": createdColor });

const createdLayerLinePaint = linePaint({ "line-color": createdColor });

const createdLayerCirclePaint = circlePaint({
  "circle-color": createdColor,
  "circle-stroke-color": createdColor,
});

const deletedColor = "#FF0000";

const deletedLayerFillPaint = fillPaint({ "fill-color": deletedColor });

const deletedLayerLinePaint = linePaint({ "line-color": deletedColor });

const deletedLayerCirclePaint = circlePaint({
  "circle-color": deletedColor,
  "circle-stroke-color": deletedColor,
});

const AugmentedDiffMap: React.FC<MapProps> = ({
  className,
  created,
  deleted,
}) => {
  const createdSource = {
    type: "geojson",
    data: created,
  };

  const deletedSource = {
    type: "geojson",
    data: deleted,
  };

  if (!config.maptilerApiKey) {
    throw new Error("REACT_APP_MAPTILER_API_KEY required!");
  }
  const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${config.maptilerApiKey}`;

  return (
    <Map center={[0, 0]} className={className} style={styleUrl} zoom={[2]}>
      <Source id="deletedObjects" geoJsonSource={deletedSource}></Source>
      <Layer
        id="deletedObjectsFill"
        sourceId="deletedObjects"
        type="fill"
        paint={deletedLayerFillPaint}
        filter={["==", "$type", "Polygon"]}
      />
      <Layer
        id="deletedObjectsLine"
        sourceId="deletedObjects"
        type="line"
        paint={deletedLayerLinePaint}
        filter={["==", "$type", "LineString"]}
      />
      <Layer
        id="deletedObjectsCircle"
        sourceId="deletedObjects"
        type="circle"
        paint={deletedLayerCirclePaint}
        filter={["==", "$type", "Point"]}
      />
      <Source id="createdObjects" geoJsonSource={createdSource}></Source>
      <Layer
        id="createdObjectsFill"
        sourceId="createdObjects"
        type="fill"
        paint={createdLayerFillPaint}
        filter={["==", "$type", "Polygon"]}
      />
      <Layer
        id="createdObjectsLine"
        sourceId="createdObjects"
        type="line"
        paint={createdLayerLinePaint}
        filter={["==", "$type", "LineString"]}
      />
      <Layer
        id="createdObjectsCircle"
        sourceId="createdObjects"
        type="circle"
        paint={createdLayerCirclePaint}
        filter={["==", "$type", "Point"]}
      />
    </Map>
  );
};

export default AugmentedDiffMap;
