"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertCompositeRespToGeoJson = convertCompositeRespToGeoJson;
exports.convertRegularRespToGeoJson = convertRegularRespToGeoJson;

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");

var _geo_tile_utils = require("../geo_tile_utils");

var _es_agg_utils = require("./es_agg_utils");

var _elasticsearch_geo_utils = require("./elasticsearch_geo_utils");

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


const GRID_BUCKET_KEYS_TO_IGNORE = ['key', _constants.GEOCENTROID_AGG_NAME];

function convertCompositeRespToGeoJson(esResponse, renderAs) {
  return convertToGeoJson(esResponse, renderAs, esResponse => {
    return _lodash.default.get(esResponse, 'aggregations.compositeSplit.buckets', []);
  }, gridBucket => {
    return gridBucket.key[_constants.GEOTILE_GRID_AGG_NAME];
  });
}

function convertRegularRespToGeoJson(esResponse, renderAs) {
  return convertToGeoJson(esResponse, renderAs, esResponse => {
    return _lodash.default.get(esResponse, `aggregations.${_constants.GEOTILE_GRID_AGG_NAME}.buckets`, []);
  }, gridBucket => {
    return gridBucket.key;
  });
}

function convertToGeoJson(esResponse, renderAs, pluckGridBuckets, pluckGridKey) {
  const features = [];
  const gridBuckets = pluckGridBuckets(esResponse);

  for (let i = 0; i < gridBuckets.length; i++) {
    const gridBucket = gridBuckets[i];
    const gridKey = pluckGridKey(gridBucket);
    features.push({
      type: 'Feature',
      geometry: rowToGeometry({
        gridKey,
        [_constants.GEOCENTROID_AGG_NAME]: gridBucket[_constants.GEOCENTROID_AGG_NAME],
        renderAs
      }),
      id: gridKey,
      properties: (0, _es_agg_utils.extractPropertiesFromBucket)(gridBucket, GRID_BUCKET_KEYS_TO_IGNORE)
    });
  }

  return features;
}

function rowToGeometry({
  gridKey,
  gridCentroid,
  renderAs
}) {
  const {
    top,
    bottom,
    right,
    left
  } = (0, _geo_tile_utils.getTileBoundingBox)(gridKey);

  if (renderAs === _constants.RENDER_AS.GRID) {
    return {
      type: 'Polygon',
      coordinates: [[[right, top], [left, top], [left, bottom], [right, bottom], [right, top]]]
    };
  } // see https://github.com/elastic/elasticsearch/issues/24694 for why clamp is used


  const pointCoordinates = [(0, _elasticsearch_geo_utils.clamp)(gridCentroid.location.lon, left, right), (0, _elasticsearch_geo_utils.clamp)(gridCentroid.location.lat, bottom, top)];
  return {
    type: 'Point',
    coordinates: pointCoordinates
  };
}