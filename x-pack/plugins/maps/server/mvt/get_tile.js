"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGridTile = getGridTile;
exports.getTile = getTile;

var _geojsonVt = _interopRequireDefault(require("geojson-vt"));

var _vtPbf = _interopRequireDefault(require("vt-pbf"));

var _constants = require("../../common/constants");

var _elasticsearch_util = require("../../common/elasticsearch_util");

var _util = require("./util");

var _geo_tile_utils = require("../../common/geo_tile_utils");

var _get_centroid_features = require("../../common/get_centroid_features");

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
// @ts-expect-error


async function getGridTile({
  logger,
  context,
  index,
  geometryFieldName,
  x,
  y,
  z,
  requestBody = {},
  requestType = _constants.RENDER_AS.POINT,
  geoFieldType = _constants.ES_GEO_FIELD_TYPE.GEO_POINT,
  searchSessionId
}) {
  try {
    const tileBounds = (0, _geo_tile_utils.tileToESBbox)(x, y, z);
    requestBody.query.bool.filter.push(getTileSpatialFilter(geometryFieldName, tileBounds));
    requestBody.aggs[_constants.GEOTILE_GRID_AGG_NAME].geotile_grid.precision = Math.min(z + _constants.SUPER_FINE_ZOOM_DELTA, _constants.MAX_ZOOM);
    requestBody.aggs[_constants.GEOTILE_GRID_AGG_NAME].geotile_grid.bounds = tileBounds;
    const response = await context.search.search({
      params: {
        index,
        body: requestBody
      }
    }, {
      sessionId: searchSessionId
    }).toPromise();
    const features = (0, _elasticsearch_util.convertRegularRespToGeoJson)(response.rawResponse, requestType);
    const featureCollection = {
      features,
      type: 'FeatureCollection'
    };
    return createMvtTile(featureCollection, z, x, y);
  } catch (e) {
    logger.warn(`Cannot generate grid-tile for ${z}/${x}/${y}: ${e.message}`);
    return null;
  }
}

async function getTile({
  logger,
  context,
  index,
  geometryFieldName,
  x,
  y,
  z,
  requestBody = {},
  geoFieldType,
  searchSessionId
}) {
  let features;

  try {
    requestBody.query.bool.filter.push(getTileSpatialFilter(geometryFieldName, (0, _geo_tile_utils.tileToESBbox)(x, y, z)));
    const searchOptions = {
      sessionId: searchSessionId
    };
    const countResponse = await context.search.search({
      params: {
        index,
        body: {
          size: 0,
          query: requestBody.query
        }
      }
    }, searchOptions).toPromise();

    if (countResponse.rawResponse.hits.total > requestBody.size) {
      // Generate "too many features"-bounds
      const bboxResponse = await context.search.search({
        params: {
          index,
          body: {
            size: 0,
            query: requestBody.query,
            aggs: {
              data_bounds: {
                geo_bounds: {
                  field: geometryFieldName
                }
              }
            }
          }
        }
      }, searchOptions).toPromise();
      features = [{
        type: 'Feature',
        properties: {
          [_constants.KBN_TOO_MANY_FEATURES_PROPERTY]: true
        },
        geometry: esBboxToGeoJsonPolygon(bboxResponse.rawResponse.aggregations.data_bounds.bounds, (0, _geo_tile_utils.tileToESBbox)(x, y, z))
      }];
    } else {
      const documentsResponse = await context.search.search({
        params: {
          index,
          body: requestBody
        }
      }, searchOptions).toPromise(); // Todo: pass in epochMillies-fields

      const featureCollection = (0, _elasticsearch_util.hitsToGeoJson)(documentsResponse.rawResponse.hits.hits, hit => {
        return (0, _util.flattenHit)(geometryFieldName, hit);
      }, geometryFieldName, geoFieldType, []);
      features = featureCollection.features; // Correct system-fields.

      for (let i = 0; i < features.length; i++) {
        const props = features[i].properties;

        if (props !== null) {
          props[_constants.FEATURE_ID_PROPERTY_NAME] = features[i].id;
        }
      }
    }

    const featureCollection = {
      features,
      type: 'FeatureCollection'
    };
    return createMvtTile(featureCollection, z, x, y);
  } catch (e) {
    logger.warn(`Cannot generate tile for ${z}/${x}/${y}: ${e.message}`);
    return null;
  }
}

function getTileSpatialFilter(geometryFieldName, tileBounds) {
  return {
    geo_shape: {
      [geometryFieldName]: {
        shape: {
          type: 'envelope',
          // upper left and lower right points of the shape to represent a bounding rectangle in the format [[minLon, maxLat], [maxLon, minLat]]
          coordinates: [[tileBounds.top_left.lon, tileBounds.top_left.lat], [tileBounds.bottom_right.lon, tileBounds.bottom_right.lat]]
        },
        relation: 'INTERSECTS'
      }
    }
  };
}

function esBboxToGeoJsonPolygon(esBounds, tileBounds) {
  // Intersecting geo_shapes may push bounding box outside of tile so need to clamp to tile bounds.
  let minLon = Math.max(esBounds.top_left.lon, tileBounds.top_left.lon);
  const maxLon = Math.min(esBounds.bottom_right.lon, tileBounds.bottom_right.lon);
  minLon = minLon > maxLon ? minLon - 360 : minLon; // fixes an ES bbox to straddle dateline

  const minLat = Math.max(esBounds.bottom_right.lat, tileBounds.bottom_right.lat);
  const maxLat = Math.min(esBounds.top_left.lat, tileBounds.top_left.lat);
  return {
    type: 'Polygon',
    coordinates: [[[minLon, minLat], [minLon, maxLat], [maxLon, maxLat], [maxLon, minLat], [minLon, minLat]]]
  };
}

function createMvtTile(featureCollection, z, x, y) {
  featureCollection.features.push(...(0, _get_centroid_features.getCentroidFeatures)(featureCollection));
  const tileIndex = (0, _geojsonVt.default)(featureCollection, {
    maxZoom: 24,
    // max zoom to preserve detail on; can't be higher than 24
    tolerance: 3,
    // simplification tolerance (higher means simpler)
    extent: 4096,
    // tile extent (both width and height)
    buffer: 64,
    // tile buffer on each side
    debug: 0,
    // logging level (0 to disable, 1 or 2)
    lineMetrics: false,
    // whether to enable line metrics tracking for LineString/MultiLineString features
    promoteId: null,
    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
    generateId: false,
    // whether to generate feature ids. Cannot be used with `promoteId`
    indexMaxZoom: 5,
    // max zoom in the initial tile index
    indexMaxPoints: 100000 // max number of points per tile in the index

  });
  const tile = tileIndex.getTile(z, x, y);

  if (tile) {
    const pbf = _vtPbf.default.fromGeojsonVt({
      [_constants.MVT_SOURCE_LAYER_NAME]: tile
    }, {
      version: 2
    });

    return Buffer.from(pbf);
  } else {
    return null;
  }
}