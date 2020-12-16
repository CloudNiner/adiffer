import { FillPaint, LinePaint, CirclePaint } from "mapbox-gl";

import theme from "../../theme";

export const circlePaint = (overrides: CirclePaint) => {
  const defaults: CirclePaint = {
    "circle-color": "#FFFFFF",
    "circle-opacity": 1.0,
    "circle-radius": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      5,
      4,
    ],
  };
  return Object.assign({}, defaults, overrides);
};

export const fillPaint = (overrides: FillPaint) => {
  const defaults: FillPaint = {
    "fill-color": "#FFFFFF",
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.6,
    ],
  };
  return Object.assign({}, defaults, overrides);
};

export const linePaint = (overrides: LinePaint) => {
  const defaults: LinePaint = {
    "line-color": "#FFFFFF",
    "line-width": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      4,
      3,
    ],
  };
  return Object.assign({}, defaults, overrides);
};
export const createdColor = theme.palette.osm.created;

export const createdLayerFillPaint = fillPaint({ "fill-color": createdColor });

export const createdLayerLinePaint = linePaint({ "line-color": createdColor });

export const createdLayerCirclePaint = circlePaint({
  "circle-color": createdColor,
  "circle-stroke-color": createdColor,
});

export const deletedColor = theme.palette.osm.deleted;

export const deletedLayerFillPaint = fillPaint({ "fill-color": deletedColor });

export const deletedLayerLinePaint = linePaint({ "line-color": deletedColor });

export const deletedLayerCirclePaint = circlePaint({
  "circle-color": deletedColor,
  "circle-stroke-color": deletedColor,
});

export const modifiedOldColor = theme.palette.osm.modifiedOld;

export const modifiedOldLayerFillPaint = fillPaint({
  "fill-color": modifiedOldColor,
});

export const modifiedOldLayerLinePaint = linePaint({
  "line-color": modifiedOldColor,
});

export const modifiedOldLayerCirclePaint = circlePaint({
  "circle-color": modifiedOldColor,
  "circle-stroke-color": modifiedOldColor,
});

export const modifiedNewColor = theme.palette.osm.modifiedNew;

export const modifiedNewLayerFillPaint = fillPaint({
  "fill-color": modifiedNewColor,
});

export const modifiedNewLayerLinePaint = linePaint({
  "line-color": modifiedNewColor,
});

export const modifiedNewLayerCirclePaint = circlePaint({
  "circle-color": modifiedNewColor,
  "circle-stroke-color": modifiedNewColor,
});

export const modifiedTagsColor = theme.palette.osm.modifiedTags;

export const modifiedTagsLayerFillPaint = fillPaint({
  "fill-color": modifiedTagsColor,
});

export const modifiedTagsLayerLinePaint = linePaint({
  "line-color": modifiedTagsColor,
});

export const modifiedTagsLayerCirclePaint = circlePaint({
  "circle-color": modifiedTagsColor,
  "circle-stroke-color": modifiedTagsColor,
});
