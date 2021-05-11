"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetPingHistogramRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createGetPingHistogramRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.PING_HISTOGRAM,
  validate: {
    query: _configSchema.schema.object({
      dateStart: _configSchema.schema.string(),
      dateEnd: _configSchema.schema.string(),
      monitorId: _configSchema.schema.maybe(_configSchema.schema.string()),
      filters: _configSchema.schema.maybe(_configSchema.schema.string()),
      bucketSize: _configSchema.schema.maybe(_configSchema.schema.string()),
      _debug: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  handler: async ({
    uptimeEsClient,
    request
  }) => {
    const {
      dateStart,
      dateEnd,
      monitorId,
      filters,
      bucketSize
    } = request.query;
    return await libs.requests.getPingHistogram({
      uptimeEsClient,
      dateStart,
      dateEnd,
      monitorId,
      filters,
      bucketSize
    });
  }
});

exports.createGetPingHistogramRoute = createGetPingHistogramRoute;