import React from "react";

import { FeatureCollection, Geometry } from "geojson";
import { FillPaint, LinePaint, CirclePaint } from 'mapbox-gl';
import ReactMapboxGl, { Layer, Source } from "react-mapbox-gl";

import { OsmObjectProperties } from "../../osm";

type MapProps = {
  className?: string;
  oldObjects: FeatureCollection<Geometry, OsmObjectProperties>;
  newObjects: FeatureCollection<Geometry, OsmObjectProperties>;
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
}
const newColor = "#00FF00";

const newLayerFillPaint = fillPaint({"fill-color": newColor});

const newLayerLinePaint = linePaint({"line-color": newColor});

const newLayerCirclePaint = circlePaint({"circle-color": newColor, "circle-stroke-color": newColor});

const oldColor = "#FF0000";

const oldLayerFillPaint = fillPaint({"fill-color": oldColor});

const oldLayerLinePaint = linePaint({"line-color": oldColor});

const oldLayerCirclePaint = circlePaint({"circle-color": oldColor, "circle-stroke-color": oldColor});

const AugmentedDiffMap: React.FC<MapProps> = ({ className, newObjects, oldObjects }) => {
  const newSource = {
    type: "geojson",
    data: newObjects,
  };

  const oldSource = {
    type: "geojson",
    data: oldObjects,
  };

  return (
    <Map
      center={[0, 0]}
      className={className}
      style={"https://api.maptiler.com/maps/streets/style.json?key=JFXtmA3oBSUWi4wQGXSN"}
      zoom={[2]}
    >
      <Source id="oldObjects" geoJsonSource={oldSource}></Source>
      <Layer id="oldObjectsFill" sourceId="oldObjects" type="fill" paint={oldLayerFillPaint} />
      <Layer id="oldObjectsLine" sourceId="oldObjects" type="line" paint={oldLayerLinePaint} />
      <Layer
        id="oldObjectsCircle"
        sourceId="oldObjects"
        type="circle"
        paint={oldLayerCirclePaint}
      />
      <Source id="newObjects" geoJsonSource={newSource}></Source>
      <Layer id="newObjectsFill" sourceId="newObjects" type="fill" paint={newLayerFillPaint} />
      <Layer id="newObjectsLine" sourceId="newObjects" type="line" paint={newLayerLinePaint} />
      <Layer
        id="newObjectsCircle"
        sourceId="newObjects"
        type="circle"
        paint={newLayerCirclePaint}
      />
    </Map>
  );
};

export default AugmentedDiffMap;
