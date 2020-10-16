import React from "react";

import { Feature, Geometry } from "geojson";
import mapboxgl, { GeoJSONSource, MapLayerMouseEvent } from "mapbox-gl";

import config from "../../config";
import { AugmentedDiff, OsmObjectProperties } from "../../osm";
import * as filters from "./filters";
import * as styles from "./styles";

export type MapProps = {
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
mapboxgl.accessToken = config.mapboxApiKey;

interface HoveredFeature {
  source: string;
  id: number | string;
}

class AugmentedDiffMap extends React.Component<MapProps> {
  private mapRef = React.createRef<HTMLDivElement>();

  private map: mapboxgl.Map | undefined;

  private hoveredFeatures: HoveredFeature[] = [];

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapRef.current!,
      style: "mapbox://styles/mapbox/dark-v10??optimize=true",
      center: [0, 0],
      zoom: 1,
    });
    this.map = map;
    map.on("load", () => {
      // Add sources for each subset of the Augmented Diff
      map.addSource("deletedObjects", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      map.addSource("modifiedOldObjects", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      map.addSource("modifiedNewObjects", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      map.addSource("modifiedTagsObjects", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      map.addSource("createdObjects", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });

      // Add layers in display order, bottom up. Render fill, then line, then points
      map.addLayer({
        id: "deletedObjectsFill",
        type: "fill",
        source: "deletedObjects",
        filter: filters.isPolygon,
        paint: styles.deletedLayerFillPaint,
      });
      map.on("mouseenter", "deletedObjectsFill", this.onMouseEnter);
      map.on("mouseleave", "deletedObjectsFill", this.onMouseLeave);
      map.on("mousemove", "deletedObjectsFill", this.onMouseMove);

      map.addLayer({
        id: "modifiedOldObjectsFill",
        type: "fill",
        source: "modifiedOldObjects",
        filter: filters.isPolygon,
        paint: styles.modifiedOldLayerFillPaint,
      });
      map.on("mouseenter", "modifiedOldObjectsFill", this.onMouseEnter);
      map.on("mouseleave", "modifiedOldObjectsFill", this.onMouseLeave);
      map.on("mousemove", "modifiedOldObjectsFill", this.onMouseMove);

      map.addLayer({
        id: "modifiedNewObjectsFill",
        type: "fill",
        source: "modifiedNewObjects",
        filter: filters.isPolygon,
        paint: styles.modifiedNewLayerFillPaint,
      });
      map.on("mouseenter", "modifiedNewObjectsFill", this.onMouseEnter);
      map.on("mouseleave", "modifiedNewObjectsFill", this.onMouseLeave);
      map.on("mousemove", "modifiedNewObjectsFill", this.onMouseMove);

      map.addLayer({
        id: "modifiedTagsObjectsFill",
        type: "fill",
        source: "modifiedTagsObjects",
        filter: filters.isPolygon,
        paint: styles.modifiedTagsLayerFillPaint,
      });
      map.on("mouseenter", "modifiedTagsObjectsFill", this.onMouseEnter);
      map.on("mouseleave", "modifiedTagsObjectsFill", this.onMouseLeave);
      map.on("mousemove", "modifiedTagsObjectsFill", this.onMouseMove);

      map.addLayer({
        id: "createdObjectsFill",
        type: "fill",
        source: "createdObjects",
        filter: filters.isPolygon,
        paint: styles.createdLayerFillPaint,
      });
      map.on("mouseenter", "createdObjectsFill", this.onMouseEnter);
      map.on("mouseleave", "createdObjectsFill", this.onMouseLeave);
      map.on("mousemove", "createdObjectsFill", this.onMouseMove);

      map.addLayer({
        id: "deletedObjectsLine",
        type: "line",
        source: "deletedObjects",
        filter: filters.isLine,
        paint: styles.deletedLayerLinePaint,
      });
      map.on("mouseenter", "deletedObjectsLine", this.onMouseEnter);
      map.on("mouseleave", "deletedObjectsLine", this.onMouseLeave);
      map.on("mousemove", "deletedObjectsLine", this.onMouseMove);

      map.addLayer({
        id: "modifiedOldObjectsLine",
        type: "line",
        source: "modifiedOldObjects",
        filter: filters.isLine,
        paint: styles.modifiedOldLayerLinePaint,
      });
      map.on("mouseenter", "modifiedOldObjectsLine", this.onMouseEnter);
      map.on("mouseleave", "modifiedOldObjectsLine", this.onMouseLeave);
      map.on("mousemove", "modifiedOldObjectsLine", this.onMouseMove);

      map.addLayer({
        id: "modifiedNewObjectsLine",
        type: "line",
        source: "modifiedNewObjects",
        filter: filters.isLine,
        paint: styles.modifiedNewLayerLinePaint,
      });
      map.on("mouseenter", "modifiedNewObjectsLine", this.onMouseEnter);
      map.on("mouseleave", "modifiedNewObjectsLine", this.onMouseLeave);
      map.on("mousemove", "modifiedNewObjectsLine", this.onMouseMove);

      map.addLayer({
        id: "modifiedTagsObjectsLine",
        type: "line",
        source: "modifiedTagsObjects",
        filter: filters.isLine,
        paint: styles.modifiedTagsLayerLinePaint,
      });
      map.on("mouseenter", "modifiedTagsObjectsLine", this.onMouseEnter);
      map.on("mouseleave", "modifiedTagsObjectsLine", this.onMouseLeave);
      map.on("mousemove", "modifiedTagsObjectsLine", this.onMouseMove);

      map.addLayer({
        id: "createdObjectsLine",
        type: "line",
        source: "createdObjects",
        filter: filters.isLine,
        paint: styles.createdLayerLinePaint,
      });
      map.on("mouseenter", "createdObjectsLine", this.onMouseEnter);
      map.on("mouseleave", "createdObjectsLine", this.onMouseLeave);
      map.on("mousemove", "createdObjectsLine", this.onMouseMove);

      map.addLayer({
        id: "deletedObjectsCircle",
        type: "circle",
        source: "deletedObjects",
        filter: filters.isPoint,
        paint: styles.deletedLayerCirclePaint,
      });
      map.on("mouseenter", "deletedObjectsCircle", this.onMouseEnter);
      map.on("mouseleave", "deletedObjectsCircle", this.onMouseLeave);
      map.on("mousemove", "deletedObjectsCircle", this.onMouseMove);

      map.addLayer({
        id: "modifiedOldObjectsCircle",
        type: "circle",
        source: "modifiedOldObjects",
        filter: filters.isPoint,
        paint: styles.modifiedOldLayerCirclePaint,
      });
      map.on("mouseenter", "modifiedOldObjectsCircle", this.onMouseEnter);
      map.on("mouseleave", "modifiedOldObjectsCircle", this.onMouseLeave);
      map.on("mousemove", "modifiedOldObjectsCircle", this.onMouseMove);

      map.addLayer({
        id: "modifiedNewObjectsCircle",
        type: "circle",
        source: "modifiedNewObjects",
        filter: filters.isPoint,
        paint: styles.modifiedNewLayerCirclePaint,
      });
      map.on("mouseenter", "modifiedNewObjectsCircle", this.onMouseEnter);
      map.on("mouseleave", "modifiedNewObjectsCircle", this.onMouseLeave);
      map.on("mousemove", "modifiedNewObjectsCircle", this.onMouseMove);

      map.addLayer({
        id: "modifiedTagsObjectsCircle",
        type: "circle",
        source: "modifiedTagsObjects",
        filter: filters.isPoint,
        paint: styles.modifiedTagsLayerCirclePaint,
      });
      map.on("mouseenter", "modifiedTagsObjectsCircle", this.onMouseEnter);
      map.on("mouseleave", "modifiedTagsObjectsCircle", this.onMouseLeave);
      map.on("mousemove", "modifiedTagsObjectsCircle", this.onMouseMove);

      map.addLayer({
        id: "createdObjectsCircle",
        type: "circle",
        source: "createdObjects",
        filter: filters.isPoint,
        paint: styles.createdLayerCirclePaint,
      });
      map.on("mouseenter", "createdObjectsCircle", this.onMouseEnter);
      map.on("mouseleave", "createdObjectsCircle", this.onMouseLeave);
      map.on("mousemove", "createdObjectsCircle", this.onMouseMove);
    });
  }

  componentDidUpdate(prevProps: MapProps) {
    const {
      augmentedDiff,
      showActionCreate,
      showActionDelete,
      showActionModify,
      showNodes,
      showWays,
      showRelations,
    } = this.props;

    if (
      this.map &&
      (augmentedDiff !== prevProps.augmentedDiff ||
        showActionCreate !== prevProps.showActionCreate ||
        showActionDelete !== prevProps.showActionDelete ||
        showActionModify !== prevProps.showActionModify ||
        showNodes !== prevProps.showNodes ||
        showWays !== prevProps.showWays ||
        showRelations !== prevProps.showRelations)
    ) {
      const selectedObjects = {
        node: showNodes,
        relation: showRelations,
        way: showWays,
      };

      const createdSource = this.map.getSource("createdObjects") as GeoJSONSource;
      if (createdSource) {
        const created: Feature<Geometry, OsmObjectProperties>[] = showActionCreate
          ? augmentedDiff.created
              .map((diff) => diff.new)
              .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
              .filter((f) => selectedObjects[f.properties.type])
          : [];
        createdSource.setData({
          type: "FeatureCollection",
          features: created,
        });
      }

      const deletedSource = this.map.getSource("deletedObjects") as GeoJSONSource;
      if (deletedSource) {
        const deleted: Feature<Geometry, OsmObjectProperties>[] = showActionDelete
          ? augmentedDiff.deleted
              .map((diff) => diff.old)
              .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
              .filter((f) => selectedObjects[f.properties.type])
          : [];
        deletedSource.setData({
          type: "FeatureCollection",
          features: deleted,
        });
      }

      const modifiedOldSource = this.map.getSource("modifiedOldObjects") as GeoJSONSource;
      if (modifiedOldSource) {
        const modifiedOld: Feature<Geometry, OsmObjectProperties>[] = showActionModify
          ? augmentedDiff.modified
              .filter((diff) => diff.isGeometryChanged)
              .map((diff) => diff.old)
              .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
              .filter((f) => selectedObjects[f.properties.type])
          : [];
        modifiedOldSource.setData({
          type: "FeatureCollection",
          features: modifiedOld,
        });
      }

      const modifiedNewSource = this.map.getSource("modifiedNewObjects") as GeoJSONSource;
      if (modifiedNewSource) {
        const modifiedNew: Feature<Geometry, OsmObjectProperties>[] = showActionModify
          ? augmentedDiff.modified
              .filter((diff) => diff.isGeometryChanged)
              .map((diff) => diff.new)
              .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
              .filter((f) => selectedObjects[f.properties.type])
          : [];
        modifiedNewSource.setData({
          type: "FeatureCollection",
          features: modifiedNew,
        });
      }

      const modifiedTagsSource = this.map.getSource("modifiedTagsObjects") as GeoJSONSource;
      if (modifiedTagsSource) {
        const modifiedTags: Feature<Geometry, OsmObjectProperties>[] = showActionModify
          ? augmentedDiff.modified
              .filter((diff) => !diff.isGeometryChanged)
              .map((diff) => diff.new)
              .filter((f): f is Feature<Geometry, OsmObjectProperties> => f !== null)
              .filter((f) => selectedObjects[f.properties.type])
          : [];
        modifiedTagsSource.setData({
          type: "FeatureCollection",
          features: modifiedTags,
        });
      }
    }
  }

  render() {
    return <div ref={this.mapRef} className={this.props.className} />;
  }

  private clearHoveredFeatures = () => {
    this.hoveredFeatures.forEach((hf) => {
      if (this.map) {
        this.map.removeFeatureState(hf, "hover");
      }
    });
    this.hoveredFeatures = [];
  };

  private onMouseEnter = (event: MapLayerMouseEvent) => {
    if (this.map) {
      this.map.getCanvas().style.cursor = "pointer";
    }
  };

  private onMouseLeave = (event: MapLayerMouseEvent) => {
    if (this.map) {
      this.map.getCanvas().style.cursor = "";
      this.clearHoveredFeatures();
    }
  };

  private onMouseMove = (event: MapLayerMouseEvent) => {
    this.clearHoveredFeatures();
    event.features?.forEach((f) => {
      if (this.map && f.id) {
        const hoverState = { source: f.source, id: f.id };
        this.map.setFeatureState(hoverState, { hover: true });
        this.hoveredFeatures.push(hoverState);
      }
    });
  };
}

export default AugmentedDiffMap;
