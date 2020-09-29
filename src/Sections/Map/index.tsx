import React, { useState } from "react";

import { FeatureCollection, Geometry } from "geojson";
import { FillPaint, LinePaint, CirclePaint } from "mapbox-gl";
import ReactMapboxGl, { Layer, Source } from "react-mapbox-gl";

import { OsmObjectProperties } from "../../osm";
import config from "../../config";
import theme from "../../theme";

type MapProps = {
  className?: string;
  created: FeatureCollection<Geometry, OsmObjectProperties>;
  deleted: FeatureCollection<Geometry, OsmObjectProperties>;
  modifiedNew: FeatureCollection<Geometry, OsmObjectProperties>;
  modifiedOld: FeatureCollection<Geometry, OsmObjectProperties>;
  modifiedTags: FeatureCollection<Geometry, OsmObjectProperties>;
};

if (!config.mapboxApiKey) {
  throw new Error("REACT_APP_MAPBOX_API_KEY required!");
}

const Map = ReactMapboxGl({ accessToken: config.mapboxApiKey });

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
  const defaults: FillPaint = { "fill-color": "#FFFFFF", "fill-opacity": 0.4 };
  return Object.assign({}, defaults, overrides);
};

const linePaint = (overrides: LinePaint) => {
  const defaults: LinePaint = { "line-color": "#FFFFFF", "line-width": 2 };
  return Object.assign({}, defaults, overrides);
};
const createdColor = theme.palette.osm.created;

const createdLayerFillPaint = fillPaint({ "fill-color": createdColor });

const createdLayerLinePaint = linePaint({ "line-color": createdColor });

const createdLayerCirclePaint = circlePaint({
  "circle-color": createdColor,
  "circle-stroke-color": createdColor,
});

const deletedColor = theme.palette.osm.deleted;

const deletedLayerFillPaint = fillPaint({ "fill-color": deletedColor });

const deletedLayerLinePaint = linePaint({ "line-color": deletedColor });

const deletedLayerCirclePaint = circlePaint({
  "circle-color": deletedColor,
  "circle-stroke-color": deletedColor,
});

const modifiedOldColor = theme.palette.osm.modifiedOld;

const modifiedOldLayerFillPaint = fillPaint({ "fill-color": modifiedOldColor });

const modifiedOldLayerLinePaint = linePaint({ "line-color": modifiedOldColor });

const modifiedOldLayerCirclePaint = circlePaint({
  "circle-color": modifiedOldColor,
  "circle-stroke-color": modifiedOldColor,
});

const modifiedNewColor = theme.palette.osm.modifiedNew;

const modifiedNewLayerFillPaint = fillPaint({ "fill-color": modifiedNewColor });

const modifiedNewLayerLinePaint = linePaint({ "line-color": modifiedNewColor });

const modifiedNewLayerCirclePaint = circlePaint({
  "circle-color": modifiedNewColor,
  "circle-stroke-color": modifiedNewColor,
});

const modifiedTagsColor = theme.palette.osm.modifiedTags;

const modifiedTagsLayerFillPaint = fillPaint({
  "fill-color": modifiedTagsColor,
});

const modifiedTagsLayerLinePaint = linePaint({
  "line-color": modifiedTagsColor,
});

const modifiedTagsLayerCirclePaint = circlePaint({
  "circle-color": modifiedTagsColor,
  "circle-stroke-color": modifiedTagsColor,
});

const filterIsLine = [
  "match",
  ["geometry-type"],
  ["LineString", "MultiLineString"],
  true,
  false,
];

const filterIsPolygon = [
  "match",
  ["geometry-type"],
  ["Polygon", "MultiPolygon"],
  true,
  false,
];

const filterIsPoint = ["==", ["geometry-type"], "Point"];

const AugmentedDiffMap: React.FC<MapProps> = ({
  className,
  created,
  deleted,
  modifiedNew,
  modifiedOld,
  modifiedTags,
}) => {
  const [center] = useState<[number, number]>([0, 0]);
  const [zoom] = useState<[number]>([2]);
  const createdSource = {
    type: "geojson",
    data: created,
  };

  const deletedSource = {
    type: "geojson",
    data: deleted,
  };

  const modifiedNewSource = {
    type: "geojson",
    data: modifiedNew,
  };

  const modifiedOldSource = {
    type: "geojson",
    data: modifiedOld,
  };

  const modifiedTagsSource = {
    type: "geojson",
    data: modifiedTags,
  };

  const styleUrl = `mapbox://styles/afinkmiller/ckfocvsq902ks19p61zj04g17`;

  return (
    <Map  center={center} className={className} style={styleUrl} zoom={zoom}>
      <Source id="deletedObjects" geoJsonSource={deletedSource} />
      <Layer
        id="deletedObjectsFill"
        sourceId="deletedObjects"
        type="fill"
        paint={deletedLayerFillPaint}
        filter={filterIsPolygon}
      />
      <Layer
        id="deletedObjectsLine"
        sourceId="deletedObjects"
        type="line"
        paint={deletedLayerLinePaint}
        filter={filterIsLine}
      />
      <Layer
        id="deletedObjectsCircle"
        sourceId="deletedObjects"
        type="circle"
        paint={deletedLayerCirclePaint}
        filter={filterIsPoint}
      />
      <Source id="createdObjects" geoJsonSource={createdSource} />
      <Layer
        id="createdObjectsFill"
        sourceId="createdObjects"
        type="fill"
        paint={createdLayerFillPaint}
        filter={filterIsPolygon}
      />
      <Layer
        id="createdObjectsLine"
        sourceId="createdObjects"
        type="line"
        paint={createdLayerLinePaint}
        filter={filterIsLine}
      />
      <Layer
        id="createdObjectsCircle"
        sourceId="createdObjects"
        type="circle"
        paint={createdLayerCirclePaint}
        filter={filterIsPoint}
      />
      <Source id="modifiedOldObjects" geoJsonSource={modifiedOldSource} />
      <Layer
        id="modifiedOldObjectsFill"
        sourceId="modifiedOldObjects"
        type="fill"
        paint={modifiedOldLayerFillPaint}
        filter={filterIsPolygon}
      />
      <Layer
        id="modifiedOldObjectsLine"
        sourceId="modifiedOldObjects"
        type="line"
        paint={modifiedOldLayerLinePaint}
        filter={filterIsLine}
      />
      <Layer
        id="modifiedOldObjectsCircle"
        sourceId="modifiedOldObjects"
        type="circle"
        paint={modifiedOldLayerCirclePaint}
        filter={filterIsPoint}
      />
      <Source id="modifiedNewObjects" geoJsonSource={modifiedNewSource} />
      <Layer
        id="modifiedNewObjectsFill"
        sourceId="modifiedNewObjects"
        type="fill"
        paint={modifiedNewLayerFillPaint}
        filter={filterIsPolygon}
      />
      <Layer
        id="modifiedNewObjectsLine"
        sourceId="modifiedNewObjects"
        type="line"
        paint={modifiedNewLayerLinePaint}
        filter={filterIsLine}
      />
      <Layer
        id="modifiedNewObjectsCircle"
        sourceId="modifiedNewObjects"
        type="circle"
        paint={modifiedNewLayerCirclePaint}
        filter={filterIsPoint}
      />
      <Source id="modifiedTagsObjects" geoJsonSource={modifiedTagsSource} />
      <Layer
        id="modifiedTagsObjectsFill"
        sourceId="modifiedTagsObjects"
        type="fill"
        paint={modifiedTagsLayerFillPaint}
        filter={filterIsPolygon}
      />
      <Layer
        id="modifiedTagsObjectsLine"
        sourceId="modifiedTagsObjects"
        type="line"
        paint={modifiedTagsLayerLinePaint}
        filter={filterIsLine}
      />
      <Layer
        id="modifiedTagsObjectsCircle"
        sourceId="modifiedTagsObjects"
        type="circle"
        paint={modifiedTagsLayerCirclePaint}
        filter={filterIsPoint}
      />
    </Map>
  );
};

export default AugmentedDiffMap;
