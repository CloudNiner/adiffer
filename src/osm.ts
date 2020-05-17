import {FeatureCollection, Geometry} from 'geojson';
import osmtogeojson from 'osmtogeojson';

import config from './config';

export const osmEpoch = 1347432900;

export const dateToSequence = (date: Date): string => {
  const epoch = Math.floor(date.getTime() / 1000);
  return Math.floor(((epoch - osmEpoch) / 60)).toString();
}

export const sequenceToDate = (sequence: string): Date | null => {
  const sequenceInt = parseInt(sequence, 10);
  if (isNaN(sequenceInt) || sequenceInt < 0) {
    return null;
  }
  const epoch = sequenceInt * 60 + osmEpoch;
  return new Date(epoch * 1000);
}

export const isSequenceValid = (sequence: string): boolean => {
  const sequenceDate = sequenceToDate(sequence);
  return Boolean(sequenceDate) && sequenceDate!.getTime() < new Date().getTime();
}

export const getAugmentedDiff = (sequenceId: string): Promise<FeatureCollection<Geometry, any>> => {
  return fetch(`${config.overpassUri}/api/augmented_diff?id=${sequenceId}`)
    .then((response) => response.text())
    .then((bodyText) => {
      const parser = new DOMParser();
      const xmlDom = parser.parseFromString(bodyText, 'application/xml');
      const geojson = osmtogeojson(xmlDom);
      console.log(geojson.features[0]);
      return geojson as FeatureCollection<Geometry, any>
    });
}
