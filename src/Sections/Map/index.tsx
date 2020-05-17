import React, { Component } from 'react';

import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import mapboxgl from 'mapbox-gl';

type MapProps = {
  className?: string,
  geojsonLayer: FeatureCollection<Geometry, GeoJsonProperties>,
}

type MapState = {
  centerLng: number,
  centerLat: number,
  zoom: number,
}

class Map extends Component<MapProps, MapState> {

  mapRef: HTMLDivElement | null = null;
  map: mapboxgl.Map | null = null;
  geojsonLayerName = 'geojson-layer';

  constructor(props: MapProps) {
    super(props);

    this.state = {
      centerLng: 0,
      centerLat: 0,
      zoom: 2
    };
  }

  componentDidMount() {
    if (this.mapRef) {
      this.initializeMap(this.mapRef);
    }
  };

  componentDidUpdate(prevProps: MapProps) {
    if (this.map && this.map.isStyleLoaded() && this.props.geojsonLayer !== prevProps.geojsonLayer) {
      this.map.removeLayer(this.geojsonLayerName);
      this.map.addLayer({
        id: this.geojsonLayerName,
        type: 'fill',
        paint: {
          'fill-color': 'rgba(0, 0, 0, 1)',
          'fill-opacity': 0.8,
        },
        source: {
          type: 'geojson',
          data: this.props.geojsonLayer
        }
      });
    }
  }

  render() {
    const { className } = this.props;
    return (
      <div className={className} ref={(el) => this.mapRef = el}></div>
    );
  }

  private initializeMap(element: HTMLElement) {
    this.map = new mapboxgl.Map({
      container: element,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=JFXtmA3oBSUWi4wQGXSN',
      center: [this.state.centerLng, this.state.centerLat],
      zoom: this.state.zoom
    });

    this.map.on('move', () => {
      if (this.map) {
        this.setState({
          centerLng: this.map.getCenter().lng,
          centerLat: this.map.getCenter().lat,
          zoom: this.map.getZoom()
        });
      }
    });
  }
}

export default Map;
