"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCentroidFeatures = getCentroidFeatures;

var _along = _interopRequireDefault(require("@turf/along"));

var _area = _interopRequireDefault(require("@turf/area"));

var _centerOfMass = _interopRequireDefault(require("@turf/center-of-mass"));

var _length = _interopRequireDefault(require("@turf/length"));

var _helpers = require("@turf/helpers");

var _constants = require("./constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error


function getCentroidFeatures(featureCollection) {
  const centroidFeatures = [];

  for (let i = 0; i < featureCollection.features.length; i++) {
    var _feature$properties;

    const feature = featureCollection.features[i]; // do not add centroid for kibana added features

    if ((_feature$properties = feature.properties) !== null && _feature$properties !== void 0 && _feature$properties[_constants.KBN_TOO_MANY_FEATURES_PROPERTY]) {
      continue;
    }

    let centroidGeometry = null;

    if (feature.geometry.type === _constants.GEO_JSON_TYPE.LINE_STRING) {
      centroidGeometry = getLineCentroid(feature);
    } else if (feature.geometry.type === _constants.GEO_JSON_TYPE.MULTI_LINE_STRING) {
      const coordinates = feature.geometry.coordinates;
      let longestLine = coordinates[0];
      let longestLength = (0, _length.default)((0, _helpers.lineString)(longestLine));

      for (let j = 1; j < coordinates.length; j++) {
        const nextLine = coordinates[j];
        const nextLength = (0, _length.default)((0, _helpers.lineString)(nextLine));

        if (nextLength > longestLength) {
          longestLine = nextLine;
          longestLength = nextLength;
        }
      }

      centroidGeometry = getLineCentroid((0, _helpers.lineString)(longestLine));
    } else if (feature.geometry.type === _constants.GEO_JSON_TYPE.POLYGON) {
      centroidGeometry = (0, _centerOfMass.default)(feature).geometry;
    } else if (feature.geometry.type === _constants.GEO_JSON_TYPE.MULTI_POLYGON) {
      const coordinates = feature.geometry.coordinates;
      let largestPolygon = coordinates[0];
      let largestArea = (0, _area.default)((0, _helpers.polygon)(largestPolygon));

      for (let j = 1; j < coordinates.length; j++) {
        const nextPolygon = coordinates[j];
        const nextArea = (0, _area.default)((0, _helpers.polygon)(nextPolygon));

        if (nextArea > largestArea) {
          largestPolygon = nextPolygon;
          largestArea = nextArea;
        }
      }

      centroidGeometry = (0, _centerOfMass.default)((0, _helpers.polygon)(largestPolygon)).geometry;
    } else if (feature.geometry.type === _constants.GEO_JSON_TYPE.GEOMETRY_COLLECTION) {
      throw new Error('Should not have features with geometrycollection');
    }

    if (centroidGeometry) {
      centroidFeatures.push({
        type: 'Feature',
        id: feature.id,
        properties: { ...feature.properties,
          [_constants.KBN_IS_CENTROID_FEATURE]: true
        },
        geometry: centroidGeometry
      });
    }
  }

  return centroidFeatures;
}

function getLineCentroid(feature) {
  const length = (0, _length.default)(feature);
  return (0, _along.default)(feature, length / 2).geometry;
}