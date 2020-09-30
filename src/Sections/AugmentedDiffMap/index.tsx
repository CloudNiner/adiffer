import React, { useState } from "react";

import { Feature, Geometry } from "geojson";
import ReactMapboxGl, { Layer, Source } from "react-mapbox-gl";

import { AugmentedDiff, OsmObjectProperties } from "../../osm";
import config from "../../config";
import * as filters from "./filters";
import * as styles from "./styles";

type MapProps = {
  augmentedDiff: AugmentedDiff;
  className?: string;
  showActionCreate: boolean;
  showActionDelete: boolean;
  showActionModify: boolean;
  showNodes: boolean;
  showRelations: boolean;
  showWays: boolean;
};

if (!config.mapboxApiKey) {
  throw new Error("REACT_APP_MAPBOX_API_KEY required!");
}

const Map = ReactMapboxGl({ accessToken: config.mapboxApiKey });

const AugmentedDiffMap: React.FC<MapProps> = ({
  augmentedDiff,
  className,
  showActionCreate,
  showActionDelete,
  showActionModify,
  showNodes,
  showRelations,
  showWays,
}) => {
  const [center] = useState<[number, number]>([0, 0]);
  const [zoom] = useState<[number]>([2]);

  const selectedObjects = {
    node: showNodes,
    relation: showRelations,
    way: showWays,
  };

  const created: Feature<Geometry, OsmObjectProperties>[] = showActionCreate
    ? augmentedDiff.created
        .map((diff) => diff.new)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  const deleted: Feature<Geometry, OsmObjectProperties>[] = showActionDelete
    ? augmentedDiff.deleted
        .map((diff) => diff.old)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  const modifiedOld: Feature<Geometry, OsmObjectProperties>[] = showActionModify
    ? augmentedDiff.modified
        .filter((diff) => diff.isGeometryChanged)
        .map((diff) => diff.old)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  const modifiedNew: Feature<Geometry, OsmObjectProperties>[] = showActionModify
    ? augmentedDiff.modified
        .filter((diff) => diff.isGeometryChanged)
        .map((diff) => diff.new)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  const modifiedTags: Feature<
    Geometry,
    OsmObjectProperties
  >[] = showActionModify
    ? augmentedDiff.modified
        .filter((diff) => !diff.isGeometryChanged)
        .map((diff) => diff.new)
        .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
        .filter((f) => selectedObjects[f.properties.type])
    : [];

  // Why do we render twice?
  if (process.env.NODE_ENV === "development") {
    console.log("created", created);
    console.log("deleted", deleted);
    console.log("new modified", modifiedNew);
    console.log("old modified", modifiedOld);
  }

  const createdSource = {
    type: "geojson",
    data: { type: "FeatureCollection", features: created },
  };

  const deletedSource = {
    type: "geojson",
    data: { type: "FeatureCollection", features: deleted },
  };

  const modifiedNewSource = {
    type: "geojson",
    data: { type: "FeatureCollection", features: modifiedNew },
  };

  const modifiedOldSource = {
    type: "geojson",
    data: { type: "FeatureCollection", features: modifiedOld },
  };

  const modifiedTagsSource = {
    type: "geojson",
    data: { type: "FeatureCollection", features: modifiedTags },
  };

  const styleUrl = `mapbox://styles/afinkmiller/ckfocvsq902ks19p61zj04g17`;

  return (
    <Map center={center} className={className} style={styleUrl} zoom={zoom}>
      <Source id="deletedObjects" geoJsonSource={deletedSource} />
      <Layer
        id="deletedObjectsFill"
        sourceId="deletedObjects"
        type="fill"
        paint={styles.deletedLayerFillPaint}
        filter={filters.isPolygon}
      />
      <Layer
        id="deletedObjectsLine"
        sourceId="deletedObjects"
        type="line"
        paint={styles.deletedLayerLinePaint}
        filter={filters.isLine}
      />
      <Layer
        id="deletedObjectsCircle"
        sourceId="deletedObjects"
        type="circle"
        paint={styles.deletedLayerCirclePaint}
        filter={filters.isPoint}
      />
      <Source id="createdObjects" geoJsonSource={createdSource} />
      <Layer
        id="createdObjectsFill"
        sourceId="createdObjects"
        type="fill"
        paint={styles.createdLayerFillPaint}
        filter={filters.isPolygon}
      />
      <Layer
        id="createdObjectsLine"
        sourceId="createdObjects"
        type="line"
        paint={styles.createdLayerLinePaint}
        filter={filters.isLine}
      />
      <Layer
        id="createdObjectsCircle"
        sourceId="createdObjects"
        type="circle"
        paint={styles.createdLayerCirclePaint}
        filter={filters.isPoint}
      />
      <Source id="modifiedOldObjects" geoJsonSource={modifiedOldSource} />
      <Layer
        id="modifiedOldObjectsFill"
        sourceId="modifiedOldObjects"
        type="fill"
        paint={styles.modifiedOldLayerFillPaint}
        filter={filters.isPolygon}
      />
      <Layer
        id="modifiedOldObjectsLine"
        sourceId="modifiedOldObjects"
        type="line"
        paint={styles.modifiedOldLayerLinePaint}
        filter={filters.isLine}
      />
      <Layer
        id="modifiedOldObjectsCircle"
        sourceId="modifiedOldObjects"
        type="circle"
        paint={styles.modifiedOldLayerCirclePaint}
        filter={filters.isPoint}
      />
      <Source id="modifiedNewObjects" geoJsonSource={modifiedNewSource} />
      <Layer
        id="modifiedNewObjectsFill"
        sourceId="modifiedNewObjects"
        type="fill"
        paint={styles.modifiedNewLayerFillPaint}
        filter={filters.isPolygon}
      />
      <Layer
        id="modifiedNewObjectsLine"
        sourceId="modifiedNewObjects"
        type="line"
        paint={styles.modifiedNewLayerLinePaint}
        filter={filters.isLine}
      />
      <Layer
        id="modifiedNewObjectsCircle"
        sourceId="modifiedNewObjects"
        type="circle"
        paint={styles.modifiedNewLayerCirclePaint}
        filter={filters.isPoint}
      />
      <Source id="modifiedTagsObjects" geoJsonSource={modifiedTagsSource} />
      <Layer
        id="modifiedTagsObjectsFill"
        sourceId="modifiedTagsObjects"
        type="fill"
        paint={styles.modifiedTagsLayerFillPaint}
        filter={filters.isPolygon}
      />
      <Layer
        id="modifiedTagsObjectsLine"
        sourceId="modifiedTagsObjects"
        type="line"
        paint={styles.modifiedTagsLayerLinePaint}
        filter={filters.isLine}
      />
      <Layer
        id="modifiedTagsObjectsCircle"
        sourceId="modifiedTagsObjects"
        type="circle"
        paint={styles.modifiedTagsLayerCirclePaint}
        filter={filters.isPoint}
      />
    </Map>
  );
};

export default AugmentedDiffMap;
