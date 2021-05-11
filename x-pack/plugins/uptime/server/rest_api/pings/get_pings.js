"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetPingsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createGetPingsRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.PINGS,
  validate: {
    query: _configSchema.schema.object({
      from: _configSchema.schema.string(),
      to: _configSchema.schema.string(),
      locations: _configSchema.schema.maybe(_configSchema.schema.string()),
      monitorId: _configSchema.schema.maybe(_configSchema.schema.string()),
      index: _configSchema.schema.maybe(_configSchema.schema.number()),
      size: _configSchema.schema.maybe(_configSchema.schema.number()),
      sort: _configSchema.schema.maybe(_configSchema.schema.string()),
      status: _configSchema.schema.maybe(_configSchema.schema.string()),
      _debug: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    const {
      from,
      to,
      index,
      monitorId,
      status,
      sort,
      size,
      locations
    } = request.query;
    return await libs.requests.getPings({
      uptimeEsClient,
      dateRange: {
        from,
        to
      },
      index,
      monitorId,
      status,
      sort,
      size,
      locations: locations ? JSON.parse(locations) : []
    });
  }
});

exports.createGetPingsRoute = createGetPingsRoute;