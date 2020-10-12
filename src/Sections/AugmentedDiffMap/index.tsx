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
    this.map = new mapboxgl.Map({
      container: this.mapRef.current!,
      style: "mapbox://styles/mapbox/dark-v10??optimize=true",
      center: [0, 0],
      zoom: 1,
    });
    this.map.on("load", () => {
      // Add sources for each subset of the Augmented Diff
      this.map!.addSource("deletedObjects", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      this.map!.addSource("modifiedOldObjects", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      this.map!.addSource("modifiedNewObjects", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      this.map!.addSource("modifiedTagsObjects", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });
      this.map!.addSource("createdObjects", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        promoteId: "id",
      });

      // Add layers in display order, bottom up. Render fill, then line, then points
      this.map!.addLayer({
        id: "deletedObjectsFill",
        type: "fill",
        source: "deletedObjects",
        filter: filters.isPolygon,
        paint: styles.deletedLayerFillPaint,
      });
      this.map!.on("mouseenter", "deletedObjectsFill", this.onMouseEnter);
      this.map!.on("mouseleave", "deletedObjectsFill", this.onMouseLeave);
      this.map!.on("mousemove", "deletedObjectsFill", this.onMouseMove);

      this.map!.addLayer({
        id: "modifiedOldObjectsFill",
        type: "fill",
        source: "modifiedOldObjects",
        filter: filters.isPolygon,
        paint: styles.modifiedOldLayerFillPaint,
      });
      this.map!.on("mouseenter", "modifiedOldObjectsFill", this.onMouseEnter);
      this.map!.on("mouseleave", "modifiedOldObjectsFill", this.onMouseLeave);
      this.map!.on("mousemove", "modifiedOldObjectsFill", this.onMouseMove);

      this.map!.addLayer({
        id: "modifiedNewObjectsFill",
        type: "fill",
        source: "modifiedNewObjects",
        filter: filters.isPolygon,
        paint: styles.modifiedNewLayerFillPaint,
      });
      this.map!.on("mouseenter", "modifiedNewObjectsFill", this.onMouseEnter);
      this.map!.on("mouseleave", "modifiedNewObjectsFill", this.onMouseLeave);
      this.map!.on("mousemove", "modifiedNewObjectsFill", this.onMouseMove);

      this.map!.addLayer({
        id: "modifiedTagsObjectsFill",
        type: "fill",
        source: "modifiedTagsObjects",
        filter: filters.isPolygon,
        paint: styles.modifiedTagsLayerFillPaint,
      });
      this.map!.on("mouseenter", "modifiedTagsObjectsFill", this.onMouseEnter);
      this.map!.on("mouseleave", "modifiedTagsObjectsFill", this.onMouseLeave);
      this.map!.on("mousemove", "modifiedTagsObjectsFill", this.onMouseMove);

      this.map!.addLayer({
        id: "createdObjectsFill",
        type: "fill",
        source: "createdObjects",
        filter: filters.isPolygon,
        paint: styles.createdLayerFillPaint,
      });
      this.map!.on("mouseenter", "createdObjectsFill", this.onMouseEnter);
      this.map!.on("mouseleave", "createdObjectsFill", this.onMouseLeave);
      this.map!.on("mousemove", "createdObjectsFill", this.onMouseMove);

      this.map!.addLayer({
        id: "deletedObjectsLine",
        type: "line",
        source: "deletedObjects",
        filter: filters.isLine,
        paint: styles.deletedLayerLinePaint,
      });
      this.map!.on("mouseenter", "deletedObjectsLine", this.onMouseEnter);
      this.map!.on("mouseleave", "deletedObjectsLine", this.onMouseLeave);
      this.map!.on("mousemove", "deletedObjectsLine", this.onMouseMove);

      this.map!.addLayer({
        id: "modifiedOldObjectsLine",
        type: "line",
        source: "modifiedOldObjects",
        filter: filters.isLine,
        paint: styles.modifiedOldLayerLinePaint,
      });
      this.map!.on("mouseenter", "modifiedOldObjectsLine", this.onMouseEnter);
      this.map!.on("mouseleave", "modifiedOldObjectsLine", this.onMouseLeave);
      this.map!.on("mousemove", "modifiedOldObjectsLine", this.onMouseMove);

      this.map!.addLayer({
        id: "modifiedNewObjectsLine",
        type: "line",
        source: "modifiedNewObjects",
        filter: filters.isLine,
        paint: styles.modifiedNewLayerLinePaint,
      });
      this.map!.on("mouseenter", "modifiedNewObjectsLine", this.onMouseEnter);
      this.map!.on("mouseleave", "modifiedNewObjectsLine", this.onMouseLeave);
      this.map!.on("mousemove", "modifiedNewObjectsLine", this.onMouseMove);

      this.map!.addLayer({
        id: "modifiedTagsObjectsLine",
        type: "line",
        source: "modifiedTagsObjects",
        filter: filters.isLine,
        paint: styles.modifiedTagsLayerLinePaint,
      });
      this.map!.on("mouseenter", "modifiedTagsObjectsLine", this.onMouseEnter);
      this.map!.on("mouseleave", "modifiedTagsObjectsLine", this.onMouseLeave);
      this.map!.on("mousemove", "modifiedTagsObjectsLine", this.onMouseMove);

      this.map!.addLayer({
        id: "createdObjectsLine",
        type: "line",
        source: "createdObjects",
        filter: filters.isLine,
        paint: styles.createdLayerLinePaint,
      });
      this.map!.on("mouseenter", "createdObjectsLine", this.onMouseEnter);
      this.map!.on("mouseleave", "createdObjectsLine", this.onMouseLeave);
      this.map!.on("mousemove", "createdObjectsLine", this.onMouseMove);

      this.map!.addLayer({
        id: "deletedObjectsCircle",
        type: "circle",
        source: "deletedObjects",
        filter: filters.isPoint,
        paint: styles.deletedLayerCirclePaint,
      });
      this.map!.on("mouseenter", "deletedObjectsCircle", this.onMouseEnter);
      this.map!.on("mouseleave", "deletedObjectsCircle", this.onMouseLeave);
      this.map!.on("mousemove", "deletedObjectsCircle", this.onMouseMove);

      this.map!.addLayer({
        id: "modifiedOldObjectsCircle",
        type: "circle",
        source: "modifiedOldObjects",
        filter: filters.isPoint,
        paint: styles.modifiedOldLayerCirclePaint,
      });
      this.map!.on("mouseenter", "modifiedOldObjectsCircle", this.onMouseEnter);
      this.map!.on("mouseleave", "modifiedOldObjectsCircle", this.onMouseLeave);
      this.map!.on("mousemove", "modifiedOldObjectsCircle", this.onMouseMove);

      this.map!.addLayer({
        id: "modifiedNewObjectsCircle",
        type: "circle",
        source: "modifiedNewObjects",
        filter: filters.isPoint,
        paint: styles.modifiedNewLayerCirclePaint,
      });
      this.map!.on("mouseenter", "modifiedNewObjectsCircle", this.onMouseEnter);
      this.map!.on("mouseleave", "modifiedNewObjectsCircle", this.onMouseLeave);
      this.map!.on("mousemove", "modifiedNewObjectsCircle", this.onMouseMove);

      this.map!.addLayer({
        id: "modifiedTagsObjectsCircle",
        type: "circle",
        source: "modifiedTagsObjects",
        filter: filters.isPoint,
        paint: styles.modifiedTagsLayerCirclePaint,
      });
      this.map!.on(
        "mouseenter",
        "modifiedTagsObjectsCircle",
        this.onMouseEnter
      );
      this.map!.on(
        "mouseleave",
        "modifiedTagsObjectsCircle",
        this.onMouseLeave
      );
      this.map!.on("mousemove", "modifiedTagsObjectsCircle", this.onMouseMove);

      this.map!.addLayer({
        id: "createdObjectsCircle",
        type: "circle",
        source: "createdObjects",
        filter: filters.isPoint,
        paint: styles.createdLayerCirclePaint,
      });
      this.map!.on("mouseenter", "createdObjectsCircle", this.onMouseEnter);
      this.map!.on("mouseleave", "createdObjectsCircle", this.onMouseLeave);
      this.map!.on("mousemove", "createdObjectsCircle", this.onMouseMove);
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
      augmentedDiff !== prevProps.augmentedDiff ||
      showActionCreate !== prevProps.showActionCreate ||
      showActionDelete !== prevProps.showActionDelete ||
      showActionModify !== prevProps.showActionModify ||
      showNodes !== prevProps.showNodes ||
      showWays !== prevProps.showWays ||
      showRelations !== prevProps.showRelations
    ) {
      const selectedObjects = {
        node: showNodes,
        relation: showRelations,
        way: showWays,
      };

      const created: Feature<Geometry, OsmObjectProperties>[] = showActionCreate
        ? augmentedDiff.created
            .map((diff) => diff.new)
            .filter(
              (f): f is Feature<Geometry, OsmObjectProperties> => f !== null
            )
            .filter((f) => selectedObjects[f.properties.type])
        : [];
      (this.map!.getSource("createdObjects") as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: created,
      });

      const deleted: Feature<Geometry, OsmObjectProperties>[] = showActionDelete
        ? augmentedDiff.deleted
            .map((diff) => diff.old)
            .filter(
              (f): f is Feature<Geometry, OsmObjectProperties> => f !== null
            )
            .filter((f) => selectedObjects[f.properties.type])
        : [];
      (this.map!.getSource("deletedObjects") as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: deleted,
      });

      const modifiedOld: Feature<
        Geometry,
        OsmObjectProperties
      >[] = showActionModify
        ? augmentedDiff.modified
            .filter((diff) => diff.isGeometryChanged)
            .map((diff) => diff.old)
            .filter(
              (f): f is Feature<Geometry, OsmObjectProperties> => f !== null
            )
            .filter((f) => selectedObjects[f.properties.type])
        : [];
      (this.map!.getSource("modifiedOldObjects") as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: modifiedOld,
      });

      const modifiedNew: Feature<
        Geometry,
        OsmObjectProperties
      >[] = showActionModify
        ? augmentedDiff.modified
            .filter((diff) => diff.isGeometryChanged)
            .map((diff) => diff.new)
            .filter(
              (f): f is Feature<Geometry, OsmObjectProperties> => f !== null
            )
            .filter((f) => selectedObjects[f.properties.type])
        : [];
      (this.map!.getSource("modifiedNewObjects") as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: modifiedNew,
      });

      const modifiedTags: Feature<
        Geometry,
        OsmObjectProperties
      >[] = showActionModify
        ? augmentedDiff.modified
            .filter((diff) => !diff.isGeometryChanged)
            .map((diff) => diff.new)
            .filter(
              (f): f is Feature<Geometry, OsmObjectProperties> => f !== null
            )
            .filter((f) => selectedObjects[f.properties.type])
        : [];
      (this.map!.getSource("modifiedTagsObjects") as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: modifiedTags,
      });
    }
  }

  render() {
    return <div ref={this.mapRef} className={this.props.className} />;
  }

  private clearHoveredFeatures = () => {
    this.hoveredFeatures.forEach((hf) =>
      this.map!.removeFeatureState(hf, "hover")
    );
    this.hoveredFeatures = [];
  };

  private onMouseEnter = (event: MapLayerMouseEvent) => {
    this.map!.getCanvas().style.cursor = "pointer";
  };

  private onMouseLeave = (event: MapLayerMouseEvent) => {
    this.map!.getCanvas().style.cursor = "";
    this.clearHoveredFeatures();
  };

  private onMouseMove = (event: MapLayerMouseEvent) => {
    this.clearHoveredFeatures();
    event.features?.forEach((f) => {
      if (f.id) {
        const hoverState = { source: f.source, id: f.id };
        this.map!.setFeatureState(hoverState, { hover: true });
        this.hoveredFeatures.push(hoverState);
      }
    });
  };
}

export default AugmentedDiffMap;
