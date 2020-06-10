import React, { Component } from "react";

import { FeatureCollection, Geometry } from "geojson";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import { OsmObjectProperties } from "../../osm";

type MapProps = {
  className?: string;
  oldObjects: FeatureCollection<Geometry, OsmObjectProperties>;
  newObjects: FeatureCollection<Geometry, OsmObjectProperties>;
};

type MapState = {
  centerLng: number;
  centerLat: number;
  zoom: number;
};

class Map extends Component<MapProps, MapState> {
  mapRef: HTMLDivElement | null = null;
  map: mapboxgl.Map | null = null;
  newObjectsSourceId = "newObjectsSource";
  oldObjectsSourceId = "oldObjectsSource";

  constructor(props: MapProps) {
    super(props);

    this.state = {
      centerLng: 0,
      centerLat: 0,
      zoom: 2,
    };
  }

  componentDidMount() {
    if (this.mapRef) {
      this.initializeMap(this.mapRef);
    }
  }

  componentDidUpdate(prevProps: MapProps) {
    if (
      this.map &&
      this.map.isStyleLoaded() &&
      this.props.newObjects !== prevProps.newObjects
    ) {
      const source = this.map.getSource(
        this.newObjectsSourceId
      ) as GeoJSONSource;
      source.setData(this.props.newObjects);
    }
    if (
      this.map &&
      this.map.isStyleLoaded() &&
      this.props.oldObjects !== prevProps.oldObjects
    ) {
      const source = this.map.getSource(
        this.oldObjectsSourceId
      ) as GeoJSONSource;
      source.setData(this.props.oldObjects);
    }
  }

  render() {
    const { className } = this.props;
    return <div className={className} ref={(el) => (this.mapRef = el)}></div>;
  }

  private initializeMap(element: HTMLElement) {
    const map = new mapboxgl.Map({
      container: element,
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=JFXtmA3oBSUWi4wQGXSN",
      center: [this.state.centerLng, this.state.centerLat],
      zoom: this.state.zoom,
    });
    this.map = map;

    this.map.on("load", () => {
      map.addSource(this.newObjectsSourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: "newObjectsFillLayer",
        type: "fill",
        paint: {
          "fill-color": "#00FF00",
          "fill-opacity": 0.5,
        },
        source: this.newObjectsSourceId,
      });

      map.addLayer({
        id: "newObjectsLineLayer",
        type: "line",
        paint: {
          "line-color": "#00FF00",
          "line-width": 2,
        },
        source: this.newObjectsSourceId,
      });

      map.addLayer({
        id: "newObjectsPointLayer",
        type: "circle",
        paint: {
          "circle-color": "#00FF00",
          "circle-opacity": 0.2,
          "circle-radius": 4,
          "circle-stroke-color": "#00FF00",
          "circle-stroke-width": 1,
        },
        source: this.newObjectsSourceId,
      });

      map.addSource(this.oldObjectsSourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: "oldObjectsFillLayer",
        type: "fill",
        paint: {
          "fill-color": "#FF0000",
          "fill-opacity": 0.5,
        },
        source: this.oldObjectsSourceId,
      });

      map.addLayer({
        id: "oldObjectsLineLayer",
        type: "line",
        paint: {
          "line-color": "#FF0000",
          "line-width": 2,
        },
        source: this.oldObjectsSourceId,
      });

      map.addLayer({
        id: "oldObjectsPointLayer",
        type: "circle",
        paint: {
          "circle-color": "#FF0000",
          "circle-opacity": 0.3,
          "circle-radius": 4,
          "circle-stroke-color": "#FF0000",
          "circle-stroke-width": 1,
        },
        source: this.oldObjectsSourceId,
      });
    });

    this.map.on("move", () => {
      if (this.map) {
        this.setState({
          centerLng: this.map.getCenter().lng,
          centerLat: this.map.getCenter().lat,
          zoom: this.map.getZoom(),
        });
      }
    });

    this.map.on('mousemove', 'oldObjectsPointLayer', (e) => {
      console.log(e.features);
    });
  }
}

export default Map;
