import React, { Component } from 'react';

import mapboxgl from 'mapbox-gl';

type MapProps = {
  className?: string,
}

type MapState = {
  centerLng: number,
  centerLat: number,
  zoom: number,
}

class Map extends Component<MapProps, MapState> {

  mapRef: HTMLDivElement | null = null;

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

  render() {
    const { className } = this.props;
    return (
      <div className={className} ref={(el) => this.mapRef = el}></div>
    );
  }

  private initializeMap(element: HTMLElement) {
    const map = new mapboxgl.Map({
      container: element,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=JFXtmA3oBSUWi4wQGXSN',
      center: [this.state.centerLng, this.state.centerLat],
      zoom: this.state.zoom
    });

    map.on('move', () => {
      this.setState({
        centerLng: map.getCenter().lng,
        centerLat: map.getCenter().lat,
        zoom: map.getZoom()
      });
    });
  }
}

export default Map;
