"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMVTRoutes = initMVTRoutes;

var _risonNode = _interopRequireDefault(require("rison-node"));

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../common/constants");

var _get_tile = require("./get_tile");

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


const CACHE_TIMEOUT = 0; // Todo. determine good value. Unsure about full-implications (e.g. wrt. time-based data).

function initMVTRoutes({
  router,
  logger
}) {
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETTILE_API_PATH}`,
    validate: {
      query: _configSchema.schema.object({
        x: _configSchema.schema.number(),
        y: _configSchema.schema.number(),
        z: _configSchema.schema.number(),
        geometryFieldName: _configSchema.schema.string(),
        requestBody: _configSchema.schema.string(),
        index: _configSchema.schema.string(),
        geoFieldType: _configSchema.schema.string(),
        searchSessionId: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    const {
      query
    } = request;

    const requestBodyDSL = _risonNode.default.decode(query.requestBody);

    const tile = await (0, _get_tile.getTile)({
      logger,
      context,
      geometryFieldName: query.geometryFieldName,
      x: query.x,
      y: query.y,
      z: query.z,
      index: query.index,
      requestBody: requestBodyDSL,
      geoFieldType: query.geoFieldType,
      searchSessionId: query.searchSessionId
    });
    return sendResponse(response, tile);
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETGRIDTILE_API_PATH}`,
    validate: {
      query: _configSchema.schema.object({
        x: _configSchema.schema.number(),
        y: _configSchema.schema.number(),
        z: _configSchema.schema.number(),
        geometryFieldName: _configSchema.schema.string(),
        requestBody: _configSchema.schema.string(),
        index: _configSchema.schema.string(),
        requestType: _configSchema.schema.string(),
        geoFieldType: _configSchema.schema.string(),
        searchSessionId: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    const {
      query
    } = request;

    const requestBodyDSL = _risonNode.default.decode(query.requestBody);

    const tile = await (0, _get_tile.getGridTile)({
      logger,
      context,
      geometryFieldName: query.geometryFieldName,
      x: query.x,
      y: query.y,
      z: query.z,
      index: query.index,
      requestBody: requestBodyDSL,
      requestType: query.requestType,
      geoFieldType: query.geoFieldType,
      searchSessionId: query.searchSessionId
    });
    return sendResponse(response, tile);
  });
}

function sendResponse(response, tile) {
  const headers = {
    'content-disposition': 'inline',
    'content-length': tile ? `${tile.length}` : `0`,
    'Content-Type': 'application/x-protobuf',
    'Cache-Control': `max-age=${CACHE_TIMEOUT}`
  };

  if (tile) {
    return response.ok({
      body: tile,
      headers
    });
  } else {
    return response.ok({
      headers
    });
  }
}