import { Feature, FeatureCollection, Geometry, GeometryObject } from "geojson";
import osmtogeojson from "osmtogeojson";

import config from "./config";

import adiff from "./mock/adiff";

export enum OsmObject {
  Node = "node",
  Way = "way",
  Relation = "relation",
}

export enum ADiffAction {
  Create = "create",
  Delete = "delete",
  Modify = "modify",
}

export interface OsmObjectProperties {
  id: number;
  meta: { string: string };
  relations: any[];
  tags: { string: string };
  type: "node" | "way" | "relation";
}

export interface OsmObjectDiff {
  action: ADiffAction;
  old: Feature<Geometry, OsmObjectProperties> | null;
  new: Feature<Geometry, OsmObjectProperties> | null;
}

export interface AugmentedDiff extends Object {
  created: OsmObjectDiff[];
  modified: OsmObjectDiff[];
  deleted: OsmObjectDiff[];
}

export const osmEpoch = 1347432900;

export const dateToSequence = (date: Date): string => {
  const epoch = Math.floor(date.getTime() / 1000);
  return Math.floor((epoch - osmEpoch) / 60).toString();
};

export const sequenceToDate = (sequence: string): Date | null => {
  const sequenceInt = parseInt(sequence, 10);
  if (isNaN(sequenceInt) || sequenceInt < 0) {
    return null;
  }
  const epoch = sequenceInt * 60 + osmEpoch;
  return new Date(epoch * 1000);
};

export const isSequenceValid = (sequence: string): boolean => {
  const sequenceDate = sequenceToDate(sequence);
  return (
    Boolean(sequenceDate) && sequenceDate!.getTime() < new Date().getTime()
  );
};

const fetchAdiffString = (sequenceId: string): Promise<string> => {
  return fetch(
    `${config.overpassUri}/api/augmented_diff?id=${sequenceId}`
  ).then((response) => response.text());
};

const fetchAdiffStub = (_: string): Promise<string> => {
  return new Promise((resolve, _) => {
    setTimeout(() => resolve(adiff), 1000);
  });
};

function _osmtogeojson(
  data: JSON | Document | Element
): FeatureCollection<GeometryObject, OsmObjectProperties> {
  return osmtogeojson(data, {
    flatProperties: false,
    uninterestingTags: {},
  }) as FeatureCollection<GeometryObject, OsmObjectProperties>;
}

const filterObjects = (
  xmlDom: Document,
  action: ADiffAction
): OsmObjectDiff[] => {
  return Array.from(
    xmlDom.querySelectorAll(`action[type=${action}]`).entries()
  ).map(([_, e]) => {
    const newElement = action === ADiffAction.Create ? e : e.lastElementChild;
    const oldElement =
      action === ADiffAction.Create ? null : e.firstElementChild;
    const diff: OsmObjectDiff = {
      action,
      old: null,
      new: null,
    };
    if (oldElement && oldElement.firstElementChild) {
      diff.old = _osmtogeojson(oldElement).features[0];
    }
    if (newElement && newElement.firstElementChild) {
      diff.new = _osmtogeojson(newElement).features[0];
    }
    if (diff.old === null && diff.new === null) {
      console.warn(
        `${action} element missing old or new object!`,
        oldElement,
        newElement
      );
    }
    return diff;
  });
};

export const getAugmentedDiff = (
  sequenceId: string
): Promise<AugmentedDiff> => {
  const fetchMethod =
    process.env.NODE_ENV === "production" ? fetchAdiffString : fetchAdiffStub;
  return fetchMethod(sequenceId).then((bodyText) => {
    console.log(bodyText.slice(0, 128));
    const parser = new DOMParser();
    const xmlDom = parser.parseFromString(bodyText, "application/xml");
    const created = filterObjects(xmlDom, ADiffAction.Create);
    const deleted = filterObjects(xmlDom, ADiffAction.Delete);
    const modified = filterObjects(xmlDom, ADiffAction.Modify);
    return {
      created,
      modified,
      deleted,
    };
  });
};
